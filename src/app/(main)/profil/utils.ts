import type { Lot } from "@/src/components/ui/cards/LotCard";
import type { CollectItem } from "./actions";

export function toLot(item: CollectItem): Lot {
  return { id_lot: item.id_lot, ...item.lot } as Lot;
}
