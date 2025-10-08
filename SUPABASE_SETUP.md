# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in your project details:
   - Name: `petroleum-management` (or your preferred name)
   - Database Password: Create a strong password (save this!)
   - Region: Choose the closest region to your users
4. Click "Create new project" and wait for it to finish setting up

## Step 2: Run Database Migrations

1. In your Supabase project, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and paste it
4. Click "Run" to execute the migration
5. Repeat for `supabase/migrations/002_rls_policies.sql`

## Step 3: Get Your API Credentials

1. In your Supabase project, go to **Settings** > **API** (left sidebar)
2. Find these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Add Credentials to Your App

Create a `.env.local` file in your project root (same folder as package.json):

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual credentials from Step 3.

**IMPORTANT:** Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 5: Configure Authentication

1. In Supabase, go to **Authentication** > **URL Configuration**
2. Add your app URLs to **Redirect URLs**:
   - For local development: `http://localhost:5173/**`
   - For production: Add your deployed URL (e.g., `https://yourapp.lovable.app/**`)
3. Set **Site URL** to your main app URL

## Step 6: Test the Setup

1. Restart your development server
2. Try to sign up with a new account
3. Check in Supabase **Authentication** > **Users** to see if the user was created
4. Try logging in and using the dashboard features

## Step 7: Create an Admin User (Optional)

If you want to make a user an admin:

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with the user's actual ID):

```sql
insert into public.user_roles (user_id, role)
values ('user-uuid-here', 'admin')
on conflict (user_id, role) do nothing;
```

To find a user's UUID, go to **Authentication** > **Users** and click on the user.

## Troubleshooting

### "Invalid API credentials" error
- Make sure your `.env.local` file has the correct values
- Restart your dev server after creating/updating `.env.local`

### Can't see data after login
- Check RLS policies are applied (Step 2)
- Verify user is logged in (check browser console)
- Make sure `user_id` is being set correctly in inserts

### Authentication redirect issues
- Verify Redirect URLs in Supabase (Step 5)
- Check that Site URL matches your app URL

## Database Schema

The following tables are created:

- `profiles` - User profile information
- `user_roles` - User role assignments (admin/user)
- `sales` - Daily sales records
- `expenses` - Daily expense records
- `earnings` - Daily earnings by payment mode
- `employee_cash` - Employee cash transactions
- `readings` - Fuel level readings
- `unpaid_amounts` - Unpaid amount tracking
- `notes` - Daily notes

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.
