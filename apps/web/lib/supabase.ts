import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          language: string;
          lesson_id: string;
          completed: boolean;
          score: number;
          completed_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_progress"]["Row"], "id" | "completed_at">;
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
      };
    };
  };
};
