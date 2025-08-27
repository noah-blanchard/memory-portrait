import Link from 'next/link';
import { IconLockPassword } from '@tabler/icons-react';
import { Anchor, Container, Group } from '@mantine/core';
import HeroClient from './_hero-client';

export default function Page() {
  return (
    <Container size="lg" py="xl" style={{ position: 'relative' }}>
      <Group style={{ position: 'absolute', bottom: 16, right: 10, zIndex: 1 }}>
        {/* <Anchor component={Link} href="/admin-login" size="xs" fw={500}>
          <IconLockPassword size={16} style={{ marginRight: 4 }} />
          Admin Login
        </Anchor> */}
      </Group>
      <HeroClient />
    </Container>
  );
}
