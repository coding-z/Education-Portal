export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ENROLMENT: {
        Row: {
          STUDENT_ID: string
          UNIT_ID: string
        }
        Insert: {
          STUDENT_ID?: string
          UNIT_ID?: string
        }
        Update: {
          STUDENT_ID?: string
          UNIT_ID?: string
        }
        Relationships: [
          {
            foreignKeyName: "ENROLMENT_STUDENT_ID_fkey"
            columns: ["STUDENT_ID"]
            isOneToOne: false
            referencedRelation: "STUDENT"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "ENROLMENT_UNIT_ID_fkey"
            columns: ["UNIT_ID"]
            isOneToOne: false
            referencedRelation: "UNIT"
            referencedColumns: ["ID"]
          },
        ]
      }
      PRIVILEGE: {
        Row: {
          LEVEL: string
        }
        Insert: {
          LEVEL: string
        }
        Update: {
          LEVEL?: string
        }
        Relationships: []
      }
      SIGNUP_CODE: {
        Row: {
          VALUE: string
        }
        Insert: {
          VALUE: string
        }
        Update: {
          VALUE?: string
        }
        Relationships: []
      }
      STUDENT: {
        Row: {
          ID: string
        }
        Insert: {
          ID?: string
        }
        Update: {
          ID?: string
        }
        Relationships: [
          {
            foreignKeyName: "STUDENT_ID_fkey"
            columns: ["ID"]
            isOneToOne: true
            referencedRelation: "USER"
            referencedColumns: ["ID"]
          },
        ]
      }
      TEACHER: {
        Row: {
          ID: string
        }
        Insert: {
          ID?: string
        }
        Update: {
          ID?: string
        }
        Relationships: [
          {
            foreignKeyName: "TEACHER_ID_fkey"
            columns: ["ID"]
            isOneToOne: true
            referencedRelation: "USER"
            referencedColumns: ["ID"]
          },
        ]
      }
      TEACHER_ROLE: {
        Row: {
          TEACHER_ID: string
          UNIT_ID: string
        }
        Insert: {
          TEACHER_ID?: string
          UNIT_ID?: string
        }
        Update: {
          TEACHER_ID?: string
          UNIT_ID?: string
        }
        Relationships: [
          {
            foreignKeyName: "TEACHER_ROLE_TEACHER_ID_fkey"
            columns: ["TEACHER_ID"]
            isOneToOne: false
            referencedRelation: "TEACHER"
            referencedColumns: ["ID"]
          },
          {
            foreignKeyName: "TEACHER_ROLE_UNIT_ID_fkey"
            columns: ["UNIT_ID"]
            isOneToOne: false
            referencedRelation: "UNIT"
            referencedColumns: ["ID"]
          },
        ]
      }
      UNIT: {
        Row: {
          CODE: string
          ID: string
          NAME: string
        }
        Insert: {
          CODE: string
          ID?: string
          NAME: string
        }
        Update: {
          CODE?: string
          ID?: string
          NAME?: string
        }
        Relationships: []
      }
      USER: {
        Row: {
          EMAIL: string
          ID: string
          PRIVILEGE: string
          USERNAME: string
        }
        Insert: {
          EMAIL: string
          ID?: string
          PRIVILEGE: string
          USERNAME: string
        }
        Update: {
          EMAIL?: string
          ID?: string
          PRIVILEGE?: string
          USERNAME?: string
        }
        Relationships: [
          {
            foreignKeyName: "USER_PRIVILEGE_fkey"
            columns: ["PRIVILEGE"]
            isOneToOne: false
            referencedRelation: "PRIVILEGE"
            referencedColumns: ["LEVEL"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
