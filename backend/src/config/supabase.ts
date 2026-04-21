import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseKey;

if (!isConfigured) {
  console.warn('⚠️  Supabase URL or Key is missing. Database operations will fail.');
  console.warn('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
}

// Create a proxy to prevent crashing the server if supabase is not configured
// This allows the server to start even if the database is not ready
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : new Proxy({} as any, {
      get: () => {
        throw new Error('Supabase client is not configured. Check your .env file.');
      }
    });
