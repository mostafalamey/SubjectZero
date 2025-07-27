// supabase.js
// Initializes Supabase client for SubjectZero
// Usage: include this file after loading the Supabase CDN in your HTML

const SUPABASE_URL = 'https://vvdaoxczygobtnvvtpun.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZGFveGN6eWdvYnRudnZ0cHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDg2NDIsImV4cCI6MjA2OTE4NDY0Mn0.2mVf57Yvgsb1oP_06xttKMtSF2XN9fwziZUByRZAOLQ';

// Make sure to include the Supabase JS CDN in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
