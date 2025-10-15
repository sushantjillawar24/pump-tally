export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          product_name: string;
          price: number;
          quantity: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          product_name: string;
          price: number;
          quantity: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          product_name?: string;
          price?: number;
          quantity?: number;
          total?: number;
          created_at?: string;
        };
      };
      earnings: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mode_name: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          mode_name: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          mode_name?: string;
          amount?: number;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          item_name: string;
          price: number;
          quantity: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          item_name: string;
          price: number;
          quantity: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          item_name?: string;
          price?: number;
          quantity?: number;
          total?: number;
          created_at?: string;
        };
      };
      employee_cash: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          type: 'short' | 'borrow' | 'received' | 'reward';
          person_name: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          type: 'short' | 'borrow' | 'received' | 'reward';
          person_name: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          type?: 'short' | 'borrow' | 'received' | 'reward';
          person_name?: string;
          amount?: number;
          created_at?: string;
        };
      };
      unpaid_amounts: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          person_name: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          person_name: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          person_name?: string;
          amount?: number;
          created_at?: string;
        };
      };
      readings: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          fuel_type: 'petrol' | 'powerPetrol' | 'diesel';
          nozzle: string;
          reading1: number;
          reading2: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          fuel_type: 'petrol' | 'powerPetrol' | 'diesel';
          nozzle: string;
          reading1: number;
          reading2: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          fuel_type?: 'petrol' | 'powerPetrol' | 'diesel';
          nozzle?: string;
          reading1?: number;
          reading2?: number;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}
