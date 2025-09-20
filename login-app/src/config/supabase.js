import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://hbjcidsorfdjgvjwcwky.supabase.com";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiamNpZHNvcmZkamd2andjd2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTEyODYsImV4cCI6MjA3MzkyNzI4Nn0.9NrqxRfd_LolTQ-SnF6i2rrPAA44LFROTqX8ZD356cY";
export const supabase = createClient(supabaseUrl, supabaseKey, {
 auth: {
 storage: AsyncStorage,
 autoRefreshToken: true,
 persistSession: true,
 detectSessionInUrl: false,
 },
})