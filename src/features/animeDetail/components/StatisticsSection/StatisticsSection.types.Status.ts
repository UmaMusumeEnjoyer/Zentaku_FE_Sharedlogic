export interface StatusItem {
  status: string; // Ví dụ: 'PLANNING', 'CURRENT', ...
  amount: number;
}

export interface StatusDistributionProps {
  distribution: StatusItem[];
}

export interface StatusConfig {
  color: string;
  order: number;
}