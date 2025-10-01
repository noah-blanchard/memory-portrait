import { Container, Group } from '@mantine/core';
import HeroClient from './_hero-client';

export default function Page() {
  return (
    <Container size="lg" py="xl" style={{ position: 'relative' }}>
      <Group style={{ position: 'absolute', bottom: 16, right: 10, zIndex: 1 }}>
      </Group>
      <HeroClient />
    </Container>
  );
}
