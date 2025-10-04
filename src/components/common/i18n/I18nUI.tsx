'use client';

import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertProps,
  BadgeProps,
  DividerProps,
  InputLabelProps,
  Alert as MantineAlert,
  Anchor as MantineAnchor,
  Badge as MantineBadge,
  Button as MantineButton,
  Divider as MantineDivider,
  InputLabel as MantineInputLabel,
  Menu as MantineMenu,
  Modal as MantineModal,
  Notification as MantineNotification,
  Text as MantineText,
  Title as MantineTitle,
  Tooltip as MantineTooltip,
  MenuItemProps,
  MenuLabelProps,
  MenuProps,
  ModalProps,
  NotificationProps,
  TooltipProps,
} from '@mantine/core';

function trNode(node: React.ReactNode, t: (s: string) => string): React.ReactNode {
  if (typeof node === 'string') {
    return t(node);
  }
  if (typeof node === 'number') {
    return t(String(node));
  }
  return node;
}

function trChildren(children: React.ReactNode, t: (s: string) => string): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((c, i) => <React.Fragment key={i}>{trNode(c, t)}</React.Fragment>);
  }
  return trNode(children, t);
}

export function Text(props: any) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineText {...rest}>{trChildren(children as React.ReactNode, t)}</MantineText>;
}

export function Title(props: React.ComponentProps<typeof MantineTitle>) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineTitle {...rest}>{trChildren(children, t)}</MantineTitle>;
}

export function Button(props: any) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineButton {...rest}>{trChildren(children, t)}</MantineButton>;
}

export function Badge(props: BadgeProps) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineBadge {...rest}>{trChildren(children, t)}</MantineBadge>;
}

export function Anchor(props: any) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineAnchor {...rest}>{trChildren(children as React.ReactNode, t)}</MantineAnchor>;
}

export function Tooltip(props: TooltipProps) {
  const { t } = useTranslation('common');
  const { label, children, ...rest } = props;
  const translatedLabel =
    typeof label === 'string' || typeof label === 'number' ? t(String(label)) : label;
  return (
    <MantineTooltip {...rest} label={translatedLabel}>
      {children}
    </MantineTooltip>
  );
}

export function Notification(props: NotificationProps) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineNotification {...rest}>{trChildren(children, t)}</MantineNotification>;
}

export function Modal(props: ModalProps) {
  const { t } = useTranslation('common');
  const { title, children, ...rest } = props;
  const translatedTitle =
    typeof title === 'string' || typeof title === 'number' ? t(String(title)) : title;
  return (
    <MantineModal {...rest} title={translatedTitle}>
      {trChildren(children, t)}
    </MantineModal>
  );
}

export function Alert(props: AlertProps) {
  const { t } = useTranslation('common');
  const { title, children, ...rest } = props;
  const translatedTitle =
    typeof title === 'string' || typeof title === 'number' ? t(String(title)) : title;
  return (
    <MantineAlert {...rest} title={translatedTitle}>
      {trChildren(children, t)}
    </MantineAlert>
  );
}

export function InputLabel(props: PropsWithChildren<InputLabelProps>) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineInputLabel {...rest}>{trChildren(children, t)}</MantineInputLabel>;
}

export function Divider(props: DividerProps) {
  const { t } = useTranslation('common');
  const { label, ...rest } = props;
  const translatedLabel =
    typeof label === 'string' || typeof label === 'number' ? t(String(label)) : label;
  return <MantineDivider {...rest} label={translatedLabel} />;
}

export function Menu(props: PropsWithChildren<MenuProps>) {
  return <MantineMenu {...props}>{props.children}</MantineMenu>;
}

Menu.Label = function MenuLabel(props: PropsWithChildren<MenuLabelProps>) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineMenu.Label {...rest}>{trChildren(children, t)}</MantineMenu.Label>;
};

Menu.Item = function MenuItem(
  props: PropsWithChildren<MenuItemProps> & { onClick?: () => void | Promise<void> }
) {
  const { t } = useTranslation('common');
  const { children, ...rest } = props;
  return <MantineMenu.Item {...(rest as MenuItemProps)}>{trChildren(children, t)}</MantineMenu.Item>;
};

Menu.Target = MantineMenu.Target;

Menu.Dropdown = MantineMenu.Dropdown;

Menu.Divider = MantineMenu.Divider;
