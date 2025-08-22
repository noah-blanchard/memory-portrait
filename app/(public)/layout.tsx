import LanguageSwitch from '@/components/language/LanguageSwitch';
import PublicLayout from '@/components/layouts/PublicLayout';

export default function PublicGroupLayout({ children }: { children: React.ReactNode }) {
  // Pas de Mantine ici directement pour éviter les soucis RSC.
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  );
}
