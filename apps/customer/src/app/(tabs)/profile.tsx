import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
export default function Profile(){return <View style={styles.screen}><Text style={styles.title}>Profile</Text><Pressable style={styles.card} onPress={()=>router.push('/bulk-order')}><Text style={styles.cardTitle}>Bulk Order</Text><Text style={styles.muted}>Request business quantities with a photo.</Text></Pressable><Pressable style={styles.signout} onPress={()=>supabase.auth.signOut()}><Text style={styles.signoutText}>Sign out</Text></Pressable></View>}
const styles=StyleSheet.create({screen:{flex:1,padding:20,backgroundColor:'#F7FAFC'},title:{fontSize:30,fontWeight:'900',color:'#0B1F33',marginTop:30,marginBottom:18},card:{backgroundColor:'#fff',padding:18,borderRadius:16,borderWidth:1,borderColor:'#E4EAF0'},cardTitle:{fontSize:18,fontWeight:'800',color:'#0B1F33'},muted:{color:'#64748B',marginTop:5},signout:{marginTop:20,minHeight:50,borderRadius:14,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#B8C6D1'},signoutText:{fontWeight:'800',color:'#B42318'}});
