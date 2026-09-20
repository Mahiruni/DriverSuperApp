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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addon_fees: {
        Row: {
          amount_minor: number
          city_id: string
          created_at: string
          driver_id: string | null
          id: string
          idempotency_key: string | null
          latitude: number | null
          longitude: number | null
          reason: string
          status: string
          trip_id: string | null
          undone_at: string | null
        }
        Insert: {
          amount_minor: number
          city_id: string
          created_at?: string
          driver_id?: string | null
          id?: string
          idempotency_key?: string | null
          latitude?: number | null
          longitude?: number | null
          reason: string
          status?: string
          trip_id?: string | null
          undone_at?: string | null
        }
        Update: {
          amount_minor?: number
          city_id?: string
          created_at?: string
          driver_id?: string | null
          id?: string
          idempotency_key?: string | null
          latitude?: number | null
          longitude?: number | null
          reason?: string
          status?: string
          trip_id?: string | null
          undone_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addon_fees_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addon_fees_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addon_fees_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_action_log: {
        Row: {
          action: string
          actor_id: string
          city_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id: string
          city_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string
          city_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_action_log_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          city_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          city_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          city_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_jobs: {
        Row: {
          attempts: number
          broadcast_id: string
          channel: string
          city_id: string
          created_at: string
          id: string
          last_error: string | null
          next_attempt_at: string
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          broadcast_id: string
          channel: string
          city_id: string
          created_at?: string
          id?: string
          last_error?: string | null
          next_attempt_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          broadcast_id?: string
          channel?: string
          city_id?: string
          created_at?: string
          id?: string
          last_error?: string | null
          next_attempt_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_jobs_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_jobs_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_recipients: {
        Row: {
          attempts: number
          broadcast_id: string
          city_id: string
          created_at: string
          delivery_status: string
          id: string
          last_error: string | null
          recipient_id: string
          sent_at: string | null
          state: Database["public"]["Enums"]["broadcast_recipient_state"]
        }
        Insert: {
          attempts?: number
          broadcast_id: string
          city_id: string
          created_at?: string
          delivery_status?: string
          id?: string
          last_error?: string | null
          recipient_id: string
          sent_at?: string | null
          state?: Database["public"]["Enums"]["broadcast_recipient_state"]
        }
        Update: {
          attempts?: number
          broadcast_id?: string
          city_id?: string
          created_at?: string
          delivery_status?: string
          id?: string
          last_error?: string | null
          recipient_id?: string
          sent_at?: string | null
          state?: Database["public"]["Enums"]["broadcast_recipient_state"]
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_recipients_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "broadcasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_recipients_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          body: string
          city_id: string
          created_at: string
          created_by: string
          id: string
          title: string
        }
        Insert: {
          body: string
          city_id: string
          created_at?: string
          created_by: string
          id?: string
          title: string
        }
        Update: {
          body?: string
          city_id?: string
          created_at?: string
          created_by?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcasts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_orders: {
        Row: {
          city_id: string
          created_at: string
          customer_id: string
          delivery_label: string | null
          delivery_location: unknown
          id: string
          item_type: string
          needed_by: string
          photo_path: string | null
          quantity: number
          state: Database["public"]["Enums"]["order_state"]
        }
        Insert: {
          city_id: string
          created_at?: string
          customer_id: string
          delivery_label?: string | null
          delivery_location: unknown
          id?: string
          item_type: string
          needed_by: string
          photo_path?: string | null
          quantity: number
          state?: Database["public"]["Enums"]["order_state"]
        }
        Update: {
          city_id?: string
          created_at?: string
          customer_id?: string
          delivery_label?: string | null
          delivery_location?: unknown
          id?: string
          item_type?: string
          needed_by?: string
          photo_path?: string | null
          quantity?: number
          state?: Database["public"]["Enums"]["order_state"]
        }
        Relationships: [
          {
            foreignKeyName: "bulk_orders_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country_code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          timezone: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          timezone?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          timezone?: string
        }
        Relationships: []
      }
      driver_locations: {
        Row: {
          accuracy_m: number | null
          city_id: string
          driver_id: string
          heading: number | null
          location: unknown
          speed_mps: number | null
          updated_at: string
        }
        Insert: {
          accuracy_m?: number | null
          city_id: string
          driver_id: string
          heading?: number | null
          location: unknown
          speed_mps?: number | null
          updated_at?: string
        }
        Update: {
          accuracy_m?: number | null
          city_id?: string
          driver_id?: string
          heading?: number | null
          location?: unknown
          speed_mps?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          city_id: string
          created_at: string
          id: string
          is_online: boolean
          license_document_path: string | null
          license_number: string
          location: unknown
          rating: number | null
          review_status: string
          vehicle_document_path: string | null
        }
        Insert: {
          city_id: string
          created_at?: string
          id: string
          is_online?: boolean
          license_document_path?: string | null
          license_number: string
          location?: unknown
          rating?: number | null
          review_status?: string
          vehicle_document_path?: string | null
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          is_online?: boolean
          license_document_path?: string | null
          license_number?: string
          location?: unknown
          rating?: number | null
          review_status?: string
          vehicle_document_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fare_config_versions: {
        Row: {
          changed_by: string
          city_id: string
          created_at: string
          fare_config_id: string
          id: string
          snapshot: Json
        }
        Insert: {
          changed_by: string
          city_id: string
          created_at?: string
          fare_config_id: string
          id?: string
          snapshot: Json
        }
        Update: {
          changed_by?: string
          city_id?: string
          created_at?: string
          fare_config_id?: string
          id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fare_config_versions_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fare_config_versions_fare_config_id_fkey"
            columns: ["fare_config_id"]
            isOneToOne: false
            referencedRelation: "fare_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      fare_configs: {
        Row: {
          base_minor: number
          city_id: string
          commission_percent: number
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          max_addon_minor_per_trip: number | null
          minimum_fare_minor: number
          per_km_minor: number
          per_minute_minor: number
          service_type: string
          shared_ride_discount_percent: number
        }
        Insert: {
          base_minor: number
          city_id: string
          commission_percent?: number
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          max_addon_minor_per_trip?: number | null
          minimum_fare_minor: number
          per_km_minor: number
          per_minute_minor: number
          service_type: string
          shared_ride_discount_percent?: number
        }
        Update: {
          base_minor?: number
          city_id?: string
          commission_percent?: number
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          max_addon_minor_per_trip?: number | null
          minimum_fare_minor?: number
          per_km_minor?: number
          per_minute_minor?: number
          service_type?: string
          shared_ride_discount_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "fare_configs_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          city_id: string
          created_at: string
          data: Json
          id: string
          read_at: string | null
          recipient_id: string
          title: string
        }
        Insert: {
          body: string
          city_id: string
          created_at?: string
          data?: Json
          id?: string
          read_at?: string | null
          recipient_id: string
          title: string
        }
        Update: {
          body?: string
          city_id?: string
          created_at?: string
          data?: Json
          id?: string
          read_at?: string | null
          recipient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: string
          admin_role: string | null
          avatar_path: string | null
          city_id: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          account_status?: string
          admin_role?: string | null
          avatar_path?: string | null
          city_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          account_status?: string
          admin_role?: string | null
          avatar_path?: string | null
          city_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          city_id: string
          code: string
          ends_at: string | null
          id: string
          is_active: boolean
          kind: Database["public"]["Enums"]["promo_kind"]
          max_discount_minor: number | null
          percentage: number | null
          starts_at: string
          usage_count: number
          usage_limit: number | null
          value_minor: number | null
        }
        Insert: {
          city_id: string
          code: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          kind: Database["public"]["Enums"]["promo_kind"]
          max_discount_minor?: number | null
          percentage?: number | null
          starts_at: string
          usage_count?: number
          usage_limit?: number | null
          value_minor?: number | null
        }
        Update: {
          city_id?: string
          code?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          kind?: Database["public"]["Enums"]["promo_kind"]
          max_discount_minor?: number | null
          percentage?: number | null
          starts_at?: string
          usage_count?: number
          usage_limit?: number | null
          value_minor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_buckets: {
        Row: {
          bucket_key: string
          request_count: number
          updated_at: string
          window_started_at: string
        }
        Insert: {
          bucket_key: string
          request_count?: number
          updated_at?: string
          window_started_at?: string
        }
        Update: {
          bucket_key?: string
          request_count?: number
          updated_at?: string
          window_started_at?: string
        }
        Relationships: []
      }
      shared_ride_passengers: {
        Row: {
          city_id: string
          confirmed_at: string | null
          created_at: string
          customer_id: string | null
          destination: unknown
          destination_label: string | null
          dropoff_confirmed_at: string | null
          id: string
          invite_token: string
          invited_at: string
          onboard_distance_m: number
          onboard_duration_s: number
          passenger_index: number
          phone: string
          pickup: unknown
          pickup_confirmed_at: string | null
          pickup_label: string | null
          shared_ride_id: string
          status: string
          trip_id: string
        }
        Insert: {
          city_id: string
          confirmed_at?: string | null
          created_at?: string
          customer_id?: string | null
          destination: unknown
          destination_label?: string | null
          dropoff_confirmed_at?: string | null
          id?: string
          invite_token?: string
          invited_at?: string
          onboard_distance_m?: number
          onboard_duration_s?: number
          passenger_index: number
          phone: string
          pickup: unknown
          pickup_confirmed_at?: string | null
          pickup_label?: string | null
          shared_ride_id: string
          status?: string
          trip_id: string
        }
        Update: {
          city_id?: string
          confirmed_at?: string | null
          created_at?: string
          customer_id?: string | null
          destination?: unknown
          destination_label?: string | null
          dropoff_confirmed_at?: string | null
          id?: string
          invite_token?: string
          invited_at?: string
          onboard_distance_m?: number
          onboard_duration_s?: number
          passenger_index?: number
          phone?: string
          pickup?: unknown
          pickup_confirmed_at?: string | null
          pickup_label?: string | null
          shared_ride_id?: string
          status?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_ride_passengers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_ride_passengers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_ride_passengers_shared_ride_id_fkey"
            columns: ["shared_ride_id"]
            isOneToOne: false
            referencedRelation: "shared_rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_ride_passengers_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_rides: {
        Row: {
          city_id: string
          created_at: string
          customer_id: string
          driver_id: string
          id: string
          responded_at: string | null
          state: Database["public"]["Enums"]["broadcast_recipient_state"]
          tracking_token: string
          trip_id: string | null
        }
        Insert: {
          city_id: string
          created_at?: string
          customer_id: string
          driver_id: string
          id?: string
          responded_at?: string | null
          state?: Database["public"]["Enums"]["broadcast_recipient_state"]
          tracking_token?: string
          trip_id?: string | null
        }
        Update: {
          city_id?: string
          created_at?: string
          customer_id?: string
          driver_id?: string
          id?: string
          responded_at?: string | null
          state?: Database["public"]["Enums"]["broadcast_recipient_state"]
          tracking_token?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_rides_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_rides_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_rides_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      supplier_quotes: {
        Row: {
          amount_minor: number
          bulk_order_id: string
          city_id: string
          created_at: string
          expires_at: string
          id: string
          note: string | null
          secure_token_hash: string
          supplier_id: string
        }
        Insert: {
          amount_minor: number
          bulk_order_id: string
          city_id: string
          created_at?: string
          expires_at: string
          id?: string
          note?: string | null
          secure_token_hash: string
          supplier_id: string
        }
        Update: {
          amount_minor?: number
          bulk_order_id?: string
          city_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          note?: string | null
          secure_token_hash?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_quotes_bulk_order_id_fkey"
            columns: ["bulk_order_id"]
            isOneToOne: false
            referencedRelation: "bulk_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_quotes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_quotes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          business_name: string
          category: string | null
          city_id: string
          created_at: string
          id: string
          is_active: boolean
          phone: string
          profile_id: string
          push_token: string | null
        }
        Insert: {
          business_name: string
          category?: string | null
          city_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone: string
          profile_id: string
          push_token?: string | null
        }
        Update: {
          business_name?: string
          category?: string | null
          city_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone?: string
          profile_id?: string
          push_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          accepted_at: string | null
          cancelled_at: string | null
          city_id: string
          completed_at: string | null
          customer_id: string
          destination: unknown
          destination_label: string | null
          driver_addon_minor: number
          driver_id: string | null
          estimated_distance_m: number
          estimated_duration_s: number
          fare_base_minor: number
          fare_distance_minor: number
          fare_time_minor: number
          final_distance_m: number | null
          final_duration_s: number | null
          id: string
          pickup: unknown
          pickup_label: string | null
          promo_code_id: string | null
          promo_discount_minor: number
          requested_at: string
          service_type: string
          shared_ride_id: string | null
          state: Database["public"]["Enums"]["trip_state"]
          total_minor: number
          vehicle_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          cancelled_at?: string | null
          city_id: string
          completed_at?: string | null
          customer_id: string
          destination: unknown
          destination_label?: string | null
          driver_addon_minor?: number
          driver_id?: string | null
          estimated_distance_m: number
          estimated_duration_s: number
          fare_base_minor?: number
          fare_distance_minor?: number
          fare_time_minor?: number
          final_distance_m?: number | null
          final_duration_s?: number | null
          id?: string
          pickup: unknown
          pickup_label?: string | null
          promo_code_id?: string | null
          promo_discount_minor?: number
          requested_at?: string
          service_type: string
          shared_ride_id?: string | null
          state?: Database["public"]["Enums"]["trip_state"]
          total_minor?: number
          vehicle_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          cancelled_at?: string | null
          city_id?: string
          completed_at?: string | null
          customer_id?: string
          destination?: unknown
          destination_label?: string | null
          driver_addon_minor?: number
          driver_id?: string | null
          estimated_distance_m?: number
          estimated_duration_s?: number
          fare_base_minor?: number
          fare_distance_minor?: number
          fare_time_minor?: number
          final_distance_m?: number | null
          final_duration_s?: number | null
          id?: string
          pickup?: unknown
          pickup_label?: string | null
          promo_code_id?: string | null
          promo_discount_minor?: number
          requested_at?: string
          service_type?: string
          shared_ride_id?: string | null
          state?: Database["public"]["Enums"]["trip_state"]
          total_minor?: number
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_shared_ride_id_fkey"
            columns: ["shared_ride_id"]
            isOneToOne: false
            referencedRelation: "shared_rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          city_id: string
          color: string | null
          created_at: string
          driver_id: string
          id: string
          make: string
          model: string
          plate_number: string
          seats: number
        }
        Insert: {
          city_id: string
          color?: string | null
          created_at?: string
          driver_id: string
          id?: string
          make: string
          model: string
          plate_number: string
          seats?: number
        }
        Update: {
          city_id?: string
          color?: string | null
          created_at?: string
          driver_id?: string
          id?: string
          make?: string
          model?: string
          plate_number?: string
          seats?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_ledger: {
        Row: {
          amount_minor: number
          city_id: string
          created_at: string
          entry_type: string
          id: string
          metadata: Json
          profile_id: string
          reference_id: string | null
        }
        Insert: {
          amount_minor: number
          city_id: string
          created_at?: string
          entry_type: string
          id?: string
          metadata?: Json
          profile_id: string
          reference_id?: string | null
        }
        Update: {
          amount_minor?: number
          city_id?: string
          created_at?: string
          entry_type?: string
          id?: string
          metadata?: Json
          profile_id?: string
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_ledger_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      accept_trip_request: {
        Args: { p_trip_id: string }
        Returns: {
          accepted_at: string | null
          cancelled_at: string | null
          city_id: string
          completed_at: string | null
          customer_id: string
          destination: unknown
          destination_label: string | null
          driver_addon_minor: number
          driver_id: string | null
          estimated_distance_m: number
          estimated_duration_s: number
          fare_base_minor: number
          fare_distance_minor: number
          fare_time_minor: number
          final_distance_m: number | null
          final_duration_s: number | null
          id: string
          pickup: unknown
          pickup_label: string | null
          promo_code_id: string | null
          promo_discount_minor: number
          requested_at: string
          service_type: string
          shared_ride_id: string | null
          state: Database["public"]["Enums"]["trip_state"]
          total_minor: number
          vehicle_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "trips"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      add_driver_addon: {
        Args: {
          p_amount_minor: number
          p_idempotency_key: string
          p_lat?: number
          p_lng?: number
          p_trip_id: string
        }
        Returns: {
          amount_minor: number
          city_id: string
          created_at: string
          driver_id: string | null
          id: string
          idempotency_key: string | null
          latitude: number | null
          longitude: number | null
          reason: string
          status: string
          trip_id: string | null
          undone_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "addon_fees"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      add_shared_ride_passenger: {
        Args: {
          p_destination_label?: string
          p_destination_lat: number
          p_destination_lng: number
          p_phone: string
          p_pickup_label?: string
          p_pickup_lat: number
          p_pickup_lng: number
          p_shared_ride_id: string
        }
        Returns: {
          city_id: string
          confirmed_at: string | null
          created_at: string
          customer_id: string | null
          destination: unknown
          destination_label: string | null
          dropoff_confirmed_at: string | null
          id: string
          invite_token: string
          invited_at: string
          onboard_distance_m: number
          onboard_duration_s: number
          passenger_index: number
          phone: string
          pickup: unknown
          pickup_confirmed_at: string | null
          pickup_label: string | null
          shared_ride_id: string
          status: string
          trip_id: string
        }
        SetofOptions: {
          from: "*"
          to: "shared_ride_passengers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      admin_dashboard_summary: {
        Args: { p_city_id?: string; p_from?: string; p_to?: string }
        Returns: Json
      }
      can_manage_fares: { Args: never; Returns: boolean }
      can_view_finance: { Args: never; Returns: boolean }
      complete_shared_passenger: {
        Args: {
          p_distance_m: number
          p_duration_s: number
          p_passenger_id: string
        }
        Returns: {
          city_id: string
          confirmed_at: string | null
          created_at: string
          customer_id: string | null
          destination: unknown
          destination_label: string | null
          dropoff_confirmed_at: string | null
          id: string
          invite_token: string
          invited_at: string
          onboard_distance_m: number
          onboard_duration_s: number
          passenger_index: number
          phone: string
          pickup: unknown
          pickup_confirmed_at: string | null
          pickup_label: string | null
          shared_ride_id: string
          status: string
          trip_id: string
        }
        SetofOptions: {
          from: "*"
          to: "shared_ride_passengers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      consume_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number }
        Returns: boolean
      }
      create_bulk_order: {
        Args: {
          p_delivery_label: string
          p_item_type: string
          p_lat: number
          p_lng: number
          p_needed_by: string
          p_photo_path: string
          p_quantity: number
        }
        Returns: {
          city_id: string
          created_at: string
          customer_id: string
          delivery_label: string | null
          delivery_location: unknown
          id: string
          item_type: string
          needed_by: string
          photo_path: string | null
          quantity: number
          state: Database["public"]["Enums"]["order_state"]
        }
        SetofOptions: {
          from: "*"
          to: "bulk_orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_trip_request: {
        Args: {
          p_destination_lat: number
          p_destination_lng: number
          p_distance_m: number
          p_duration_s: number
          p_pickup_lat: number
          p_pickup_lng: number
          p_promo_code?: string
          p_service_type: string
        }
        Returns: {
          accepted_at: string | null
          cancelled_at: string | null
          city_id: string
          completed_at: string | null
          customer_id: string
          destination: unknown
          destination_label: string | null
          driver_addon_minor: number
          driver_id: string | null
          estimated_distance_m: number
          estimated_duration_s: number
          fare_base_minor: number
          fare_distance_minor: number
          fare_time_minor: number
          final_distance_m: number | null
          final_duration_s: number | null
          id: string
          pickup: unknown
          pickup_label: string | null
          promo_code_id: string | null
          promo_discount_minor: number
          requested_at: string
          service_type: string
          shared_ride_id: string | null
          state: Database["public"]["Enums"]["trip_state"]
          total_minor: number
          vehicle_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "trips"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      gettransactionid: { Args: never; Returns: unknown }
      is_admin: { Args: never; Returns: boolean }
      is_admin_role: { Args: { p_role: string }; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      queue_broadcast: {
        Args: {
          p_body: string
          p_bulk_order_id: string
          p_category: string
          p_channels: string[]
          p_title: string
        }
        Returns: string
      }
      save_fare_config: {
        Args: {
          p_base: number
          p_city_id: string
          p_commission: number
          p_max_addon: number
          p_minimum: number
          p_per_km: number
          p_per_minute: number
          p_service_type: string
          p_shared_discount: number
        }
        Returns: {
          base_minor: number
          city_id: string
          commission_percent: number
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          max_addon_minor_per_trip: number | null
          minimum_fare_minor: number
          per_km_minor: number
          per_minute_minor: number
          service_type: string
          shared_ride_discount_percent: number
        }
        SetofOptions: {
          from: "*"
          to: "fare_configs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      suspend_profile: {
        Args: { p_profile_id: string; p_status: string }
        Returns: {
          account_status: string
          admin_role: string | null
          avatar_path: string | null
          city_id: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      undo_driver_addon: {
        Args: { p_addon_id: string }
        Returns: {
          amount_minor: number
          city_id: string
          created_at: string
          driver_id: string | null
          id: string
          idempotency_key: string | null
          latitude: number | null
          longitude: number | null
          reason: string
          status: string
          trip_id: string | null
          undone_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "addon_fees"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "customer" | "driver" | "supplier" | "admin"
      broadcast_recipient_state: "pending" | "accepted" | "declined"
      order_state:
        | "requested"
        | "quoted"
        | "accepted"
        | "in_progress"
        | "completed"
        | "cancelled"
      promo_kind: "percentage" | "fixed"
      trip_state:
        | "requested"
        | "accepted"
        | "arriving"
        | "in_progress"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      app_role: ["customer", "driver", "supplier", "admin"],
      broadcast_recipient_state: ["pending", "accepted", "declined"],
      order_state: [
        "requested",
        "quoted",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
      ],
      promo_kind: ["percentage", "fixed"],
      trip_state: [
        "requested",
        "accepted",
        "arriving",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
