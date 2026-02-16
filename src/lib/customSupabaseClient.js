import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kmdeisowhtsalsekkzqd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZGVpc293aHRzYWxzZWtrenFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3Mzc2NTIsImV4cCI6MjA2OTMxMzY1Mn0.2mvk-rDZnHOzdx6Cgcysh51a3cflOlRWO6OA1Z5YWuQ';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
