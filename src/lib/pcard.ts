export type PcardSummary = {
  id: string;
  date: string;
  who: string;
  card: string;
  vendor: string;
  amount: string;
  coding: string;
  thumb: string | null;
  updatedAt: string;
};

export type PcardRecord = PcardSummary & {
  description: string;
  supervisor: string;
  image: string | null;
};
