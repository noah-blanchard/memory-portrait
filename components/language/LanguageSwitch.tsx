// src/components/LanguageSwitch.tsx
"use client";

import { useEffect, useState } from "react";
import { SegmentedControl, Paper, rem } from "@mantine/core";
import type { MantineTheme } from "@mantine/core";
import { useTranslation } from "react-i18next";

type Lang = "en" | "zh";
type Position = "fixed" | "absolute";

export default function LanguageSwitch({
  className,
  position = "fixed",  // <--- NEW
  offset = 12,         // <--- NEW
}: {
  className?: string;
  position?: Position;
  offset?: number;
}) {
  const { i18n } = useTranslation();
  const [value, setValue] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || null;
    const initial: Lang = saved ?? (i18n.language?.startsWith("zh") ? "zh" : "en");
    setValue(initial);
    i18n.changeLanguage(initial);
    if (typeof document !== "undefined") document.documentElement.lang = initial;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (v: string) => {
    const lng = (v === "zh" ? "zh" : "en") as Lang;
    setValue(lng);
    i18n.changeLanguage(lng);
    if (typeof document !== "undefined") document.documentElement.lang = lng;
    if (typeof window !== "undefined") localStorage.setItem("lang", lng);
  };

  return (
    <Paper
      shadow="xs"
      withBorder
      radius="xl"
      p={4}
      className={className}
      style={{
        position,
        top: offset,
        right: offset,
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <SegmentedControl
        aria-label="Language"
        value={value}
        onChange={handleChange}
        size="xs"
        radius="xl"
        color="babyBlue"
        styles={(theme: MantineTheme) => ({
          root: { boxShadow: theme.shadows.xs },
          control: { height: rem(24) },
          label: { fontSize: rem(10), fontWeight: 700, padding: `${rem(6)} ${rem(12)}`, minWidth: rem(40) },
        })}
        data={[
          { value: "en", label: "EN" },
          { value: "zh", label: "中文" },
        ]}
      />
    </Paper>
  );
}
