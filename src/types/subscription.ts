export interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan_name: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancel_at: string | null;
  canceled_at: string | null;
  stripe_customer_id: string;
  created_at: string;
  updated_at: string;
} 