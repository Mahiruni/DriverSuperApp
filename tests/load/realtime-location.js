import {check,sleep} from 'k6';import http from 'k6/http';
export const options={vus:25,duration:'30s'};
export default function(){const base=__ENV.SUPABASE_URL;const key=__ENV.SUPABASE_PUBLISHABLE_KEY;const r=http.get(`${base}/rest/v1/driver_locations?select=driver_id,updated_at&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});check(r,{'realtime read endpoint responds':x=>x.status<500});sleep(1);}
