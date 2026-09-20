import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
export default function DriverHome(){return <View style={styles.screen}><Text style={styles.title}>Driver App</Text><Text style={styles.muted}>Part 2 foundation is ready. Driver trip acceptance, location publishing and earnings will build on the shared schema.</Text><Link href="/" style={styles.link}>Continue</Link></View>}
const styles=StyleSheet.create({screen:{flex:1,justifyContent:'center',padding:24},title:{fontSize:30,fontWeight:'900'},muted:{color:'#64748B',lineHeight:24,marginTop:10},link:{marginTop:20,color:'#0F766E',fontWeight:'800'}});
