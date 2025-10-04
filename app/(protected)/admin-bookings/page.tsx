'use client';

import AdminLayout from '@/components/admin/layout/AdminLayout';
import BookingSearchPanel from '@/components/admin/bookings/BookingSearchPanel';

export default function AdminBookingsPage() {
  return (
    <AdminLayout>
      <BookingSearchPanel />
    </AdminLayout>
  );
}