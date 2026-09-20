import {redirect} from 'next/navigation';
import {createClient} from '../lib/supabase/server';
import Dashboard from '../ui/dashboard';

export default async function AdminPage() {
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const {data:profile} = await supabase.from('profiles').select('id,full_name,phone,role,admin_role,account_status,city_id').eq('id',user.id).single();
  if (profile?.role !== 'admin' || profile.account_status !== 'active') redirect('/login');
  return <Dashboard profile={profile}/>;
}
