import { BookingCreateInput } from "@/schemas/bookingCreate";

export function createBookingArgs(data: BookingCreateInput) {
  return {
    p_client_name: data.clientName,
    p_contact_method: data.contactMethod,
    p_contact: data.contact,
    p_photoshoot_kind: data.photoshootKind,
    p_start: data.start.toISOString(),
    p_end: data.end.toISOString(),
    p_location: data.location,
    p_people_count: data.peopleCount,
    p_language: data.language,
    p_notes: data.notes,
  } as const;
}
