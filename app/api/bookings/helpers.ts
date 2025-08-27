import type { BookingCreateInput } from '@/schemas/bookingCreate';

export function createBookingArgs(input: BookingCreateInput) {
  return {
    p_client_name: input.clientName,
    p_contact_method: input.contactMethod,
    p_contact: input.contact,
    p_photoshoot_kind: input.photoshootKind,
    p_start: input.start.toISOString(),
    p_end: input.end.toISOString(),
    p_location: input.location ?? undefined,
    p_people_count: input.peopleCount ?? 1,
    p_language: input.language ?? undefined,
    p_notes: input.notes ?? undefined,
    p_has_ccd_canon_ixus980is: !!input.equipCanonIxus980is,
    p_has_ccd_hp: !!input.equipHpCcd,
    p_has_phone_iphone_x: !!input.equipIphoneX,
    p_has_phone_iphone_13: !!input.equipIphone13,
    p_has_dslr_nikon: !!input.equipNikonDslr,
    p_dslr_addon_photos: input.dslrAddonPhotos ?? undefined,
    p_extra_edits: input.extraEdits ?? undefined,
  } as const;
}
