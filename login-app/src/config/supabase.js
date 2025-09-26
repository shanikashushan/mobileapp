import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://rtfdrjnywmihuaueswaf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0ZmRyam55d21paHVhdWVzd2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NjM2NjUsImV4cCI6MjA3NDQzOTY2NX0.8sdxKlYoB8JGzJnwmJafzu_-MwaL1MRJVcqAr8LaE38";
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})