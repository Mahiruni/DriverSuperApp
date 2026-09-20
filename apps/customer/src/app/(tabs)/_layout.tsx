import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:'#0F766E',tabBarStyle:{height:64,paddingBottom:8,paddingTop:6}}}><Tabs.Screen name="index" options={{title:'Home'}}/><Tabs.Screen name="trips" options={{title:'Trips'}}/><Tabs.Screen name="profile" options={{title:'Profile'}}/></Tabs>}
