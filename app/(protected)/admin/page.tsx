import { redirect } from 'next/navigation';
import { Button } from '@/components/I18nUI/I18nUI';
import { createServerClient } from '@/utils/supabase/server';

export default async function AdminPage() {
  async function logout() {
    'use server';
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>This is the admin page content.</p>
      <a href='admin-bookings'>See bookings</a>

      <form action={logout}>
        <Button type="submit" formAction={logout}>
          Logout
        </Button>
      </form>
    </div>
  );
}
