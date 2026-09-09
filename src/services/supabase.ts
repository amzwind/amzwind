/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Types para as tabelas do banco
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          type: 'experience' | 'product' | 'class'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type: 'experience' | 'product' | 'class'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: 'experience' | 'product' | 'class'
          created_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category_id: string
          price: number
          duration: string | null
          level: string | null
          community: string | null
          image_url: string | null
          video_url: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          category_id: string
          price?: number
          duration?: string | null
          level?: string | null
          community?: string | null
          image_url?: string | null
          video_url?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          category_id?: string
          price?: number
          duration?: string | null
          level?: string | null
          community?: string | null
          image_url?: string | null
          video_url?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          stock: number
          image_url: string | null
          category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number
          stock?: number
          image_url?: string | null
          category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          stock?: number
          image_url?: string | null
          category_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          item_type: 'experience' | 'class' | 'product'
          item_id: string
          status: 'pending' | 'confirmed' | 'cancelled'
          booking_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_type: 'experience' | 'class' | 'product'
          item_id: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          booking_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_type?: 'experience' | 'class' | 'product'
          item_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          booking_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
