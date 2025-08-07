import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqkdmozyarxhcwavvuih.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2Rtb3p5YXJ4aGN3YXZ2dWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjkyMzQsImV4cCI6MjA2NDY0NTIzNH0.El6T5wFh5TpsHi_XjxJs0Ul4o3XBi7eZQBnExpIaKcY'

// Create a single instance
export const supabase = createClient(supabaseUrl, supabaseKey)