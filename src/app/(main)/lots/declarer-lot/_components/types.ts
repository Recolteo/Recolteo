export type Merchant = {
  id: number;
  name: string;
  adresse: string;
};

export type LotFormProps =
  | { mode: "commercant"; id: number; name: string; adresse: string }
  | { mode: "admin"; merchants: Merchant[] };
