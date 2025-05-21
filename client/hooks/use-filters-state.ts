import { create } from "zustand";
import { ProductCustomType } from "@/lib/validators/product";
import { persist, createJSONStorage } from "zustand/middleware";

export type FiltersState = {
  query: string;
  type: ProductCustomType | "any";
  minPrice: string;
  maxPrice: string;
  maxFilterPrice: number;
  isCustom: boolean;
  range: number[];
};

type Props = {
  filters: FiltersState;
  setFilters: (values: Partial<FiltersState>) => void;
};

export const initialFiltersState: FiltersState = {
  query: "",
  type: "any",
  maxPrice: "",
  minPrice: "",
  maxFilterPrice: 200,
  isCustom: false,
  range: [0, 500],
};

const useFiltersState = create<Props>()(
  persist(
    (set) => ({
      filters: initialFiltersState,
      setFilters: (values: Partial<FiltersState>) =>
        set((state) => ({
          filters: { ...state.filters, ...values },
        })),
    }),
    {
      name: "bravissmo-filters-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFiltersState;
