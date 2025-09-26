import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// These should be replaced with your actual Supabase project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
