export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          budget_cents: number | null
          client_name: string
          contact: string
          contact_method: Database["public"]["Enums"]["contact_method"]
          created_at: string
          dslr_addon_photos: number | null
          ends_at: string | null
          extra_edits: number
          has_ccd_canon_ixus980is: boolean
          has_ccd_hp: boolean
          has_dslr_nikon: boolean
          has_phone_iphone_13: boolean
          has_phone_iphone_x: boolean
          id: number
          language: string | null
          location: string | null
          notes: string | null
          people_count: number
          photoshoot_kind: Database["public"]["Enums"]["photoshoot_type"]
          request_uid: string
          requested_period: unknown
          starts_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          budget_cents?: number | null
          client_name: string
          contact: string
          contact_method: Database["public"]["Enums"]["contact_method"]
          created_at?: string
          dslr_addon_photos?: number | null
          ends_at?: string | null
          extra_edits?: number
          has_ccd_canon_ixus980is?: boolean
          has_ccd_hp?: boolean
          has_dslr_nikon?: boolean
          has_phone_iphone_13?: boolean
          has_phone_iphone_x?: boolean
          id?: number
          language?: string | null
          location?: string | null
          notes?: string | null
          people_count?: number
          photoshoot_kind: Database["public"]["Enums"]["photoshoot_type"]
          request_uid?: string
          requested_period: unknown
          starts_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          budget_cents?: number | null
          client_name?: string
          contact?: string
          contact_method?: Database["public"]["Enums"]["contact_method"]
          created_at?: string
          dslr_addon_photos?: number | null
          ends_at?: string | null
          extra_edits?: number
          has_ccd_canon_ixus980is?: boolean
          has_ccd_hp?: boolean
          has_dslr_nikon?: boolean
          has_phone_iphone_13?: boolean
          has_phone_iphone_x?: boolean
          id?: number
          language?: string | null
          location?: string | null
          notes?: string | null
          people_count?: number
          photoshoot_kind?: Database["public"]["Enums"]["photoshoot_type"]
          request_uid?: string
          requested_period?: unknown
          starts_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: []
      }
      unavailable_periods: {
        Row: {
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: number
          period: unknown
          reason: string | null
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: number
          period: unknown
          reason?: string | null
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: number
          period?: unknown
          reason?: string | null
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      booking_requests_grouped_by_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_booking_request: {
        Args: {
          p_client_name: string
          p_contact: string
          p_contact_method: Database["public"]["Enums"]["contact_method"]
          p_dslr_addon_photos?: number
          p_end: string
          p_extra_edits?: number
          p_has_ccd_canon_ixus980is?: boolean
          p_has_ccd_hp?: boolean
          p_has_dslr_nikon?: boolean
          p_has_phone_iphone_13?: boolean
          p_has_phone_iphone_x?: boolean
          p_language?: string
          p_location?: string
          p_notes?: string
          p_people_count?: number
          p_photoshoot_kind: Database["public"]["Enums"]["photoshoot_type"]
          p_start: string
        }
        Returns: {
          budget_cents: number | null
          client_name: string
          contact: string
          contact_method: Database["public"]["Enums"]["contact_method"]
          created_at: string
          dslr_addon_photos: number | null
          ends_at: string | null
          extra_edits: number
          has_ccd_canon_ixus980is: boolean
          has_ccd_hp: boolean
          has_dslr_nikon: boolean
          has_phone_iphone_13: boolean
          has_phone_iphone_x: boolean
          id: number
          language: string | null
          location: string | null
          notes: string | null
          people_count: number
          photoshoot_kind: Database["public"]["Enums"]["photoshoot_type"]
          request_uid: string
          requested_period: unknown
          starts_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_slot_available: {
        Args: { p_end: string; p_start: string }
        Returns: boolean
      }
      search_booking_requests: {
        Args: { p_end: string; p_start: string }
        Returns: {
          budget_cents: number | null
          client_name: string
          contact: string
          contact_method: Database["public"]["Enums"]["contact_method"]
          created_at: string
          dslr_addon_photos: number | null
          ends_at: string | null
          extra_edits: number
          has_ccd_canon_ixus980is: boolean
          has_ccd_hp: boolean
          has_dslr_nikon: boolean
          has_phone_iphone_13: boolean
          has_phone_iphone_x: boolean
          id: number
          language: string | null
          location: string | null
          notes: string | null
          people_count: number
          photoshoot_kind: Database["public"]["Enums"]["photoshoot_type"]
          request_uid: string
          requested_period: unknown
          starts_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }[]
      }
      set_booking_status: {
        Args: {
          p_request_uid: string
          p_status: Database["public"]["Enums"]["booking_status"]
        }
        Returns: {
          budget_cents: number | null
          client_name: string
          contact: string
          contact_method: Database["public"]["Enums"]["contact_method"]
          created_at: string
          dslr_addon_photos: number | null
          ends_at: string | null
          extra_edits: number
          has_ccd_canon_ixus980is: boolean
          has_ccd_hp: boolean
          has_dslr_nikon: boolean
          has_phone_iphone_13: boolean
          has_phone_iphone_x: boolean
          id: number
          language: string | null
          location: string | null
          notes: string | null
          people_count: number
          photoshoot_kind: Database["public"]["Enums"]["photoshoot_type"]
          request_uid: string
          requested_period: unknown
          starts_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "reviewed"
        | "approved"
        | "rejected"
        | "cancelled"
      contact_method: "email" | "wechat" | "instagram" | "phone"
      photoshoot_type:
        | "tourism"
        | "linkedin"
        | "event"
        | "family"
        | "portrait"
        | "product"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "reviewed",
        "approved",
        "rejected",
        "cancelled",
      ],
      contact_method: ["email", "wechat", "instagram", "phone"],
      photoshoot_type: [
        "tourism",
        "linkedin",
        "event",
        "family",
        "portrait",
        "product",
      ],
    },
  },
} as const
