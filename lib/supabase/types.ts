export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          role: string
          avatar_url: string | null
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          role?: string
          avatar_url?: string | null
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          role?: string
          avatar_url?: string | null
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: string
          invited_at?: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          invited_at?: string
          joined_at?: string | null
        }
      }
      assets: {
        Row: {
          id: string
          organization_id: string
          name: string
          type: string
          value: string
          description: string | null
          tags: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          type: string
          value: string
          description?: string | null
          tags?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          type?: string
          value?: string
          description?: string | null
          tags?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          organization_id: string
          asset_id: string
          name: string
          scan_type: "web_application" | "network" | "cloud" | "database" | "mobile"
          status: "pending" | "running" | "completed" | "failed"
          progress: number
          started_at: string | null
          completed_at: string | null
          created_by: string | null
          config: Json
          results: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          asset_id: string
          name: string
          scan_type: "web_application" | "network" | "cloud" | "database" | "mobile"
          status?: "pending" | "running" | "completed" | "failed"
          progress?: number
          started_at?: string | null
          completed_at?: string | null
          created_by?: string | null
          config?: Json
          results?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          asset_id?: string
          name?: string
          scan_type?: "web_application" | "network" | "cloud" | "database" | "mobile"
          status?: "pending" | "running" | "completed" | "failed"
          progress?: number
          started_at?: string | null
          completed_at?: string | null
          created_by?: string | null
          config?: Json
          results?: Json
          created_at?: string
          updated_at?: string
        }
      }
      vulnerabilities: {
        Row: {
          id: string
          scan_id: string
          organization_id: string
          cve_id: string | null
          title: string
          description: string | null
          severity: "Critical" | "High" | "Medium" | "Low" | "Info"
          cvss_score: number | null
          category: string | null
          affected_component: string | null
          remediation_steps: string | null
          ai_summary: string | null
          ai_priority_score: number | null
          status: string
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          organization_id: string
          cve_id?: string | null
          title: string
          description?: string | null
          severity: "Critical" | "High" | "Medium" | "Low" | "Info"
          cvss_score?: number | null
          category?: string | null
          affected_component?: string | null
          remediation_steps?: string | null
          ai_summary?: string | null
          ai_priority_score?: number | null
          status?: string
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          organization_id?: string
          cve_id?: string | null
          title?: string
          description?: string | null
          severity?: "Critical" | "High" | "Medium" | "Low" | "Info"
          cvss_score?: number | null
          category?: string | null
          affected_component?: string | null
          remediation_steps?: string | null
          ai_summary?: string | null
          ai_priority_score?: number | null
          status?: string
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vulnerability_comments: {
        Row: {
          id: string
          vulnerability_id: string
          user_id: string
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          vulnerability_id: string
          user_id: string
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          vulnerability_id?: string
          user_id?: string
          comment?: string
          created_at?: string
        }
      }
      ai_chat_sessions: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          title: string | null
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          title?: string | null
          messages?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          title?: string | null
          messages?: Json
          created_at?: string
          updated_at?: string
        }
      }
      threat_intelligence: {
        Row: {
          id: string
          organization_id: string | null
          threat_type: string
          title: string
          description: string | null
          severity: "Critical" | "High" | "Medium" | "Low" | "Info" | null
          indicators: Json
          mitigation_steps: string | null
          source: string | null
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          threat_type: string
          title: string
          description?: string | null
          severity?: "Critical" | "High" | "Medium" | "Low" | "Info" | null
          indicators?: Json
          mitigation_steps?: string | null
          source?: string | null
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          threat_type?: string
          title?: string
          description?: string | null
          severity?: "Critical" | "High" | "Medium" | "Low" | "Info" | null
          indicators?: Json
          mitigation_steps?: string | null
          source?: string | null
          published_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      calculate_security_score: {
        Args: {
          org_id: string
        }
        Returns: number
      }
    }
    Enums: {
      vulnerability_severity: "Critical" | "High" | "Medium" | "Low" | "Info"
      scan_status: "pending" | "running" | "completed" | "failed"
      scan_type: "web_application" | "network" | "cloud" | "database" | "mobile"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
