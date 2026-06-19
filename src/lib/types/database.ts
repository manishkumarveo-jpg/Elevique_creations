// Auto-generated placeholder — replace with:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'admin' | 'team_member' | 'client'
          company_name: string | null
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_by: string | null
          last_login: string | null
          assigned_team_member_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'admin' | 'team_member' | 'client'
          company_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_by?: string | null
          last_login?: string | null
          assigned_team_member_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'admin' | 'team_member' | 'client'
          company_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_by?: string | null
          last_login?: string | null
          assigned_team_member_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          name: string
          client_id: string
          package: string | null
          status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
          internal_deadline: string | null
          client_deadline: string | null
          description: string | null
          client_note: string | null
          created_by: string
          is_archived: boolean
          admin_approved: boolean
          approved_by_admin: string | null
          admin_approved_at: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          project_type: string | null
          estimated_hours: number | null
          budget: number | null
          start_date: string | null
          work_started_date: string | null
          completion_date: string | null
          progress_percent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client_id: string
          package?: string | null
          status?: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
          internal_deadline?: string | null
          client_deadline?: string | null
          description?: string | null
          client_note?: string | null
          created_by: string
          is_archived?: boolean
          admin_approved?: boolean
          approved_by_admin?: string | null
          admin_approved_at?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          project_type?: string | null
          estimated_hours?: number | null
          budget?: number | null
          start_date?: string | null
          work_started_date?: string | null
          completion_date?: string | null
          progress_percent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client_id?: string
          package?: string | null
          status?: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
          internal_deadline?: string | null
          client_deadline?: string | null
          description?: string | null
          client_note?: string | null
          created_by?: string
          is_archived?: boolean
          admin_approved?: boolean
          approved_by_admin?: string | null
          admin_approved_at?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          project_type?: string | null
          estimated_hours?: number | null
          budget?: number | null
          start_date?: string | null
          work_started_date?: string | null
          completion_date?: string | null
          progress_percent?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deadline_extensions: {
        Row: {
          id: string
          project_id: string
          deadline_type: 'internal' | 'client'
          old_date: string | null
          new_date: string
          reason: string | null
          extended_by: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          deadline_type: 'internal' | 'client'
          old_date?: string | null
          new_date: string
          reason?: string | null
          extended_by: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          deadline_type?: 'internal' | 'client'
          old_date?: string | null
          new_date?: string
          reason?: string | null
          extended_by?: string
          created_at?: string
        }
        Relationships: []
      }
      project_assignments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role_on_project: string
          assigned_by: string
          assigned_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role_on_project?: string
          assigned_by: string
          assigned_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role_on_project?: string
          assigned_by?: string
          assigned_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          phase_number: number
          phase_name: string
          status: 'pending' | 'in_progress' | 'done'
          scheduled_date: string | null
          completed_date: string | null
          notes: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase_number: number
          phase_name: string
          status?: 'pending' | 'in_progress' | 'done'
          scheduled_date?: string | null
          completed_date?: string | null
          notes?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase_number?: number
          phase_name?: string
          status?: 'pending' | 'in_progress' | 'done'
          scheduled_date?: string | null
          completed_date?: string | null
          notes?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          id: string
          project_id: string
          name: string
          icon: string | null
          description: string | null
          sort_order: number
          upload_roles: string[]
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          icon?: string | null
          description?: string | null
          sort_order?: number
          upload_roles?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          icon?: string | null
          description?: string | null
          sort_order?: number
          upload_roles?: string[]
          created_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          id: string
          folder_id: string
          project_id: string
          uploaded_by: string
          file_name: string
          file_type: string | null
          file_size: string | null
          file_url: string
          notes: string | null
          is_deleted: boolean
          deleted_by: string | null
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          folder_id: string
          project_id: string
          uploaded_by: string
          file_name: string
          file_type?: string | null
          file_size?: string | null
          file_url: string
          notes?: string | null
          is_deleted?: boolean
          deleted_by?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          folder_id?: string
          project_id?: string
          uploaded_by?: string
          file_name?: string
          file_type?: string | null
          file_size?: string | null
          file_url?: string
          notes?: string | null
          is_deleted?: boolean
          deleted_by?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          id: string
          project_id: string
          file_id: string | null
          deliverable_type: 'video' | 'image'
          file_name: string
          duration: string | null
          dimensions: string | null
          resolution: string | null
          format: string | null
          status: 'pending' | 'shared' | 'delivered' | 'approved'
          delivered_on: string | null
          approved_by: string | null
          approved_at: string | null
          revision_note: string | null
          drive_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_id?: string | null
          deliverable_type: 'video' | 'image'
          file_name: string
          duration?: string | null
          dimensions?: string | null
          resolution?: string | null
          format?: string | null
          status?: 'pending' | 'shared' | 'delivered' | 'approved'
          delivered_on?: string | null
          approved_by?: string | null
          approved_at?: string | null
          revision_note?: string | null
          drive_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_id?: string | null
          deliverable_type?: 'video' | 'image'
          file_name?: string
          duration?: string | null
          dimensions?: string | null
          resolution?: string | null
          format?: string | null
          status?: 'pending' | 'shared' | 'delivered' | 'approved'
          delivered_on?: string | null
          approved_by?: string | null
          approved_at?: string | null
          revision_note?: string | null
          drive_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      asset_checklist: {
        Row: {
          id: string
          project_id: string
          item_label: string
          is_completed: boolean
          completed_by: string | null
          completed_at: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          item_label: string
          is_completed?: boolean
          completed_by?: string | null
          completed_at?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          item_label?: string
          is_completed?: boolean
          completed_by?: string | null
          completed_at?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      project_revisions: {
        Row: {
          id: string
          project_id: string
          submitted_by: string
          note: string
          status: 'open' | 'resolved'
          resolved_by: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          submitted_by: string
          note: string
          status?: 'open' | 'resolved'
          resolved_by?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          submitted_by?: string
          note?: string
          status?: 'open' | 'resolved'
          resolved_by?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          id: string
          project_id: string | null
          actor_id: string
          actor_role: 'admin' | 'team_member' | 'client'
          action: string
          entity_type: string | null
          entity_id: string | null
          entity_name: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          actor_id: string
          actor_role: 'admin' | 'team_member' | 'client'
          action: string
          entity_type?: string | null
          entity_id?: string | null
          entity_name?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          actor_id?: string
          actor_role?: 'admin' | 'team_member' | 'client'
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          entity_name?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          project_id: string
          sender_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          sender_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          sender_id?: string
          body?: string
          created_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      social_leads: {
        Row: {
          id: string
          service_type: string | null
          videos_count: string | null
          budget_per_video: string | null
          requirement_brief: string | null
          full_name: string
          email: string
          phone: string | null
          city: string | null
          company_name: string | null
          website: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service_type?: string | null
          videos_count?: string | null
          budget_per_video?: string | null
          requirement_brief?: string | null
          full_name: string
          email: string
          phone?: string | null
          city?: string | null
          company_name?: string | null
          website?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          service_type?: string | null
          videos_count?: string | null
          budget_per_video?: string | null
          requirement_brief?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          city?: string | null
          company_name?: string | null
          website?: string | null
          created_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          id: string
          title: string
          scheduled_at: string
          client_id: string | null
          assigned_team_member_id: string | null
          project_id: string | null
          notes: string | null
          attended_by_team: boolean
          attended_at: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          scheduled_at: string
          client_id?: string | null
          assigned_team_member_id?: string | null
          project_id?: string | null
          notes?: string | null
          attended_by_team?: boolean
          attended_at?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          scheduled_at?: string
          client_id?: string | null
          assigned_team_member_id?: string | null
          project_id?: string | null
          notes?: string | null
          attended_by_team?: boolean
          attended_at?: string | null
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      production_deliverables: {
        Row: {
          id: string
          project_id: string
          brand_name: string
          deliverable_type: string
          details: string | null
          assets_location: string | null
          status: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
          comments: string | null
          pending_with_id: string | null
          delivery_date: string | null
          priority: 'P1' | 'P2' | 'P3'
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          brand_name: string
          deliverable_type: string
          details?: string | null
          assets_location?: string | null
          status?: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
          comments?: string | null
          pending_with_id?: string | null
          delivery_date?: string | null
          priority?: 'P1' | 'P2' | 'P3'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          brand_name?: string
          deliverable_type?: string
          details?: string | null
          assets_location?: string | null
          status?: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
          comments?: string | null
          pending_with_id?: string | null
          delivery_date?: string | null
          priority?: 'P1' | 'P2' | 'P3'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      video_generation_tasks: {
        Row: {
          id: string
          project_id: string
          brand_name: string
          content_type: string
          script_number: number
          assigned_to_id: string | null
          assigned_at: string
          completed_at: string | null
          status: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
          checks_performed: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          brand_name: string
          content_type: string
          script_number?: number
          assigned_to_id?: string | null
          assigned_at?: string
          completed_at?: string | null
          status?: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
          checks_performed?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          brand_name?: string
          content_type?: string
          script_number?: number
          assigned_to_id?: string | null
          assigned_at?: string
          completed_at?: string | null
          status?: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
          checks_performed?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      projects_team: {
        Row: {
          id: string
          name: string
          client_id: string
          package: string | null
          status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
          internal_deadline: string | null
          description: string | null
          client_note: string | null
          created_by: string
          is_archived: boolean
          admin_approved: boolean
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
      projects_client: {
        Row: {
          id: string
          name: string
          client_id: string
          package: string | null
          status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
          client_deadline: string | null
          description: string | null
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: 'admin' | 'team_member' | 'client'
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_assigned_to_project: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      is_project_client: {
        Args: { p_project_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'admin' | 'team_member' | 'client'
      project_status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
      milestone_status: 'pending' | 'in_progress' | 'done'
      deliverable_type: 'video' | 'image'
      deliverable_status: 'pending' | 'shared' | 'delivered' | 'approved'
      tracker_status: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
      tracker_priority: 'P1' | 'P2' | 'P3'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
