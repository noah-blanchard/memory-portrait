'use client';

import { useState } from 'react';
import {
  Alert,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Button, Title } from '@/components/I18nUI/I18nUI';
// 👉 importe ta fonction comme tu l'as définie (adapte le chemin si besoin)
import { mantineZodResolver } from '@/lib/mantineZodResolver';
import { bookingCreateSchema, type BookingCreateInput } from '@/schemas/bookingCreate';
import { ContactMethods, PhotoshootTypes } from '@/schemas/enums';

type ApiError = {
  code: string;
  message: string;
  issues?: Array<{ path: string; message: string; code?: string }>;
};

// labels simples (tu peux les remplacer par t("...") si tu veux)
const labels = {
  title: 'Request a photoshoot',
  clientName: 'Your name',
  contactMethod: 'Contact method',
  contact: 'Contact',
  photoshootKind: 'Photoshoot type',
  start: 'Start (local)',
  end: 'End (local)',
  location: 'Location',
  peopleCount: 'Number of people',
  language: 'Language',
  notes: 'Notes',
  submit: 'Send request',
};

export default function BookingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const form = useForm<BookingCreateInput>({
    validate: mantineZodResolver(bookingCreateSchema),
    initialValues: {
      clientName: '',
      contactMethod: 'email',
      contact: '',
      photoshootKind: 'linkedin',
      start: new Date(), // string → <input type="datetime-local"> ; Zod fera la coercition -> Date
      end: new Date(),
      location: '',
      peopleCount: 1,
      language: 'en',
      notes: '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    setServerError(null);
    setSuccessData(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setServerError(json?.error ?? { code: 'unknown', message: 'Unknown error' });
        return;
      }

      setSuccessData(json.data);
      form.reset();
    } catch (e: any) {
      setServerError({ code: 'network_error', message: e?.message ?? 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const contactMethodOptions = ContactMethods.map((method) => ({
    value: method,
    label: capitalize(method),
  }));

  const photoshootOptions = PhotoshootTypes.map((kind) => ({
    value: kind,
    label: capitalize(kind),
  }));

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        <Title order={2} ta="center">
          {labels.title}
        </Title>

        {serverError && (
          <Alert color="red" variant="light" title="Error">
            <div style={{ whiteSpace: 'pre-wrap' }}>{serverError.message}</div>
            {serverError.issues?.length ? (
              <ul style={{ marginTop: 8 }}>
                {serverError.issues.map((i, idx) => (
                  <li key={idx}>
                    <code>{i.path}</code>: {i.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </Alert>
        )}

        {successData && (
          <Alert color="green" variant="light" title="Request sent">
            Thanks! Your request was created. We’ll get back to you shortly.
          </Alert>
        )}

        <TextInput
          label={labels.clientName}
          placeholder="Jane Doe"
          required
          {...form.getInputProps('clientName')}
        />

        <Group grow align="flex-end">
          <Select
            label={labels.contactMethod}
            data={contactMethodOptions}
            required
            allowDeselect={false}
            {...form.getInputProps('contactMethod')}
          />
          <TextInput
            label={labels.contact}
            placeholder="jane@example.com / wechat id / @insta / +1…"
            required
            {...form.getInputProps('contact')}
          />
        </Group>

        <Select
          label={labels.photoshootKind}
          data={photoshootOptions}
          required
          allowDeselect={false}
          {...form.getInputProps('photoshootKind')}
        />

        <Group grow>
          <DateTimePicker
            timePickerProps={{
              withDropdown: true,
              minutesStep: 5,
              inputMode: "none",
            
            }}
            label={labels.start}
            value={form.values.start as Date | null}
            onChange={(v) => form.setFieldValue('start', new Date(v as string))}
            onBlur={() => form.validateField('start')}
            required
            valueFormat="YYYY-MM-DD HH:mm"
            withSeconds={false}
            inputMode="none"
            dropdownType="modal"
            error={form.errors.start}
          />

          <DateTimePicker
            label={labels.end}
            value={form.values.end as Date | null}
            onChange={(v) => form.setFieldValue('end', new Date(v as string))}
            onBlur={() => form.validateField('end')}
            required
            valueFormat="YYYY-MM-DD HH:mm"
            withSeconds={false}
            minDate={form.values.start ? (form.values.start as Date) : undefined}
            error={form.errors.end}
            inputMode="none"
            dropdownType="modal"
            timePickerProps={{
              withDropdown: true,
              minutesStep: 5,
              inputMode: 'none',
            }}
          />
        </Group>

        <TextInput
          label={labels.location}
          placeholder="Montreal"
          {...form.getInputProps('location')}
        />

        <Group grow>
          <NumberInput
            label={labels.peopleCount}
            min={1}
            clampBehavior="strict"
            {...form.getInputProps('peopleCount')}
          />
          <TextInput
            label={labels.language}
            placeholder="en / zh"
            {...form.getInputProps('language')}
          />
        </Group>

        <Textarea label={labels.notes} minRows={3} autosize {...form.getInputProps('notes')} />

        <Divider my="xs" />

        <Group justify="center" mt="xs">
          <Button type="submit" size="md" radius="lg" loading={submitting} color="babyBlue">
            {labels.submit}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function capitalize(s: string | null | undefined) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
