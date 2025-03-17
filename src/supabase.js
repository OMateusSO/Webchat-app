import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ftrdrusvaeyyaykbyeig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cmRydXN2YWV5eWF5a2J5ZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjAyNDksImV4cCI6MjA1Nzc5NjI0OX0.nHm1ihDuiRCSYy7YAFRVeFjC-WERWzkP-0ILamoeoNY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
