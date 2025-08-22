"use client";

import React, { PropsWithChildren } from "react";
import {
  Text as MantineText,
  Title as MantineTitle,
  Button as MantineButton,
  Badge as MantineBadge,
  Tooltip as MantineTooltip,
  Notification as MantineNotification,
  Modal as MantineModal,
  Anchor as MantineAnchor,
  TextProps,
  ButtonProps,
  BadgeProps,
  AnchorProps,
  TooltipProps,
  NotificationProps,
  ModalProps,
  PolymorphicComponentProps,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Props } from "next/script";

/** Traduit uniquement les nodes textuels de premier niveau (string | number). */
function trNode(node: React.ReactNode, t: (s: string) => string): React.ReactNode {
  if (typeof node === "string") return t(node);
  if (typeof node === "number") return t(String(node));
  return node; // laisse les éléments React tels quels
}

/** Traduit un tableau de children au 1er niveau. */
function trChildren(children: React.ReactNode, t: (s: string) => string): React.ReactNode {
  if (Array.isArray(children)) return children.map((c, i) => <React.Fragment key={i}>{trNode(c, t)}</React.Fragment>);
  return trNode(children, t);
}

/* ---------------------------------- Wrappers ---------------------------------- */
/** Text */
export function Text(props: PropsWithChildren<TextProps>) {
  const { t } = useTranslation("common");
  const { children, ...rest } = props;
  return <MantineText {...rest}>{trChildren(children, t)}</MantineText>;
}


/** Title */
export function Title(props: React.ComponentProps<typeof MantineTitle>) {
  const { t } = useTranslation("common");
  const { children, ...rest } = props;
  return <MantineTitle {...rest}>{trChildren(children, t)}</MantineTitle>;
}

/** Button */
export function Button(props: PolymorphicComponentProps<'button', ButtonProps>) {
  const { t } = useTranslation("common");
  const { children, ...rest } = props;
  return <MantineButton {...rest}>{trChildren(children, t)}</MantineButton>;
}

/** Badge */
export function Badge(props: BadgeProps) {
  const { t } = useTranslation("common");
  const { children, ...rest } = props;
  return <MantineBadge {...rest}>{trChildren(children, t)}</MantineBadge>;
}

/** Anchor (lien) */
export function Anchor(props: PolymorphicComponentProps<'a', AnchorProps>) {
  const { t } = useTranslation("common");
  const { children, ...rest } = props;
  return <MantineAnchor {...rest}>{trChildren(children, t)}</MantineAnchor>;
}

/** Tooltip (traduit label si string) */
export function Tooltip(props: TooltipProps) {
  const { t } = useTranslation("common");
  const { label, children, ...rest } = props;
  const translatedLabel = typeof label === "string" || typeof label === "number" ? t(String(label)) : label;
  return (
    <MantineTooltip {...rest} label={translatedLabel}>
      {children}
    </MantineTooltip>
  );
}

/** Notification (traduit children au 1er niveau) */
export function Notification(props: NotificationProps) {
  const { t } = useTranslation("common");
  const { children, ...rest } = props;
  return <MantineNotification {...rest}>{trChildren(children, t)}</MantineNotification>;
}

/** Modal (traduit title si string + children) */
export function Modal(props: ModalProps) {
  const { t } = useTranslation("common");
  const { title, children, ...rest } = props;
  const translatedTitle = typeof title === "string" || typeof title === "number" ? t(String(title)) : title;
  return (
    <MantineModal {...rest} title={translatedTitle}>
      {trChildren(children, t)}
    </MantineModal>
  );
}
