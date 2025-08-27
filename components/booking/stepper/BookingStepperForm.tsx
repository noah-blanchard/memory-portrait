'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import {
  IconCalendar,
  IconInfoCircle,
  IconMoodCheck,
  IconMoodHappy,
  IconMoodSmile,
  IconTool,
  IconUser,
} from '@tabler/icons-react';
import { z } from 'zod';
import { Stack, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import ReceiptCard, { ReceiptData } from '@/components/receipt/ReceiptCard';
import { mantineZodResolver } from '@/lib/mantineZodResolver';
import { bookingCreateSchema } from '@/schemas/bookingCreate';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '@/schemas/bookingSteps';
// <-- tes schémas individuels

import { ContactMethods, PhotoshootTypes } from '@/schemas/enums';
import Step1Contact from './Step1Contact';
import Step2Details from './Step2Details';
import Step3Equipment from './Step3Equipment';
import Step4Schedule from './Step4Schedule';

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
      contactMethod: 'wechat',
      contact: '',
      // step 2
      photoshootKind: 'portrait',
      location: 'Montreal',
      peopleCount: 1,
      // step 3
      date: null as Date | null,
      time: '',
      durationHours: 1,
      // step 4 (equipment)
      equipCanonIxus980is: false,
      equipHpCcd: false,
      equipIphoneX: false,
      equipIphone13: false,
      equipNikonDslr: false,
      dslrAddonPhotos: 0,
      extraEdits: 0,

      // options (UI)
      __contactMethodOptions: contactMethodOptions,
      __photoshootOptions: photoshootOptions,
    },
  });

  const schemaByIndex: Record<number, z.ZodTypeAny> = {
    0: step1Schema,
    1: step2Schema,
    2: step3Schema,
    3: step4Schema,
  };

  const validateStep = (i: number) => {
    const errs = mantineZodResolver(schemaByIndex[i])(form.values);
    form.setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(active)) setActive((s) => Math.min(s + 1, 4));
  };
  const back = () => setActive((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(3)) return; // valide Step 4 (equipment)

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
      peopleCount: form.values.peopleCount,
      language: undefined,
      notes: undefined,

      // équipements
      equipCanonIxus980is: !!form.values.equipCanonIxus980is,
      equipHpCcd: !!form.values.equipHpCcd,
      equipIphoneX: !!form.values.equipIphoneX,
      equipIphone13: !!form.values.equipIphone13,
      equipNikonDslr: !!form.values.equipNikonDslr,

      extraEdits: form.values.extraEdits === 0 || form.values.extraEdits == null
        ? null
        : Number(form.values.extraEdits), 

      // add-on DSLR (nombre) – laisse null si non saisi
      dslrAddonPhotos:
        form.values.dslrAddonPhotos === 0 || form.values.dslrAddonPhotos == null
          ? null
          : Number(form.values.dslrAddonPhotos),
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
        location: final.data.location ?? 'Montreal',

        // ⬇️ pour pricing/affichage
        peopleCount: final.data.peopleCount ?? 1,
        dslrAddonPhotos: final.data.dslrAddonPhotos ?? null,
        extraEdits: final.data.extraEdits ?? null,

        // équipements
        equipCanonIxus980is: !!final.data.equipCanonIxus980is,
        equipHpCcd: !!final.data.equipHpCcd,
        equipIphoneX: !!final.data.equipIphoneX,
        equipIphone13: !!final.data.equipIphone13,
        equipNikonDslr: !!final.data.equipNikonDslr,
      } as ReceiptData);
      setActive(4);
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
      {/* ... alerts */}

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
          <Step4Schedule loading={loading} form={form} onBack={back} onSubmit={next} />
        </Stepper.Step>

        <Stepper.Step icon={<IconTool size={18} />} completedIcon={<IconTool size={18} />}>
          <Step3Equipment loading={loading} form={form} onBack={back} onNext={handleSubmit} />
        </Stepper.Step>

        <Stepper.Completed>
          <ReceiptCard data={receipt} onNew={restart} />
        </Stepper.Completed>
      </Stepper>
    </Stack>
  );
}
