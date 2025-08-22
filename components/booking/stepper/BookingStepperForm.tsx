'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import {
  IconCalendar,
  IconInfoCircle,
  IconMoodCheck,
  IconMoodHappy,
  IconMoodSmile,
  IconUser,
} from '@tabler/icons-react';
import { z } from 'zod';
import { Alert, Stack, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import ReceiptCard, { ReceiptData } from '@/components/receipt/ReceiptCard';
import { mantineZodResolver } from '@/lib/mantineZodResolver';
import { bookingCreateSchema } from '@/schemas/bookingCreate';
import { step1Schema, step2Schema, step3Schema } from '@/schemas/bookingSteps';
// <-- tes schémas individuels

import { ContactMethods, PhotoshootTypes } from '@/schemas/enums';
import Step1Contact from './Step1Contact';
import Step2Details from './Step2Details';
import Step3Schedule from './Step3Schedule';

// ------------- helpers -------------
const contactMethodOptions = ContactMethods.map((m) => ({ value: m, label: cap(m) }));
const photoshootOptions = PhotoshootTypes.map((t) => ({ value: t, label: cap(t) }));
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function mergeDateTime(d: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  const out = new Date(d);
  out.setHours(h, m, 0, 0);
  return out;
}

// ------------- composant -------------
export default function BookingStepperForm() {
  const [active, setActive] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  // valeurs de toutes les étapes dans un seul form (1 colonne)
  const form = useForm({
    initialValues: {
      // step 1
      clientName: '',
      contactMethod: 'email',
      contact: '',
      // step 2
      photoshootKind: 'linkedin',
      location: '',
      // step 3
      date: null as Date | null,
      time: '',
      durationHours: 1,
      // options (injectées dans les Selects)
      __contactMethodOptions: contactMethodOptions,
      __photoshootOptions: photoshootOptions,
    },
  });

  // Validation par étape via tes schémas step1/2/3
  const schemaByIndex: Record<number, z.ZodTypeAny> = {
    0: step1Schema,
    1: step2Schema,
    2: step3Schema,
  };

  const validateStep = (i: number) => {
    const errs = mantineZodResolver(schemaByIndex[i])(form.values);
    form.setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(active)) setActive((s) => Math.min(s + 1, 2));
  };
  const back = () => setActive((s) => Math.max(s - 1, 0));

  // Soumission finale : recompose un objet complet et valide le schéma global
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    const start = mergeDateTime(form.values.date as Date, form.values.time);
    const end = dayjs(start).add(form.values.durationHours, 'hour').toDate();

    const candidate = {
      clientName: form.values.clientName,
      contactMethod: form.values.contactMethod,
      contact: form.values.contact,
      photoshootKind: form.values.photoshootKind,
      start,
      end,
      location: form.values.location,
      peopleCount: 1,
      language: undefined,
      notes: undefined,
    };

    const final = bookingCreateSchema.safeParse(candidate);
    if (!final.success) {
      const errs: Record<string, string> = {};
      for (const i of final.error.issues) errs[i.path.join('.')] = i.message;
      form.setErrors(errs);
      return;
    }

    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(final.data),
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        setServerError(json?.error?.message ?? 'Unknown error');
        return;
      }

      // Construire le reçu
      const created = json.data as { request_uid?: string; created_at?: string } | undefined;
      setReceipt({
        id: created?.request_uid ?? null,
        createdAt: created?.created_at ?? null,
        name: final.data.clientName,
        method: final.data.contactMethod,
        contact: final.data.contact,
        kind: final.data.photoshootKind,
        date: dayjs(start).format('YYYY-MM-DD'),
        start: dayjs(start).format('HH:mm'),
        end: dayjs(end).format('HH:mm'),
        durationHours: form.values.durationHours,
        location: final.data.location ?? null,
      });

      // Step "Completed"
      setActive(3);
      form.reset();
    } catch (e: any) {
      setServerError(e?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setReceipt(null);
    form.reset();
    setActive(0);
  };

  return (
    <Stack gap="lg">
      {serverError && (
        <Alert color="red" variant="light" title="Error">
          {serverError}
        </Alert>
      )}
      {success && (
        <Alert color="green" variant="light" title="Request sent">
          Thanks! Your request was created. We’ll get back to you shortly.
        </Alert>
      )}

      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step icon={<IconUser size={18} />} completedIcon={<IconMoodSmile size={18} />}>
          <Step1Contact form={form} onNext={next} />
        </Stepper.Step>

        <Stepper.Step
          icon={<IconInfoCircle size={18} />}
          completedIcon={<IconMoodHappy size={18} />}
        >
          <Step2Details form={form} onBack={back} onNext={next} />
        </Stepper.Step>

        <Stepper.Step icon={<IconCalendar size={18} />} completedIcon={<IconMoodCheck size={18} />}>
          <Step3Schedule loading={loading} form={form} onBack={back} onSubmit={handleSubmit} />
        </Stepper.Step>

        <Stepper.Completed>
          <ReceiptCard data={receipt} onNew={restart} />
        </Stepper.Completed>
      </Stepper>
    </Stack>
  );
}
