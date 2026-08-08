import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fqtspovnyfzvcbpuznlq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdHNwb3ZueWZ6dmNicHV6bmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMzY5MzcsImV4cCI6MjEwMTcxMjkzN30.QS8GPIbA3A0TpJueDsEdqdS0mvLXhmppodiIX0ym8IA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
