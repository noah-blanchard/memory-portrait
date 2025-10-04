import { PublicLayout } from '@/components/ui/layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
