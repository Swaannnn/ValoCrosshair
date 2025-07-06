import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://paycakvhziwcmtwnsqjm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBheWNha3Zoeml3Y210d25zcWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjUwMjcsImV4cCI6MjA2NzMwMTAyN30.chWnZwix4EAO8x6BA8OoqCpFJuJODBIN2ySvJdNDmEA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
