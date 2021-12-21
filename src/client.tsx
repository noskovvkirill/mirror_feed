import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET || ''
const supabase = createClient(supabaseUrl, supabaseKey)
export { supabase }