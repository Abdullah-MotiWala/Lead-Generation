import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgdrjfbfgqjhwijawxap.supabase.co';
const supabaseKey = 'sb_publishable_CzmZfatsbIDRDNE7LXIUMA_V69FpcYw';

export const supabase = createClient(supabaseUrl, supabaseKey);