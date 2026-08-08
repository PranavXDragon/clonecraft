import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fqtspovnyfzvcbpuznlq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdHNwb3ZueWZ6dmNicHV6bmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMzY5MzcsImV4cCI6MjEwMTcxMjkzN30.QS8GPIbA3A0TpJueDsEdqdS0mvLXhmppodiIX0ym8IA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  console.log("Fetching rows...")
  const { data: rows, error: selErr } = await supabase.from('clonecraft_assignments').select('*')
  console.log("Rows:", rows)
  if (selErr) console.error("Select error:", selErr)

  console.log("Attempting to Clear All...")
  const { data: delData, error: delErr, count } = await supabase
    .from('clonecraft_assignments')
    .delete({ count: 'exact' })
    .neq('team', 'NON_EXISTENT_DUMMY')
    .select()
  
  console.log(`Deleted ${count} rows!`)
  if (delErr) console.error("Error:", delErr)
}

test()
