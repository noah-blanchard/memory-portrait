import Link from "next/link";
import { Container, Stack, Group, Card, Button, Title, Text, Badge } from "@mantine/core";
import HeroClient from "./_hero-client";

export default function Page() {
  return (
    <main>
      <Container size="lg" py="xl">
        <HeroClient />
      </Container>
    </main>
  );
}
