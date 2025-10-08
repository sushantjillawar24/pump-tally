export interface Sale {
  id: string;
  user_id: string;
  date: string;
  ms_price: number;
  ms_quantity: number;
  ms_total: number;
  hsd_price: number;
  hsd_quantity: number;
  hsd_total: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  date: string;
  oil: number;
  wages: number;
  electric_bill: number;
  phone_bill: number;
  others: number;
  total_expenses: number;
  created_at: string;
  updated_at: string;
}

export interface Earning {
  id: string;
  user_id: string;
  date: string;
  cash: number;
  upi: number;
  card: number;
  credit: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface CashEntry {
  id: string;
  name: string;
  amount: number;
}

export interface EmployeeCash {
  id: string;
  user_id: string;
  date: string;
  short_entries: CashEntry[];
  borrow_entries: CashEntry[];
  received_entries: CashEntry[];
  reward_entries: CashEntry[];
  created_at: string;
  updated_at: string;
}

export interface Reading {
  id: string;
  user_id: string;
  date: string;
  ms_nozzle1_open: number;
  ms_nozzle1_close: number;
  ms_nozzle1_sale: number;
  ms_nozzle2_open: number;
  ms_nozzle2_close: number;
  ms_nozzle2_sale: number;
  hsd_nozzle1_open: number;
  hsd_nozzle1_close: number;
  hsd_nozzle1_sale: number;
  hsd_nozzle2_open: number;
  hsd_nozzle2_close: number;
  hsd_nozzle2_sale: number;
  created_at: string;
  updated_at: string;
}

export interface UnpaidAmount {
  id: string;
  user_id: string;
  date: string;
  previous_unpaid: number;
  today_unpaid: number;
  total_unpaid: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  date: string;
  content: string;
  created_at: string;
  updated_at: string;
}
