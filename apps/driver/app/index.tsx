import React,{useEffect,useRef,useState}from'react';
import{Linking,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,View}from'react-native';
import MapView,{Marker,Polyline,Region}from'react-native-maps';
import*as Location from'expo-location';
import{createClient,Session}from'@supabase/supabase-js';

const url=process.env.EXPO_PUBLIC_SUPABASE_URL??'';
const key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY??'';
const db=createClient(url,key);
const NAVY='#071A2B',TEAL='#0F766E',MINT='#DDF7F1',BG='#F4F7F8',INK='#102334',MUTED='#6B7C8D',LINE='#E4EAEE',WHITE='#FFFFFF',RED='#D64545',GREEN='#159A63',AMBER='#D99017';
const money=(n:number)=>`${Math.round(n/100).toLocaleString()} Birr`;
const phone=(x:string)=>{const d=x.replace(/\\D/g,'');return d.startsWith('251')?`+${d}`:d.startsWith('0')?`+251${d.slice(1)}`:`+251${d}`};
const pt=(x:any)=>x?.coordinates?{latitude:x.coordinates[1],longitude:x.coordinates[0]}:null;
const uid=()=>crypto.randomUUID?.()??Math.random().toString(36).slice(2);

type Trip={id:string;city_id:string;customer_id:string|null;driver_id:string|null;state:string;pickup:any;destination:any;pickup_label:string|null;destination_label:string|null;total_minor:number};
type P={id:string;passenger_index:number;phone:string;status:string;pickup:any;destination:any;trip_id:string;onboard_distance_m?:number;onboard_duration_s?:number};
type Opt={id:string;amount_minor:number};

export default function App(){
 const[s,setS]=useState<Session|null>(null),[tab,setTab]=useState('home'),[online,setOnline]=useState(false),[loc,setLoc]=useState<Location.LocationObject|null>(null),[req,setReq]=useState<Trip[]>([]),[trip,setTrip]=useState<Trip|null>(null),[ps,setPs]=useState<P[]>([]),[opts,setOpts]=useState<Opt[]>([]),[earn,setEarn]=useState(0),[completed,setCompleted]=useState(0),[cancelled,setCancelled]=useState(0),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[form,setForm]=useState({phone:'',pl:'',pg:'',dl:'',dg:''});
 const[sub,setSub]=useState<Location.LocationSubscription|null>(null),[timer,setTimer]=useState(0),interval=useRef<any>();
 const[channel]=useState(()=>db.channel('driver-realtime'));

 useEffect(()=>{if(!url||!key){setMsg('Supabase environment variables are missing.');return}db.auth.getSession().then(({data})=>setS(data.session));const x=db.auth.onAuthStateChange((_e,v)=>setS(v));return()=>x.data.subscription.unsubscribe()},[]);
 useEffect(()=>{if(!s)return;load();channel.on('postgres_changes',{event:'*',schema:'public',table:'trips'},load).subscribe();return()=>{channel.unsubscribe();sub?.remove()}},[s]);
 useEffect(()=>{if(timer>0)interval.current=setInterval(()=>setTimer(x=>Math.max(0,x-1)),1000);return()=>clearInterval(interval.current)},[timer]);
 useEffect(()=>{if(!online||!s){sub?.remove();return}startGps();return()=>sub?.remove()},[online,s]);

 async function load(){
  const[{data:r},{data:o},{data:e},{data:c}]=await Promise.all([
   db.from('trips').select('*').eq('state','requested').is('driver_id',null).order('requested_at').limit(10),
   db.from('addon_fees').select('id,amount_minor').eq('status','option').order('amount_minor'),
   db.from('trips').select('total_minor').eq('driver_id',s!.user.id).eq('state','completed'),
   db.from('trips').select('id').eq('driver_id',s!.user.id).eq('state','cancelled')
  ]);
  if(r)setReq(r as Trip[]);if(o)setOpts(o as Opt[]);
  setEarn((e??[]).reduce((a:any,x:any)=>a+Number(x.total_minor||0),0));setCompleted((e??[]).length);setCancelled((c??[]).length);
 }
 async function startGps(){
  const p=await Location.requestForegroundPermissionsAsync();if(p.status!=='granted'){setOnline(false);setMsg('Location permission is required while online.');return}
  const driver=(await db.from('drivers').select('city_id').eq('id',s!.user.id).single()).data;
  setSub(await Location.watchPositionAsync({accuracy:Location.Accuracy.High,distanceInterval:10,timeInterval:5000},async l=>{setLoc(l);if(driver?.city_id)await db.from('driver_locations').upsert({driver_id:s!.user.id,city_id:driver.city_id,location:`POINT(${l.coords.longitude} ${l.coords.latitude})`,heading:l.coords.heading,speed_mps:l.coords.speed,accuracy_m:l.coords.accuracy,updated_at:new Date().toISOString()},{onConflict:'driver_id'})}));
 }
 async function accept(t:Trip){
  setBusy(true);const{data,error}=await db.from('trips').update({driver_id:s!.user.id,state:'accepted',accepted_at:new Date().toISOString()}).eq('id',t.id).eq('state','requested').is('driver_id',null).select().single();setBusy(false);
  if(error)setMsg(error.message);else{setTrip(data as Trip);setReq(req.filter(x=>x.id!==t.id));setTimer(0);setMsg('Trip accepted. Navigate to pickup.')}
 }
 async function state(v:string){
  if(!trip)return;setBusy(true);const patch:any={state:v};if(v==='completed')patch.completed_at=new Date().toISOString();if(v==='cancelled')patch.cancelled_at=new Date().toISOString();
  const{data,error}=await db.from('trips').update(patch).eq('id',trip.id).eq('driver_id',s!.user.id).select().single();setBusy(false);
  if(error)setMsg(error.message);else{setTrip(v==='completed'||v==='cancelled'?null:data as Trip);setMsg(v==='completed'?'Trip completed. Earnings updated.':'');load()}
 }
 async function shared(){if(!trip)return;const{error}=await db.from('shared_rides').insert({city_id:trip.city_id,trip_id:trip.id,driver_id:s!.user.id,customer_id:trip.customer_id,state:'pending'});setMsg(error?.message??'Shared ride created.')}
 async function loadP(){if(!trip)return;const{data}=await db.from('shared_ride_passengers').select('*').eq('trip_id',trip.id).order('passenger_index');if(data)setPs(data as P[])}
 async function addP(){
  if(!trip)return;if(ps.length>=4){setMsg('Maximum 4 passengers reached.');return}const f=form;if(!/^\\+2519\\d{8}$/.test(phone(f.phone))){setMsg('Enter a valid Ethiopian mobile number.');return}
  const n=[f.pl,f.pg,f.dl,f.dg].map(Number);if(n.some(Number.isNaN)){setMsg('Enter all four coordinates.');return}
  const{data:r}=await db.from('shared_rides').select('id').eq('trip_id',trip.id).eq('driver_id',s!.user.id).limit(1);if(!r?.[0]){setMsg('Create the shared ride first.');return}
  setBusy(true);const{data,error}=await db.rpc('add_shared_ride_passenger',{p_shared_ride_id:r[0].id,p_phone:phone(f.phone),p_pickup_lat:n[0],p_pickup_lng:n[1],p_destination_lat:n[2],p_destination_lng:n[3]});setBusy(false);
  if(error)setMsg(error.message);else{setPs([...ps,data as P[]]);setForm({phone:'',pl:'',pg:'',dl:'',dg:''});setMsg('Passenger invited; confirmation is required before departure.')}
 }
 async function finishP(p:P){const{error}=await db.rpc('complete_shared_passenger',{p_passenger_id:p.id,p_distance_m:p.onboard_distance_m??0,p_duration_s:p.onboard_duration_s??0});setMsg(error?.message??'Passenger fare finalized server-side.');loadP()}
 async function addon(a:number){if(!trip)return;const{error}=await db.rpc('add_driver_addon',{p_trip_id:trip.id,p_amount_minor:a,p_idempotency_key:uid(),p_lat:loc?.coords.latitude??null,p_lng:loc?.coords.longitude??null});setMsg(error?.message??`${money(a)} add-on sent to customer.`)}
 const region:Region=loc?{latitude:loc.coords.latitude,longitude:loc.coords.longitude,latitudeDelta:.025,longitudeDelta:.025}:{latitude:9.03,longitude:38.74,latitudeDelta:.08,longitudeDelta:.08};
 const route=ps.flatMap(p=>[pt(p.pickup),pt(p.destination)]).filter(Boolean) as any[];
 const rate=completed+cancelled?Math.round(completed/(completed+cancelled)*100):100;

 if(!s)return <SafeAreaView style={st.center}><View style={st.loginMark}><Text style={st.loginMarkText}>D</Text></View><Text style={st.loginTitle}>Driver workspace</Text><Text style={st.muted}>Use your authenticated Supabase driver session.</Text></SafeAreaView>;

 return <SafeAreaView style={st.screen}>
  <View style={st.header}>
   <View><Text style={st.eyebrow}>DRIVER / {online?'LIVE':'OFFLINE'}</Text><Text style={st.headerTitle}>Good to see you.</Text></View>
   <Pressable accessibilityLabel="Online status" onPress={()=>setOnline(!online)} style={[st.statusPill,online&&st.statusPillLive]}><View style={[st.statusDot,{backgroundColor:online?GREEN:'#92A0AD'}]}/><Text style={[st.statusText,online&&{color:GREEN}]}>{online?'Online':'Offline'}</Text></Pressable>
  </View>
  {msg?<Pressable onPress={()=>setMsg('')} style={st.notice}><Text style={st.noticeText}>{msg}</Text><Text style={st.noticeX}>×</Text></Pressable>:null}

  {tab==='home'?<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.content}>
   <View style={st.hero}>
    <View style={st.heroTop}><View><Text style={st.heroEyebrow}>TODAY'S PERFORMANCE</Text><Text style={st.heroMoney}>{money(earn)}</Text></View><View style={st.heroRing}><Text style={st.heroRingValue}>{rate}%</Text><Text style={st.heroRingLabel}>reliability</Text></View></View>
    <View style={st.heroMeta}><Metric label="COMPLETED" value={String(completed)}/><Metric label="REQUESTS" value={String(req.length)}/><Metric label="ACTIVE" value={trip?'1':'0'}/></View>
   </View>

   <SectionTitle title="Your shift" action={online?'Receiving trips':'Paused'}/>
   <View style={st.shiftCard}>
    <View style={st.shiftIcon}><Text style={st.shiftIconText}>{online?'●':'Ⅱ'}</Text></View><View style={{flex:1}}><Text style={st.cardTitle}>{online?'You are available':'You are offline'}</Text><Text style={st.muted}>{online?'New trip requests will appear here.':'Go online when you are ready to start earning.'}</Text></View>
    <Pressable onPress={()=>setOnline(!online)} style={[st.primarySmall,!online&&st.primarySmallDark]}><Text style={st.primaryText}>{online?'Pause':'Go online'}</Text></Pressable>
   </View>

   {trip?<View style={st.focusCard}><View style={st.focusHeader}><View><Text style={st.eyebrow}>ACTIVE TRIP</Text><Text style={st.focusTitle}>{trip.pickup_label??'Pickup'} → {trip.destination_label??'Destination'}</Text></View><Text style={st.focusFare}>{money(trip.total_minor||0)}</Text></View><View style={st.progress}><View style={[st.progressFill,{width:trip.state==='accepted'?'30%':trip.state==='arriving'?'60%':'85%'}]}/></View><View style={st.actionGrid}><Action label="Arriving" onPress={()=>state('arriving')}/><Action label="Start trip" onPress={()=>state('in_progress')}/><Action label="Complete" onPress={()=>state('completed')}/><Action label="Cancel" danger onPress={()=>state('cancelled')}/></View><Pressable style={st.navigate} onPress={()=>{const p=pt(trip.destination);if(p)Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`)}}><Text style={st.navigateText}>Open turn-by-turn navigation ↗</Text></Pressable></View>:null}

   <SectionTitle title="Live map" action={loc?'GPS active':'GPS waiting'}/>
   <View style={st.map}><MapView style={{flex:1}} region={region} showsUserLocation><Marker coordinate={region} title="You"/>{trip&&pt(trip.pickup)?<Marker coordinate={pt(trip.pickup)!} title="Pickup"/>:null}{trip&&pt(trip.destination)?<Marker coordinate={pt(trip.destination)!} title="Destination"/>:null}{ps.map(p=><React.Fragment key={p.id}><Marker coordinate={pt(p.pickup)!} title={`P${p.passenger_index} pickup`}/><Marker coordinate={pt(p.destination)!} title={`P${p.passenger_index} dropoff`}/></React.Fragment>)}<Polyline coordinates={route} strokeColor={TEAL} strokeWidth={4}/></MapView><View style={st.mapOverlay}><Text style={st.mapOverlayText}>{online?'LIVE LOCATION':'MAP PREVIEW'}</Text></View></View>

   {!trip&&<><SectionTitle title="Trip requests" action={req.length?String(req.length):'All clear'}/>{req.length?req.map(r=><View key={r.id} style={st.requestCard}><View style={st.requestMain}><View style={st.requestDot}/><View style={{flex:1}}><Text style={st.cardTitle}>{r.pickup_label??'Pickup location'}</Text><Text style={st.muted}>{r.destination_label??'Destination'}</Text></View><Text style={st.requestFare}>{money(r.total_minor||0)}</Text></View><View style={st.requestActions}><Pressable onPress={()=>setReq(req.filter(x=>x.id!==r.id))} style={st.decline}><Text style={st.declineText}>Decline</Text></Pressable><Pressable disabled={busy} onPress={()=>{setTimer(30);accept(r)}} style={st.accept}>{<Text style={st.acceptText}>{timer?`Accept ${timer}s`:'Accept trip'}</Text>}</Pressable></View></View>):<View style={st.emptyCard}><View style={st.emptyIcon}><Text>✓</Text></View><Text style={st.cardTitle}>{online?'You are ready for requests':'Your shift is paused'}</Text><Text style={[st.muted,{textAlign:'center'}]}>{online?'Keep this screen open and new trips will arrive in real time.':'Go online above to begin receiving trips.'}</Text></View>}</>}

   <SectionTitle title="Performance" action="Live data"/>
   <View style={st.performance}><Perf label="Trip completion" value={`${rate}%`} detail={`${completed} completed · ${cancelled} cancelled`}/><Perf label="Today's earnings" value={money(earn)} detail="Completed trips only"/><Perf label="Passenger capacity" value={`${ps.length}/4`} detail="Shared ride capacity"/></View>
  </ScrollView>:
  tab==='earnings'?<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.content}><View style={st.earningsHero}><Text style={st.heroEyebrow}>TOTAL COMPLETED EARNINGS</Text><Text style={st.earningsAmount}>{money(earn)}</Text><Text style={st.mutedLight}>{completed} completed trips recorded in Supabase</Text></View><SectionTitle title="Earnings snapshot" action="Today"/><View style={st.performance}><Perf label="Gross earnings" value={money(earn)} detail="From completed trips"/><Perf label="Completed trips" value={String(completed)} detail="Server records"/><Perf label="Cancellation count" value={String(cancelled)} detail="Driver trips"/></View><Pressable style={st.refresh} onPress={load}><Text style={st.refreshText}>Refresh live earnings</Text></Pressable></ScrollView>:
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.content}><View style={st.profileCard}><View style={st.avatar}><Text style={st.avatarText}>D</Text></View><Text style={st.profileName}>Driver account</Text><Text style={st.muted}>{s.user.phone??s.user.email??'Authenticated driver'}</Text><View style={st.profileLine}/><ProfileRow label="Availability" value={online?'Online':'Offline'}/><ProfileRow label="GPS publishing" value={online?'Active':'Paused'}/><ProfileRow label="Account security" value="Supabase Auth"/></View><View style={st.profileCard}><Text style={st.cardTitle}>Operational controls</Text><Text style={st.muted}>Trip state, fares, passenger limits and add-ons are validated server-side. Credentials and service secrets are never bundled in the app.</Text></View></ScrollView>}

  {trip&&tab==='home'?<View style={st.bottomSheet}><View style={st.sheetHandle}/><Text style={st.sheetTitle}>Shared ride tools</Text><View style={st.sheetRow}><Pressable style={st.sheetButton} onPress={shared}><Text style={st.sheetButtonText}>Start shared ride</Text></Pressable><Pressable style={st.sheetButtonGhost} onPress={loadP}><Text style={st.sheetButtonGhostText}>Refresh passengers</Text></Pressable></View><View style={st.addonRow}>{opts.slice(0,3).map(o=><Pressable key={o.id} onPress={()=>addon(o.amount_minor)} style={st.addon}><Text style={st.addonText}>+${money(o.amount_minor).replace(' Birr','')}</Text></Pressable>)}</View></View>:null}

  <View style={st.tabs}>{[['home','Home','⌂'],['earnings','Earnings','↗'],['profile','Profile','◯']].map(([x,label,icon])=><Pressable key={x} accessibilityRole="tab" accessibilityState={{selected:tab===x}} style={st.tab} onPress={()=>setTab(x)}><Text style={[st.tabIcon,tab===x&&st.tabActive]}>{icon}</Text><Text style={[st.tabText,tab===x&&st.tabActive]}>{label}</Text></Pressable>)}</View>
 </SafeAreaView>
}

function Metric({label,value}:{label:string;value:string}){return <View style={st.metric}><Text style={st.metricLabel}>{label}</Text><Text style={st.metricValue}>{value}</Text></View>}
function SectionTitle({title,action}:{title:string;action:string}){return <View style={st.sectionTitle}><Text style={st.sectionHeading}>{title}</Text><Text style={st.sectionAction}>{action}</Text></View>}
function Action({label,onPress,danger}:{label:string;onPress:()=>void;danger?:boolean}){return <Pressable disabled={false} onPress={onPress} style={[st.action,danger&&st.actionDanger]}><Text style={[st.actionText,danger&&st.actionDangerText]}>{label}</Text></Pressable>}
function Perf({label,value,detail}:{label:string;value:string;detail:string}){return <View style={st.perf}><View style={st.perfTop}><Text style={st.perfLabel}>{label}</Text><Text style={st.perfValue}>{value}</Text></View><Text style={st.perfDetail}>{detail}</Text></View>}
function ProfileRow({label,value}:{label:string;value:string}){return <View style={st.profileRow}><Text style={st.muted}>{label}</Text><Text style={st.profileValue}>{value}</Text></View>}

const st=StyleSheet.create({
 screen:{flex:1,backgroundColor:BG},content:{padding:18,paddingBottom:180,gap:16},center:{flex:1,justifyContent:'center',alignItems:'center',padding:28,backgroundColor:BG},loginMark:{width:64,height:64,borderRadius:22,backgroundColor:TEAL,alignItems:'center',justifyContent:'center',marginBottom:18},loginMarkText:{fontSize:30,fontWeight:'900',color:WHITE},loginTitle:{fontSize:25,fontWeight:'900',color:INK,marginBottom:8},muted:{color:MUTED,lineHeight:21},mutedLight:{color:'#C5D4DC',lineHeight:21},
 header:{backgroundColor:WHITE,paddingHorizontal:18,paddingTop:16,paddingBottom:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:LINE},eyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.5,color:TEAL},headerTitle:{fontSize:25,fontWeight:'900',color:INK,marginTop:3},statusPill:{paddingHorizontal:13,height:40,borderRadius:20,backgroundColor:'#EEF2F4',flexDirection:'row',alignItems:'center',gap:7},statusPillLive:{backgroundColor:MINT},statusDot:{width:8,height:8,borderRadius:4},statusText:{fontWeight:'900',color:INK},
 notice:{marginHorizontal:14,marginTop:10,minHeight:44,borderRadius:14,backgroundColor:MINT,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},noticeText:{flex:1,color:TEAL,fontWeight:'800'},noticeX:{fontSize:22,color:TEAL,paddingLeft:10},
 hero:{backgroundColor:NAVY,borderRadius:24,padding:20,overflow:'hidden'},heroTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},heroEyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.5,color:'#8DD8CC'},heroMoney:{fontSize:35,fontWeight:'900',color:WHITE,marginTop:5},heroRing:{width:74,height:74,borderRadius:37,borderWidth:5,borderColor:'#2D897E',alignItems:'center',justifyContent:'center'},heroRingValue:{fontSize:19,fontWeight:'900',color:WHITE},heroRingLabel:{fontSize:8,fontWeight:'800',color:'#AFC4CC'},heroMeta:{marginTop:20,paddingTop:15,borderTopWidth:1,borderTopColor:'#244054',flexDirection:'row'},metric:{flex:1},metricLabel:{fontSize:9,fontWeight:'900',letterSpacing:1,color:'#8EA5B1'},metricValue:{fontSize:19,fontWeight:'900',color:WHITE,marginTop:4},
 sectionTitle:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:3},sectionHeading:{fontSize:19,fontWeight:'900',color:INK},sectionAction:{fontSize:12,fontWeight:'800',color:TEAL},
 shiftCard:{backgroundColor:WHITE,borderRadius:18,padding:15,flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,borderColor:LINE},shiftIcon:{width:44,height:44,borderRadius:15,backgroundColor:MINT,alignItems:'center',justifyContent:'center'},shiftIconText:{fontSize:18,fontWeight:'900',color:TEAL},cardTitle:{fontSize:15,fontWeight:'900',color:INK,marginBottom:2},primarySmall:{backgroundColor:TEAL,paddingHorizontal:14,height:42,borderRadius:13,alignItems:'center',justifyContent:'center'},primarySmallDark:{backgroundColor:NAVY},primaryText:{color:WHITE,fontWeight:'900'},
 focusCard:{backgroundColor:WHITE,borderRadius:20,padding:16,borderWidth:1,borderColor:LINE},focusHeader:{flexDirection:'row',justifyContent:'space-between',gap:10},focusTitle:{fontSize:17,fontWeight:'900',color:INK,marginTop:4},focusFare:{fontSize:18,fontWeight:'900',color:TEAL},progress:{height:7,borderRadius:4,backgroundColor:'#E7ECEF',overflow:'hidden',marginVertical:16},progressFill:{height:7,borderRadius:4,backgroundColor:TEAL},actionGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},action:{flex:1,minWidth:'46%',height:46,borderRadius:12,backgroundColor:NAVY,alignItems:'center',justifyContent:'center'},actionText:{color:WHITE,fontWeight:'900'},actionDanger:{backgroundColor:'#FFF0F0'},actionDangerText:{color:RED},navigate:{marginTop:10,height:46,borderRadius:12,backgroundColor:'#EFF8F6',alignItems:'center',justifyContent:'center'},navigateText:{color:TEAL,fontWeight:'900'},
 map:{height:270,borderRadius:20,overflow:'hidden',backgroundColor:'#DCE6E9',borderWidth:1,borderColor:LINE},mapOverlay:{position:'absolute',top:12,left:12,borderRadius:10,backgroundColor:'rgba(7,26,43,.88)',paddingHorizontal:10,paddingVertical:7},mapOverlayText:{color:WHITE,fontSize:9,fontWeight:'900',letterSpacing:1},
 requestCard:{backgroundColor:WHITE,borderRadius:18,padding:15,borderWidth:1,borderColor:LINE},requestMain:{flexDirection:'row',alignItems:'center',gap:11},requestDot:{width:10,height:10,borderRadius:5,backgroundColor:TEAL},requestFare:{fontSize:16,fontWeight:'900',color:INK},requestActions:{flexDirection:'row',gap:9,marginTop:14},decline:{flex:1,height:45,borderRadius:12,backgroundColor:'#F1F4F5',alignItems:'center',justifyContent:'center'},declineText:{fontWeight:'900',color:INK},accept:{flex:1,height:45,borderRadius:12,backgroundColor:TEAL,alignItems:'center',justifyContent:'center'},acceptText:{fontWeight:'900',color:WHITE},
 emptyCard:{backgroundColor:WHITE,borderRadius:18,padding:25,alignItems:'center',borderWidth:1,borderColor:LINE},emptyIcon:{width:44,height:44,borderRadius:22,backgroundColor:MINT,alignItems:'center',justifyContent:'center',marginBottom:10},emptyIcon:{width:44,height:44,borderRadius:22,backgroundColor:MINT,alignItems:'center',justifyContent:'center',marginBottom:10},
 performance:{backgroundColor:WHITE,borderRadius:18,borderWidth:1,borderColor:LINE,overflow:'hidden'},perf:{padding:15,borderBottomWidth:1,borderBottomColor:LINE},perfTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},perfLabel:{fontSize:13,fontWeight:'800',color:INK},perfValue:{fontSize:17,fontWeight:'900',color:TEAL},perfDetail:{fontSize:11,color:MUTED,marginTop:4},
 earningsHero:{backgroundColor:NAVY,borderRadius:24,padding:22},earningsAmount:{fontSize:40,fontWeight:'900',color:WHITE,marginVertical:6},refresh:{height:50,borderRadius:14,backgroundColor:TEAL,alignItems:'center',justifyContent:'center'},refreshText:{color:WHITE,fontWeight:'900'},
 profileCard:{backgroundColor:WHITE,borderRadius:20,padding:18,borderWidth:1,borderColor:LINE},avatar:{width:64,height:64,borderRadius:22,backgroundColor:NAVY,alignItems:'center',justifyContent:'center',marginBottom:12},avatarText:{fontSize:27,fontWeight:'900',color:WHITE},profileName:{fontSize:21,fontWeight:'900',color:INK,marginBottom:4},profileLine:{height:1,backgroundColor:LINE,marginVertical:16},profileRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:10},profileValue:{fontWeight:'900',color:INK},
 bottomSheet:{position:'absolute',left:0,right:0,bottom:78,backgroundColor:WHITE,borderTopLeftRadius:24,borderTopRightRadius:24,padding:14,paddingBottom:10,borderTopWidth:1,borderColor:LINE},sheetHandle:{width:36,height:4,borderRadius:2,backgroundColor:'#CBD5DB',alignSelf:'center',marginBottom:8},sheetTitle:{fontSize:15,fontWeight:'900',color:INK,marginBottom:9},sheetRow:{flexDirection:'row',gap:8},sheetButton:{flex:1,height:42,borderRadius:11,backgroundColor:NAVY,alignItems:'center',justifyContent:'center'},sheetButtonText:{color:WHITE,fontWeight:'900',fontSize:12},sheetButtonGhost:{flex:1,height:42,borderRadius:11,backgroundColor:MINT,alignItems:'center',justifyContent:'center'},sheetButtonGhostText:{color:TEAL,fontWeight:'900',fontSize:12},addonRow:{flexDirection:'row',gap:8,marginTop:8},addon:{flex:1,height:34,borderRadius:9,backgroundColor:'#F3F6F7',alignItems:'center',justifyContent:'center'},addonText:{fontSize:11,fontWeight:'900',color:INK},
 tabs:{position:'absolute',bottom:0,left:0,right:0,height:80,backgroundColor:WHITE,borderTopWidth:1,borderTopColor:LINE,flexDirection:'row',paddingBottom:8},tab:{flex:1,alignItems:'center',justifyContent:'center',gap:3},tabIcon:{fontSize:20,color:'#98A7B2'},tabText:{fontSize:11,fontWeight:'900',color:'#98A7B2'},tabActive:{color:TEAL}
});
