# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the project details and create the project

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the entire contents of `database-schema.sql`
3. Paste it into the SQL Editor and click "Run"

## Step 3: Create Pre-Approved Users

**IMPORTANT**: For security, only pre-specified users should be able to login.

1. In Supabase dashboard, go to Authentication > Users
2. Click "Add User" and create users manually with their email and password
3. **Disable public signups**: Go to Authentication > Providers > Email
4. Turn OFF "Enable Email Signup" (this prevents unauthorized registrations)
5. Turn ON "Enable Email Confirmations" if you want email verification

## Step 4: Get Your API Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL (under "Project API")
   - `anon` `public` key (under "Project API keys")

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in the root of your project (same level as package.json)
2. Add the following, replacing with your actual values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 6: Test the Application

1. Restart your development server
2. Try logging in with one of the pre-approved user credentials
3. Test creating sales, earnings, and expense entries

## Security Notes

- Only users created manually in the Supabase dashboard can log in
- Row Level Security (RLS) ensures users can only see their own data
- All API keys are safe to expose in the frontend (they're restricted by RLS policies)
- Never commit your `.env.local` file to version control

## Troubleshooting

If you encounter authentication errors:
1. Ensure you've disabled "Enable Email Signup" in the Email provider settings
2. Verify that the user exists in Authentication > Users
3. Check that your environment variables are correct
4. Make sure you restarted the dev server after adding `.env.local`
