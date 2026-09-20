import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { normalizeEthiopianPhone } from '@driver-super-app/shared';
import { supabase } from '../lib/supabase';

export function PhoneAuth({ onVerified }: { onVerified: () => void }) {
  const [digits, setDigits] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phone = `+251${digits.replace(/\D/g, '').slice(0, 9)}`;

  async function sendCode() {
    setError(''); setLoading(true);
    try {
      const normalized = normalizeEthiopianPhone(phone);
      const { error: authError } = await supabase.auth.signInWithOtp({ phone: normalized });
      if (authError) throw authError;
      setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not send code'); }
    finally { setLoading(false); }
  }

  async function verify() {
    setError(''); setLoading(true);
    try {
      const normalized = normalizeEthiopianPhone(phone);
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({ phone: normalized, token: otp, type: 'sms' });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Authentication succeeded but no user session was returned');

      const { data: existingProfile, error: profileReadError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();
      if (profileReadError) throw profileReadError;

      if (!existingProfile) {
        const { data: city, error: cityError } = await supabase
          .from('cities')
          .select('id')
          .eq('is_active', true)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        if (cityError) throw cityError;
        if (!city) throw new Error('No active service city is configured');

        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          phone: normalized,
          role: 'customer',
          city_id: city.id,
        });
        if (profileError) throw profileError;
      }
      onVerified();
    } catch (e) { setError(e instanceof Error ? e.message : 'Invalid code'); }
    finally { setLoading(false); }
  }

  return <View style={styles.container}>
    <Text style={styles.kicker}>DRIVER SUPERAPP</Text>
    <Text accessibilityRole="header" style={styles.title}>Move through your city.</Text>
    <Text style={styles.subtitle}>Sign in securely with your Ethiopian mobile number.</Text>
    <View style={styles.phoneRow}>
      <Text style={styles.prefix}>+251</Text>
      <TextInput accessibilityLabel="Ethiopian mobile number" keyboardType="phone-pad" style={styles.input} value={digits} onChangeText={setDigits} placeholder="9XXXXXXXX" maxLength={9} editable={!sent} />
    </View>
    {sent && <TextInput accessibilityLabel="One time code" keyboardType="number-pad" style={styles.inputFull} value={otp} onChangeText={setOtp} placeholder="Enter verification code" maxLength={8} />}
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Pressable accessibilityRole="button" accessibilityLabel={sent ? 'Verify code' : 'Send verification code'} disabled={loading} onPress={sent ? verify : sendCode} style={styles.button}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{sent ? 'Verify code' : 'Send code'}</Text>}
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({ container:{flex:1,justifyContent:'center',padding:24,backgroundColor:'#F7FAFC'}, kicker:{fontSize:12,fontWeight:'800',letterSpacing:2,color:'#0F766E',marginBottom:12}, title:{fontSize:34,fontWeight:'800',color:'#0B1F33',lineHeight:40}, subtitle:{fontSize:16,color:'#526273',lineHeight:24,marginTop:10,marginBottom:28}, phoneRow:{height:54,flexDirection:'row',backgroundColor:'#fff',borderWidth:1,borderColor:'#D9E1E8',borderRadius:14,alignItems:'center',paddingHorizontal:16}, prefix:{fontSize:17,fontWeight:'700',color:'#0B1F33',marginRight:8}, input:{flex:1,fontSize:17,color:'#0B1F33'}, inputFull:{height:54,backgroundColor:'#fff',borderWidth:1,borderColor:'#D9E1E8',borderRadius:14,paddingHorizontal:16,fontSize:18,marginTop:12}, button:{minHeight:52,marginTop:16,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'#0F766E'}, buttonText:{color:'#fff',fontSize:16,fontWeight:'800'}, error:{color:'#B42318',marginTop:12}}
);
