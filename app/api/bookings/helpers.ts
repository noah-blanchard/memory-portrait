import type { BookingCreateInput } from '@/schemas/bookingCreate';

export interface CreateBookingArgs {
  p_client_name: string;
  p_contact_method: 'email' | 'wechat' | 'instagram' | 'phone';
  p_contact: string;
  p_photoshoot_kind: 'tourism' | 'linkedin' | 'event' | 'family' | 'portrait';
  p_start: string;
  p_end: string;
  p_location?: 'Montreal' | 'Quebec City';
  p_people_count: number;
  p_language?: 'en' | 'zh';
  p_notes?: string;
  p_has_ccd_canon_ixus980is: boolean;
  p_has_ccd_hp: boolean;
  p_has_phone_iphone_x: boolean;
  p_has_phone_iphone_13: boolean;
  p_has_dslr_nikon: boolean;
  p_dslr_addon_photos?: number;
  p_extra_edits?: number;
}

export function createBookingArgs(input: BookingCreateInput): CreateBookingArgs {
  return {
    p_client_name: input.clientName,
    p_contact_method: input.contactMethod,
    p_contact: input.contact,
    p_photoshoot_kind: input.photoshootKind,
    p_start: input.start.toISOString(),
    p_end: input.end.toISOString(),
    p_location: (input.location as 'Montreal' | 'Quebec City') ?? undefined,
    p_people_count: input.peopleCount ?? 1,
    p_language: (input.language as 'en' | 'zh') ?? undefined,
    p_notes: input.notes ?? undefined,
    p_has_ccd_canon_ixus980is: !!input.equipCanonIxus980is,
    p_has_ccd_hp: !!input.equipHpCcd,
    p_has_phone_iphone_x: !!input.equipIphoneX,
    p_has_phone_iphone_13: !!input.equipIphone13,
    p_has_dslr_nikon: !!input.equipNikonDslr,
    p_dslr_addon_photos: input.dslrAddonPhotos ?? undefined,
    p_extra_edits: input.extraEdits ?? undefined,
  };
}
