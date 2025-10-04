'use client';

import { AdminLayout, BookingSearchPanel } from '@/components/features/admin';

export default function AdminBookingsPage() {
  return (
    <AdminLayout>
      <BookingSearchPanel />
    </AdminLayout>
  );
}