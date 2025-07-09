export type Variables = {
  userId: string;
};

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  type: string;
  date: Date;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  status: string;
  invoiceUrl: string;
  createdAt: Date;
}

export interface BalanceResponse {
  id: string;
  userBalance: number;
  createdAt: Date;
}


