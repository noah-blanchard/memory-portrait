import { AdminLayout } from '@/components/features/admin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
