import { bookingCreateSchema } from "@/schemas/bookingCreate";
import { json } from "@/utils/api/helpers";
import { createBookingArgs } from "./helpers";
import { createServerClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  // 1) Content-Type
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return json(
      { ok: false, error: { code: "invalid_content_type", message: "Expected application/json" } },
      415
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: { code: "invalid_json", message: "Body must be valid JSON" } }, 400);
  }

  const parsed = bookingCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: {
          code: "validation_error",
          message: "Invalid request body",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
            code: i.code,
          })),
        },
      },
      400
    );
  }

  // 4) RPC call
  const args = createBookingArgs(parsed.data);
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.rpc("create_booking_request", args);

    if (error) {
      const code = (error.code || "").toLowerCase();
      const msg = error.message || "Database error";

      if (msg.toLowerCase().includes("overlaps an unavailable period")) {
        return json(
          { ok: false, error: { code: "slot_unavailable", message: "Requested slot is unavailable." } },
          409
        );
      }

      if (["22007", "22023", "22003"].includes(code) || /must be|invalid/i.test(msg)) {
        return json({ ok: false, error: { code: "bad_request", message: msg } }, 400);
      }

      if (code === "23514" || code === "check_violation") {
        return json({ ok: false, error: { code: "constraint_violation", message: msg } }, 409);
      }

      return json({ ok: false, error: { code: "rpc_error", message: msg } }, 500);
    }

    return json({ ok: true, data }, 201);
  } catch (e: any) {
    return json({ ok: false, error: { code: "server_error", message: e?.message ?? "Unexpected error" } }, 500);
  }
}