'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconUser,
  IconCamera,
  IconSettings,
  IconClipboardCheck,
  IconReceipt,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Box,
  Button,
  Center,
  Group,
  Progress,
  Stepper,
  Text,
  Transition,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { ReceiptCard, ReceiptData } from '@/components/ui/feedback';
import { mantineZodResolver } from '@/lib/mantineZodResolver';
import {
  bookingCreateSchema,
  contactStepSchema,
  detailsStepSchema,
  equipmentStepSchema,
  scheduleStepSchema,
} from '@/schemas/booking';
import Step1Contact from './Step1Contact';
import Step2Details from './Step2Details';
import Step3Schedule from './Step3Schedule';
import Step4Equipment from './Step4Equipment';
import Step5Review from './Step5Review';
import { mergeDateTime } from '@/utils/common';
import { useCreateBooking } from '@/lib/api/hooks';

export default function BookingStepperForm() {
  const { t, i18n } = useTranslation('common');
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [active, setActive] = useState(0);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [stepTransition, setStepTransition] = useState<'slide-left' | 'slide-right' | 'fade'>(
    'fade'
  );
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');
  
  const createBookingMutation = useCreateBooking();

  const form = useForm({
    initialValues: {
      clientName: '',
      contactMethod: 'wechat',
      contact: '',
      photoshootKind: 'portrait',
      location: 'Montreal',
      peopleCount: 1,
      date: null as Date | null,
      time: '',
      durationHours: 1,
      equipCanonIxus980is: false,
      equipHpCcd: false,
      equipIphoneX: false,
      equipIphone13: false,
      equipNikonDslr: false,
      dslrAddonPhotos: 0,
      extraEdits: 0,
    },
  });

  useEffect(() => {
    const saved =
      (typeof window !== 'undefined' && (localStorage.getItem('lang') as 'en' | 'zh')) || null;
    const initial = saved ?? (i18n.language?.startsWith('zh') ? 'zh' : 'en');
    setCurrentLang(initial);
    i18n.changeLanguage(initial);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = initial;
    }
  }, [i18n]);

  const switchLanguage = (lang: 'en' | 'zh') => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  };

  const schemaByIndex: Record<number, z.ZodTypeAny> = {
    0: contactStepSchema, // Step 1: Contact (name + contact)
    1: detailsStepSchema, // Step 2: Details (photoshoot type + location)
    2: scheduleStepSchema, // Step 3: Schedule (date + time + duration)
    3: equipmentStepSchema, // Step 4: Equipment (equipment selection)
    4: z.object({}), // Step 5: Review - no validation needed
    5: z.object({}), // Step 6: Receipt - no validation needed
  };

  const translateErrors = (errors: Record<string, string>) => {
    const translatedErrors: Record<string, string> = {};
    for (const [key, message] of Object.entries(errors)) {
      if (message.startsWith('validation_')) {
        translatedErrors[key] = t(message);
      } else {
        translatedErrors[key] = message;
      }
    }
    return translatedErrors;
  };

  const validateStep = (i: number) => {
    const errs = mantineZodResolver(schemaByIndex[i])(form.values);
    const translatedErrs = translateErrors(errs);
    form.setErrors(translatedErrs);
    return Object.keys(translatedErrs).length === 0;
  };

  const next = () => {
    if (validateStep(active)) {
      setStepTransition('slide-left');
      setActive((s) => Math.min(s + 1, 6));
    }
  };

  const back = () => {
    setStepTransition('slide-right');
    setActive((s) => Math.max(s - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step < active) {
      setStepTransition('slide-right');
    } else if (step > active) {
      setStepTransition('slide-left');
    } else {
      setStepTransition('fade');
    }
    setActive(step);
  };

  useEffect(() => {
    const timer = setTimeout(() => setStepTransition('fade'), 300);
    return () => clearTimeout(timer);
  }, [active]);

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

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

      equipCanonIxus980is: !!form.values.equipCanonIxus980is,
      equipHpCcd: !!form.values.equipHpCcd,
      equipIphoneX: !!form.values.equipIphoneX,
      equipIphone13: !!form.values.equipIphone13,
      equipNikonDslr: !!form.values.equipNikonDslr,

      extraEdits:
        form.values.extraEdits === 0 || form.values.extraEdits == null
        ? null
        : Number(form.values.extraEdits), 

      dslrAddonPhotos:
        form.values.dslrAddonPhotos === 0 || form.values.dslrAddonPhotos == null
          ? null
          : Number(form.values.dslrAddonPhotos),
    };

    const final = bookingCreateSchema.safeParse(candidate);

    if (!final.success) {
      const errs: Record<string, string> = {};
      for (const i of final.error.issues) {
        errs[i.path.join('.')] = i.message;
      }
      form.setErrors(errs);
      return;
    }

    try {
      const created = await createBookingMutation.mutateAsync(final.data);

      setReceipt({
        id: created.request_uid ?? null,
        createdAt: created.created_at ?? null,
        name: final.data.clientName,
        method: final.data.contactMethod,
        contact: final.data.contact,
        kind: final.data.photoshootKind,
        date: dayjs(start).format('YYYY-MM-DD'),
        start: dayjs(start).format('HH:mm'),
        end: dayjs(end).format('HH:mm'),
        durationHours: form.values.durationHours,
        location: final.data.location ?? 'Montreal',

        peopleCount: final.data.peopleCount ?? 1,
        dslrAddonPhotos: final.data.dslrAddonPhotos ?? null,
        extraEdits: final.data.extraEdits ?? null,

        equipCanonIxus980is: !!final.data.equipCanonIxus980is,
        equipHpCcd: !!final.data.equipHpCcd,
        equipIphoneX: !!final.data.equipIphoneX,
        equipIphone13: !!final.data.equipIphone13,
        equipNikonDslr: !!final.data.equipNikonDslr,
      } as ReceiptData);
      setActive(5);
      form.reset();
    } catch (error) {
      // Error is handled by TanStack Query
      // Error will be available in createBookingMutation.error
    }
  };

  const restart = () => {
    setReceipt(null);
    form.reset();
    setActive(0);
  };

  const stepIcons = [
    <IconUser size={20} />,
    <IconCamera size={20} />,
    <IconCalendar size={20} />,
    <IconSettings size={20} />,
    <IconClipboardCheck size={20} />,
    <IconReceipt size={20} />,
  ];

  const progress = ((active + 1) / 6) * 100;

  return (
    <Box
      style={{
        width: '100%',
        height: '100vh',
        padding: isMobile ? '1rem' : '2rem',
        background: '#fff',
        borderRadius: isMobile ? '1rem' : '0',
        border: isMobile ? `1px solid ${theme.colors.slate[2]}` : 'none',
        boxShadow: isMobile ? '0 8px 24px rgba(0,0,0,0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mobile Progress Header */}
      {isMobile && (
        <Box mb="lg">
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={600} c="dimmed">
              {t('step')} {active + 1} {t('of')} 6
            </Text>
            <Text size="sm" fw={600} c="ocean">
              {Math.round(progress)}%
            </Text>
          </Group>
          <Progress
            value={progress}
            size="sm"
            radius="xl"
            color="ocean"
            style={{
              transition: 'all 0.3s ease',
              boxShadow: `0 2px 8px ${theme.colors.ocean[2]}`,
            }}
          />
        </Box>
      )}

      {/* Desktop Stepper */}
      {!isMobile && (
        <Stepper
          active={active}
          onStepClick={goToStep}
          allowNextStepsSelect={false}
          size="lg"
          radius="xl"
          mb="xl"
          styles={{
            root: {
              '& .mantineStepperStep': {
                transition: 'all 0.3s ease',
              },
              '& .mantineStepperStep[dataProgress]': {
                transform: 'scale(1.1)',
                boxShadow: `0 4px 12px ${theme.colors.ocean[3]}`,
              },
              '& .mantineStepperStep[dataCompleted]': {
                transform: 'scale(1.05)',
              },
            },
            stepIcon: {
              border: `2px solid ${theme.colors.slate[3]}`,
              backgroundColor: '#ffffff',
              color: theme.colors.slate[6],
              '&[dataProgress]': {
                borderColor: theme.colors.ocean[6],
                backgroundColor: theme.colors.ocean[1],
                color: theme.colors.ocean[7],
              },
              '&[dataCompleted]': {
                borderColor: theme.colors.emerald[6],
                backgroundColor: theme.colors.emerald[1],
                color: theme.colors.emerald[7],
              },
            },
            separator: {
              backgroundColor: theme.colors.slate[3],
              '&[dataActive]': {
                backgroundColor: theme.colors.ocean[4],
              },
            },
          }}
        >
          {stepIcons.map((icon, index) => (
            <Stepper.Step
              key={index}
              icon={icon}
              completedIcon={<IconCheck size={16} />}
            />
          ))}
        </Stepper>
      )}

      {/* Main Content Area */}
      <Box style={{ flex: 1, overflow: 'auto' }}>
        {/* Step Content with Animations */}
        <Box style={{ minHeight: isMobile ? '50vh' : 'auto' }}>
        <Transition
          mounted
          transition={
            stepTransition === 'slide-left'
              ? 'slide-left'
              : stepTransition === 'slide-right'
                ? 'slide-right'
                : 'fade'
          }
          duration={300}
          timingFunction="ease-in-out"
        >
          {(styles) => (
            <Box style={styles}>
              {active === 0 && <Step1Contact form={form as any} onNext={next} />}
              {active === 1 && <Step2Details form={form as any} onBack={back} onNext={next} />}
              {active === 2 && (
                <Step3Schedule loading={createBookingMutation.isPending} form={form as any} onBack={back} onNext={next} />
              )}
              {active === 3 && (
                <Step4Equipment loading={createBookingMutation.isPending} form={form as any} onBack={back} onNext={next} />
              )}
              {active === 4 && (
                <Step5Review loading={createBookingMutation.isPending} form={form as any} onBack={back} onNext={handleSubmit} />
              )}
              {active === 5 && <ReceiptCard data={receipt} onNew={restart} />}
            </Box>
          )}
        </Transition>
        </Box>
      </Box>

      {/* Navigation Buttons */}
      {active < 5 && (
        <Group
          justify="space-between"
          p="md"
          style={{ 
            borderTop: `1px solid ${theme.colors.slate[2]}`,
            backgroundColor: '#fff',
          }}
        >
          <Button
            variant="light"
            size="md"
            onClick={back}
            disabled={active === 0}
            leftSection={<IconChevronLeft size={16} />}
            style={{
              transition: 'all 0.2s ease',
              transform: active === 0 ? 'scale(0.95)' : 'scale(1)',
              opacity: active === 0 ? 0.5 : 1,
            }}
          >
            {t('common_back')}
          </Button>

          <Button
            size="md"
            onClick={active === 4 ? handleSubmit : next}
            loading={createBookingMutation.isPending}
            rightSection={active < 4 ? <IconChevronRight size={16} /> : <IconCheck size={16} />}
            style={{
              transition: 'all 0.2s ease',
              background: `linear-gradient(135deg, ${theme.colors.ocean[6]} 0%, ${theme.colors.emerald[6]} 100%)`,
              boxShadow: `0 4px 12px ${theme.colors.ocean[3]}`,
            }}
          >
            {active === 4 ? t('step4_review_confirm') : t('common_next')}
          </Button>
        </Group>
      )}

      {/* Language Switcher */}
      <Box
        style={{
          paddingTop: '1rem',
          borderTop: `1px solid ${theme.colors.slate[2]}`,
        }}
      >
        <Center>
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              Language:
            </Text>
            <Group gap={4}>
              <UnstyledButton
                onClick={() => switchLanguage('en')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor:
                    currentLang === 'en'
                      ? 'var(--mantine-color-ocean-5)'
                      : 'var(--mantine-color-gray-1)',
                  color: currentLang === 'en' ? '#fff' : 'var(--mantine-color-gray-7)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                EN
              </UnstyledButton>
              <UnstyledButton
                onClick={() => switchLanguage('zh')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor:
                    currentLang === 'zh'
                      ? 'var(--mantine-color-ocean-5)'
                      : 'var(--mantine-color-gray-1)',
                  color: currentLang === 'zh' ? '#fff' : 'var(--mantine-color-gray-7)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                中文
              </UnstyledButton>
            </Group>
          </Group>
        </Center>
      </Box>
    </Box>
  );
}
