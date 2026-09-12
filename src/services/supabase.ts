/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

// Tenta pegar de todas as formas possíveis para evitar que quebre em produção
const supabaseUrl =
  (import.meta.env.SUPABASE_URL as string) ||
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (typeof window !== 'undefined' && (window as any).__SUPABASE_URL__)

const supabaseAnonKey =
  (import.meta.env.SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (typeof window !== 'undefined' && (window as any).__SUPABASE_ANON_KEY__)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key ausentes. Verifique as configurações na Vercel.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

// Types para as tabelas do banco
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          phone: string | null
          whatsapp: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          phone?: string | null
          whatsapp?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          phone?: string | null
          whatsapp?: string | null
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
          type: string | null
          includes: string[] | null
          original_price: number | null
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
          type?: string | null
          includes?: string[] | null
          original_price?: number | null
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
          type?: string | null
          includes?: string[] | null
          original_price?: number | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          item_type?: 'experience' | 'class' | 'product'
          item_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          booking_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          contact_type: 'contact' | 'newsletter'
          full_name: string | null
          email: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contact_type: 'contact' | 'newsletter'
          full_name?: string | null
          email: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contact_type?: 'contact' | 'newsletter'
          full_name?: string | null
          email?: string
          message?: string | null
          created_at?: string
        }
      }
      financial_accounts: {
        Row: {
          id: string
          account_type: 'payable' | 'receivable'
          description: string
          amount: number
          due_date: string
          status: 'pending' | 'paid' | 'overdue'
          category: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_type: 'payable' | 'receivable'
          description: string
          amount?: number
          due_date: string
          status?: 'pending' | 'paid' | 'overdue'
          category?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_type?: 'payable' | 'receivable'
          description?: string
          amount?: number
          due_date?: string
          status?: 'pending' | 'paid' | 'overdue'
          category?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      about_page: {
        Row: {
          id: string
          locale: 'pt' | 'en' | 'es'
          title: string
          subtitle: string | null
          description: string | null
          cover_url: string | null
          video_url: string | null
          gallery_urls: string[]
          mission: string | null
          vision: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          locale?: 'pt' | 'en' | 'es'
          title?: string
          subtitle?: string | null
          description?: string | null
          cover_url?: string | null
          video_url?: string | null
          gallery_urls?: string[]
          mission?: string | null
          vision?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          locale?: 'pt' | 'en' | 'es'
          title?: string
          subtitle?: string | null
          description?: string | null
          cover_url?: string | null
          video_url?: string | null
          gallery_urls?: string[]
          mission?: string | null
          vision?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          duration: string | null
          level: string | null
          image_url: string | null
          video_url: string | null
          gallery_urls: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number
          duration?: string | null
          level?: string | null
          image_url?: string | null
          video_url?: string | null
          gallery_urls?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          duration?: string | null
          level?: string | null
          image_url?: string | null
          video_url?: string | null
          gallery_urls?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      hero_slides: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          media_url: string
          media_type: 'image' | 'video'
          cta_text: string | null
          cta_link: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          media_url: string
          media_type?: 'image' | 'video'
          cta_text?: string | null
          cta_link?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          media_url?: string
          media_type?: 'image' | 'video'
          cta_text?: string | null
          cta_link?: string | null
          display_order?: number
          created_at?: string
        }
      }
      experience_reviews: {
        Row: {
          id: string
          experience_id: string
          user_id: string
          rating: number
          comment: string | null
          status: 'pending' | 'approved' | 'rejected'
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          user_id: string
          rating: number
          comment?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string | null
          media_url: string | null
          likes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content?: string | null
          media_url?: string | null
          likes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string | null
          media_url?: string | null
          likes_count?: number
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      toggle_post_like: {
        Args: { p_post_id: string }
        Returns: boolean
      }
      get_posts_feed: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Array<{
          id: string
          user_id: string
          content: string | null
          media_url: string | null
          likes_count: number
          comments_count: number
          liked_by_me: boolean
          created_at: string
        }>
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