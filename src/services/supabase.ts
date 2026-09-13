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
          comments_count: number
          shares_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content?: string | null
          media_url?: string | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string | null
          media_url?: string | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
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
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          created_at?: string
        }
      }
      friend_requests: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
          created_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled'
          created_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled'
          created_at?: string
          responded_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          type: 'direct' | 'group' | 'trip'
          name: string | null
          avatar_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type?: 'direct' | 'group' | 'trip'
          name?: string | null
          avatar_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'direct' | 'group' | 'trip'
          name?: string | null
          avatar_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_members: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
          last_read_at: string
          muted: boolean
          archived: boolean
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
          last_read_at?: string
          muted?: boolean
          archived?: boolean
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
          last_read_at?: string
          muted?: boolean
          archived?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string | null
          message_type: 'text' | 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file' | 'post' | 'trip' | 'system'
          content: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          expires_at: string | null
          is_pinned: boolean
          reply_to_id: string | null
          forwarded_from_id: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id?: string | null
          message_type?: 'text' | 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file' | 'post' | 'trip' | 'system'
          content?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          is_pinned?: boolean
          reply_to_id?: string | null
          forwarded_from_id?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string | null
          message_type?: 'text' | 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file' | 'post' | 'trip' | 'system'
          content?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          expires_at?: string | null
          is_pinned?: boolean
          reply_to_id?: string | null
          forwarded_from_id?: string | null
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          reaction: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          reaction: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          reaction?: string
          created_at?: string
        }
      }
      message_attachments: {
        Row: {
          id: string
          message_id: string
          type: 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file'
          storage_path: string
          public_url: string | null
          mime_type: string
          file_size: number
          width: number | null
          height: number | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          type: 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file'
          storage_path: string
          public_url?: string | null
          mime_type: string
          file_size?: number
          width?: number | null
          height?: number | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          type?: 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file'
          storage_path?: string
          public_url?: string | null
          mime_type?: string
          file_size?: number
          width?: number | null
          height?: number | null
          duration?: number | null
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          conversation_id: string
          name: string
          description: string | null
          avatar_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          name: string
          description?: string | null
          avatar_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          name?: string
          description?: string | null
          avatar_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trip_groups: {
        Row: {
          id: string
          experience_id: string
          conversation_id: string
          name: string
          trip_date: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          conversation_id: string
          name: string
          trip_date?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          conversation_id?: string
          name?: string
          trip_date?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      sticker_packs: {
        Row: {
          id: string
          name: string
          cover_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          cover_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          cover_url?: string | null
          created_at?: string
        }
      }
      stickers: {
        Row: {
          id: string
          pack_id: string
          name: string | null
          media_url: string
          created_at: string
        }
        Insert: {
          id?: string
          pack_id: string
          name?: string | null
          media_url: string
          created_at?: string
        }
        Update: {
          id?: string
          pack_id?: string
          name?: string | null
          media_url?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'friend_request' | 'friend_accepted' | 'new_message' | 'mention' | 'reaction' | 'comment' | 'share' | 'group_invite' | 'trip_invite' | 'group_message'
          from_user_id: string | null
          entity_type: string | null
          entity_id: string | null
          content: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'friend_request' | 'friend_accepted' | 'new_message' | 'mention' | 'reaction' | 'comment' | 'share' | 'group_invite' | 'trip_invite' | 'group_message'
          from_user_id?: string | null
          entity_type?: string | null
          entity_id?: string | null
          content?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'friend_request' | 'friend_accepted' | 'new_message' | 'mention' | 'reaction' | 'comment' | 'share' | 'group_invite' | 'trip_invite' | 'group_message'
          from_user_id?: string | null
          entity_type?: string | null
          entity_id?: string | null
          content?: string | null
          read?: boolean
          created_at?: string
        }
      }
      post_shares: {
        Row: {
          id: string
          post_id: string
          user_id: string
          conversation_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          conversation_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          conversation_id?: string | null
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
          shares_count: number
          liked_by_me: boolean
          created_at: string
        }>
      }
      get_or_create_direct_conversation: {
        Args: { other_user_id: string }
        Returns: string
      }
      send_friend_request: {
        Args: { receiver_id: string }
        Returns: string
      }
      respond_friend_request: {
        Args: { request_id: string; accept: boolean }
        Returns: boolean
      }
      remove_friend: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      toggle_message_reaction: {
        Args: { p_message_id: string; p_reaction: string }
        Returns: boolean
      }
      mark_conversation_as_read: {
        Args: { p_conversation_id: string }
        Returns: void
      }
      pin_message: {
        Args: { p_message_id: string; p_pin: boolean }
        Returns: void
      }
      delete_message: {
        Args: { p_message_id: string }
        Returns: void
      }
      get_user_conversations: {
        Args: Record<string, never>
        Returns: Array<{
          conversation_id: string
          type: 'direct' | 'group' | 'trip'
          name: string | null
          avatar_url: string | null
          last_message: string | null
          last_message_at: string | null
          last_message_sender: string | null
          unread_count: number
          member_count: number
        }>
      }
      get_conversation_messages: {
        Args: { p_conversation_id: string; p_limit?: number; p_before?: string | null }
        Returns: Array<{
          id: string
          sender_id: string | null
          sender_name: string
          sender_avatar: string | null
          message_type: 'text' | 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'file' | 'post' | 'trip' | 'system'
          content: string | null
          created_at: string
          is_pinned: boolean
          reply_to_id: string | null
          reply_content: string | null
          reply_sender_name: string | null
          reactions: Record<string, number>
          attachments: Array<{ id: string; type: string; url: string; mime: string; size: number; width: number | null; height: number | null; duration: number | null }>
        }>
      }
      get_unread_counts: {
        Args: Record<string, never>
        Returns: Array<{ conversation_id: string; unread_count: number }>
      }
      search_users: {
        Args: { p_query: string }
        Returns: Array<{
          id: string
          full_name: string | null
          avatar_url: string | null
          is_friend: boolean
          request_status: string
        }>
      }
      share_post: {
        Args: { p_post_id: string; p_conversation_id?: string | null }
        Returns: string
      }
      get_post_comments: {
        Args: { p_post_id: string }
        Returns: Array<{
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
          parent_id: string | null
          author_name: string
          author_avatar: string | null
        }>
      }
      get_post_authors: {
        Args: { p_user_ids: string[] }
        Returns: Array<{
          id: string
          full_name: string | null
          avatar_url: string | null
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