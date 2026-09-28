import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co"
);

// Initialize Supabase Client
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Helper database services
export const supabaseService = {
  // Fetch approved transport lines
  async getLines() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("transport_lines")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase getLines error:", error.message);
      return null;
    }
    return data;
  },

  // Insert a new transport line
  async createLine(lineData: Record<string, unknown>) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("transport_lines")
      .insert([lineData])
      .select()
      .single();

    if (error) {
      console.warn("Supabase createLine error:", error.message);
      return null;
    }
    return data;
  },

  // Update line seats available
  async updateLineSeats(lineId: string, seats: number) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("transport_lines")
      .update({ seats_available: seats })
      .eq("id", lineId)
      .select()
      .single();

    if (error) {
      console.warn("Supabase updateLineSeats error:", error.message);
      return null;
    }
    return data;
  },

  // Save coverage request
  async submitCoverageRequest(reqData: Record<string, unknown>) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("coverage_requests")
      .insert([reqData])
      .select()
      .single();

    if (error) {
      console.warn("Supabase submitCoverageRequest error:", error.message);
      return null;
    }
    return data;
  },

  // Send in-app message
  async sendMessage(msgData: Record<string, unknown>) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("messages")
      .insert([msgData])
      .select()
      .single();

    if (error) {
      console.warn("Supabase sendMessage error:", error.message);
      return null;
    }
    return data;
  },

  // Fetch messages between student and driver
  async getMessages(conversationId?: string) {
    if (!isSupabaseConfigured) return null;
    let query = supabase.from("messages").select("*").order("created_at", { ascending: true });
    if (conversationId) {
      query = query.eq("conversation_id", conversationId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Supabase getMessages error:", error.message);
      return null;
    }
    return data;
  },
};
