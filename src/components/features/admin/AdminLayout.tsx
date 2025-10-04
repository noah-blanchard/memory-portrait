'use client';

import { useRouter } from 'next/navigation';
import {
  IconDashboard,
  IconCalendar,
  IconLogout,
} from '@tabler/icons-react';
import {
  AppShell,
  Burger,
  Group,
  Text,
  UnstyledButton,
  Stack,
  Divider,
  Box,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Button, Title } from '@/components/common/i18n';
import { createClient } from '@/utils/supabase/client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { icon: IconDashboard, label: 'Dashboard', href: '/admin', color: 'blue' },
    { icon: IconCalendar, label: 'Bookings', href: '/admin-bookings', color: 'green' },
    //{ icon: IconSettings, label: 'Settings', href: '/admin-settings', color: 'gray' },
  ];

  const NavItem = ({ icon: Icon, label, href, color }: typeof navItems[0]) => (
    <UnstyledButton
      onClick={() => {
        router.push(href);
        closeMobile();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
        width: '100%',
        textAlign: 'left',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Icon size={20} color={`var(--mantine-color-${color}-6)`} />
      <Text size="sm" fw={500}>
        {label}
      </Text>
    </UnstyledButton>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Title order={3} c="ocean.8">
              Memory Studio
            </Title>
          </Group>

        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <AppShell.Section grow component={ScrollArea}>
          <Box p="md">
            <Stack gap="xs">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </Stack>
          </Box>
        </AppShell.Section>

        <AppShell.Section>
          <Divider />
          <Box p="md">
            <Button
              variant="light"
              color="red"
              leftSection={<IconLogout size={16} />}
              onClick={handleLogout}
              fullWidth
              size="sm"
            >
              Logout
            </Button>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main
        style={{
          minHeight: '100vh',
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
