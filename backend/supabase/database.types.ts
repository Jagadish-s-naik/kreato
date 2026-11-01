export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          created_at: string
          id: string
          route: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          route: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          route?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          detail: Json
          entity: string
          entity_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          detail?: Json
          entity: string
          entity_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          detail?: Json
          entity?: string
          entity_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      benchmarks: {
        Row: {
          created_at: string
          follower_band: Database["public"]["Enums"]["follower_band"]
          format: Database["public"]["Enums"]["deliverable_format"]
          id: string
          is_simulated: boolean
          max_paise: number
          median_paise: number
          min_paise: number
          niche: Database["public"]["Enums"]["creator_niche"]
        }
        Insert: {
          created_at?: string
          follower_band: Database["public"]["Enums"]["follower_band"]
          format: Database["public"]["Enums"]["deliverable_format"]
          id?: string
          is_simulated?: boolean
          max_paise: number
          median_paise: number
          min_paise: number
          niche: Database["public"]["Enums"]["creator_niche"]
        }
        Update: {
          created_at?: string
          follower_band?: Database["public"]["Enums"]["follower_band"]
          format?: Database["public"]["Enums"]["deliverable_format"]
          id?: string
          is_simulated?: boolean
          max_paise?: number
          median_paise?: number
          min_paise?: number
          niche?: Database["public"]["Enums"]["creator_niche"]
        }
        Relationships: []
      }
      deals: {
        Row: {
          agreed_terms: Json | null
          brand_domain: string | null
          brand_key: string
          brand_name: string
          category: Database["public"]["Enums"]["creator_niche"]
          channel: Database["public"]["Enums"]["deal_channel"]
          created_at: string
          deadline: string | null
          deliverables: Json
          exclusivity: Json
          fee_paise: number | null
          id: string
          payment_terms: Json
          risky_quotes: Json
          scam_result: Json
          source_ref: string | null
          status: Database["public"]["Enums"]["deal_status"]
          updated_at: string
          usage_rights: Json
          user_id: string
        }
        Insert: {
          agreed_terms?: Json | null
          brand_domain?: string | null
          brand_key: string
          brand_name: string
          category?: Database["public"]["Enums"]["creator_niche"]
          channel?: Database["public"]["Enums"]["deal_channel"]
          created_at?: string
          deadline?: string | null
          deliverables?: Json
          exclusivity?: Json
          fee_paise?: number | null
          id?: string
          payment_terms?: Json
          risky_quotes?: Json
          scam_result?: Json
          source_ref?: string | null
          status?: Database["public"]["Enums"]["deal_status"]
          updated_at?: string
          usage_rights?: Json
          user_id: string
        }
        Update: {
          agreed_terms?: Json | null
          brand_domain?: string | null
          brand_key?: string
          brand_name?: string
          category?: Database["public"]["Enums"]["creator_niche"]
          channel?: Database["public"]["Enums"]["deal_channel"]
          created_at?: string
          deadline?: string | null
          deliverables?: Json
          exclusivity?: Json
          fee_paise?: number | null
          id?: string
          payment_terms?: Json
          risky_quotes?: Json
          scam_result?: Json
          source_ref?: string | null
          status?: Database["public"]["Enums"]["deal_status"]
          updated_at?: string
          usage_rights?: Json
          user_id?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          approved_at: string | null
          body: string
          created_at: string
          deal_id: string
          id: string
          kind: Database["public"]["Enums"]["draft_kind"]
          language: string
          numbers: Json
          status: Database["public"]["Enums"]["draft_status"]
          tier: Database["public"]["Enums"]["draft_tier"] | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          body: string
          created_at?: string
          deal_id: string
          id?: string
          kind: Database["public"]["Enums"]["draft_kind"]
          language?: string
          numbers?: Json
          status?: Database["public"]["Enums"]["draft_status"]
          tier?: Database["public"]["Enums"]["draft_tier"] | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          body?: string
          created_at?: string
          deal_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["draft_kind"]
          language?: string
          numbers?: Json
          status?: Database["public"]["Enums"]["draft_status"]
          tier?: Database["public"]["Enums"]["draft_tier"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drafts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      gmail_connections: {
        Row: {
          auth_tag: string
          connected_at: string
          created_at: string
          encrypted_refresh_token: string
          google_email: string
          id: string
          iv: string
          last_used_at: string | null
          scope: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_tag: string
          connected_at?: string
          created_at?: string
          encrypted_refresh_token: string
          google_email: string
          id?: string
          iv: string
          last_used_at?: string | null
          scope?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_tag?: string
          connected_at?: string
          created_at?: string
          encrypted_refresh_token?: string
          google_email?: string
          id?: string
          iv?: string
          last_used_at?: string | null
          scope?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_snapshot: Json
          created_at: string
          deal_id: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          line_items: Json
          status: Database["public"]["Enums"]["invoice_status"]
          supplier_snapshot: Json
          tax: Json
          total_paise: number
          upi_link: string
          user_id: string
        }
        Insert: {
          client_snapshot: Json
          created_at?: string
          deal_id: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          line_items: Json
          status?: Database["public"]["Enums"]["invoice_status"]
          supplier_snapshot: Json
          tax: Json
          total_paise: number
          upi_link: string
          user_id: string
        }
        Update: {
          client_snapshot?: Json
          created_at?: string
          deal_id?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          line_items?: Json
          status?: Database["public"]["Enums"]["invoice_status"]
          supplier_snapshot?: Json
          tax?: Json
          total_paise?: number
          upi_link?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      memos: {
        Row: {
          accept_token_hash: string
          accepted_at: string | null
          accepted_by_name: string | null
          content: Json
          created_at: string
          deal_id: string
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          accept_token_hash: string
          accepted_at?: string | null
          accepted_by_name?: string | null
          content: Json
          created_at?: string
          deal_id: string
          expires_at?: string
          id?: string
          user_id: string
        }
        Update: {
          accept_token_hash?: string
          accepted_at?: string | null
          accepted_by_name?: string | null
          content?: Json
          created_at?: string
          deal_id?: string
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memos_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          actual_days: number
          amount_paise: number
          deal_id: string
          id: string
          paid_at: string
          promised_days: number
          user_id: string
        }
        Insert: {
          actual_days: number
          amount_paise: number
          deal_id: string
          id?: string
          paid_at?: string
          promised_days: number
          user_id: string
        }
        Update: {
          actual_days?: number
          amount_paise?: number
          deal_id?: string
          id?: string
          paid_at?: string
          promised_days?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          follower_band: Database["public"]["Enums"]["follower_band"]
          gstin: string | null
          id: string
          min_fee_paise: number | null
          niche: Database["public"]["Enums"]["creator_niche"]
          pan_name: string | null
          sim_days_offset: number
          state: string
          upi_vpa: string
          youtube_verified_band:
            | Database["public"]["Enums"]["follower_band"]
            | null
        }
        Insert: {
          created_at?: string
          display_name: string
          follower_band?: Database["public"]["Enums"]["follower_band"]
          gstin?: string | null
          id: string
          min_fee_paise?: number | null
          niche?: Database["public"]["Enums"]["creator_niche"]
          pan_name?: string | null
          sim_days_offset?: number
          state?: string
          upi_vpa: string
          youtube_verified_band?:
            | Database["public"]["Enums"]["follower_band"]
            | null
        }
        Update: {
          created_at?: string
          display_name?: string
          follower_band?: Database["public"]["Enums"]["follower_band"]
          gstin?: string | null
          id?: string
          min_fee_paise?: number | null
          niche?: Database["public"]["Enums"]["creator_niche"]
          pan_name?: string | null
          sim_days_offset?: number
          state?: string
          upi_vpa?: string
          youtube_verified_band?:
            | Database["public"]["Enums"]["follower_band"]
            | null
        }
        Relationships: []
      }
      youtube_links: {
        Row: {
          band_suggestion: Database["public"]["Enums"]["follower_band"]
          channel_id: string
          channel_title: string
          created_at: string
          fetched_at: string
          id: string
          subscriber_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          band_suggestion: Database["public"]["Enums"]["follower_band"]
          channel_id: string
          channel_title: string
          created_at?: string
          fetched_at?: string
          id?: string
          subscriber_count: number
          updated_at?: string
          user_id: string
        }
        Update: {
          band_suggestion?: Database["public"]["Enums"]["follower_band"]
          channel_id?: string
          channel_title?: string
          created_at?: string
          fetched_at?: string
          id?: string
          subscriber_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      creator_niche:
        | "skincare"
        | "haircare"
        | "makeup"
        | "fashion"
        | "food_beverage"
        | "fitness"
        | "tech_gadgets"
        | "finance"
        | "travel"
        | "gaming"
        | "education"
        | "other"
      deal_channel: "whatsapp" | "instagram_dm" | "email" | "other"
      deal_status: "new" | "countered" | "agreed" | "invoiced" | "paid"
      deliverable_format: "reel" | "story" | "post" | "youtube_video" | "short"
      draft_kind: "counter_offer" | "reminder"
      draft_status: "draft" | "approved" | "discarded"
      draft_tier: "ideal" | "acceptable" | "walkaway"
      follower_band:
        | "nano_10k_50k"
        | "micro_50k_100k"
        | "mid_100k_250k"
        | "macro_250k_500k"
      invoice_status: "issued" | "paid"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      creator_niche: [
        "skincare",
        "haircare",
        "makeup",
        "fashion",
        "food_beverage",
        "fitness",
        "tech_gadgets",
        "finance",
        "travel",
        "gaming",
        "education",
        "other",
      ],
      deal_channel: ["whatsapp", "instagram_dm", "email", "other"],
      deal_status: ["new", "countered", "agreed", "invoiced", "paid"],
      deliverable_format: ["reel", "story", "post", "youtube_video", "short"],
      draft_kind: ["counter_offer", "reminder"],
      draft_status: ["draft", "approved", "discarded"],
      draft_tier: ["ideal", "acceptable", "walkaway"],
      follower_band: [
        "nano_10k_50k",
        "micro_50k_100k",
        "mid_100k_250k",
        "macro_250k_500k",
      ],
      invoice_status: ["issued", "paid"],
    },
  },
} as const
