import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { PhoneAuth } from '../components/PhoneAuth';

export default function Index() {
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSessionReady(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSessionReady(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);
  if (sessionReady === null) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!sessionReady) return <PhoneAuth onVerified={() => router.replace('/(tabs)')} />;
  return <View style={styles.center}><Text style={styles.title}>Welcome back</Text><Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}><Text style={styles.buttonText}>Request a ride</Text></Pressable></View>;
}
const styles=StyleSheet.create({center:{flex:1,justifyContent:'center',padding:24,backgroundColor:'#F7FAFC'},title:{fontSize:28,fontWeight:'800',color:'#0B1F33',marginBottom:20},button:{minHeight:52,borderRadius:14,backgroundColor:'#0F766E',alignItems:'center',justifyContent:'center'},buttonText:{color:'#fff',fontWeight:'800',fontSize:16}});
