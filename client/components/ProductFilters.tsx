"use client";

import React from "react";
import { Input } from "./ui/input";
import { cn, generatePriceRanges } from "@/lib/utils";
import useFiltersState from "@/hooks/use-filters-state";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductTypeEnum, ProductCustomType } from "@/lib/validators/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  disabled: boolean;
};

const ProductFilters = ({ disabled }: Props) => {
  const { filters, setFilters } = useFiltersState();

  const priceRanges = generatePriceRanges({
    maxPrice: filters.maxFilterPrice || 200,
    step: 20,
  });

  return (
    <div className="w-full md:sticky md:top-20 md:w-[300px] md:h-[80vh] md:overflow-y-auto md:no-scrollbar">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-semibold text-lg hover:no-underline">
            Product Type
          </AccordionTrigger>

          <AccordionContent>
            <ToggleGroup
              type="single"
              className="grid justify-start text-start disabled:cursor-not-allowed"
              value={filters.type}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  type: value as ProductCustomType,
                })
              }
              disabled={disabled}
            >
              <ToggleGroupItem
                className={cn(
                  "flex justify-start disabled:cursor-not-allowed",
                  filters.type === "any"
                    ? "text-black font-medium"
                    : "text-muted-foreground"
                )}
                value={"any"}
                disabled={disabled}
              >
                Any
              </ToggleGroupItem>

              {Object.values(ProductTypeEnum.enum).map((type) => (
                <ToggleGroupItem
                  key={type}
                  className={cn(
                    "flex justify-start disabled:cursor-not-allowed",
                    filters.type === type
                      ? "text-black font-medium"
                      : "text-muted-foreground"
                  )}
                  value={type as ProductCustomType}
                  disabled={disabled}
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="font-semibold text-lg hover:no-underline">
            Price
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-1">
              {priceRanges.map((range, i) => (
                <li key={range.label} className="flex items-center gap-3">
                  <Input
                    type="radio"
                    className="h-4 w-4 rounded border-gray-300 \"
                    id={`price-${i}`}
                    disabled={disabled}
                    onChange={() => {
                      setFilters({
                        ...filters,
                        isCustom: false,
                        range: [...range.value],
                      });
                    }}
                    checked={
                      !filters.isCustom &&
                      filters.range &&
                      filters.range[0] === range.value[0] &&
                      filters.range[1] === range.value[1]
                    }
                  />

                  <label
                    htmlFor={`price-${i}`}
                    className="text-sm text-gray-600"
                  >
                    {range.label}
                  </label>
                </li>
              ))}

              <li className="flex items-center gap-3">
                <Input
                  type="radio"
                  className="h-4 w-4 rounded border-gray-300 \"
                  id="price-custom"
                  disabled={disabled}
                  onChange={() => {
                    setFilters({
                      ...filters,
                      isCustom: true,
                      range: [0, 100],
                    });
                  }}
                  checked={filters.isCustom}
                />

                <label htmlFor="price-custom" className="text-sm text-gray-600">
                  Custom
                </label>
              </li>

              {filters.isCustom && (
                <div className="mt-4 pl-2 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-16"
                      type="number"
                      value={filters.range[0]}
                      placeholder="Min (£)"
                      max={filters.range[1]}
                      step={2}
                      disabled={disabled}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          isCustom: true,
                          range: [e.target.valueAsNumber, filters.range[1]],
                        })
                      }
                    />

                    <Input
                      className="w-16"
                      type="number"
                      value={filters.range[1]}
                      min={filters.range[0]}
                      step={2}
                      disabled={disabled}
                      placeholder="Max (£)"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          isCustom: true,
                          range: [filters.range[0], e.target.valueAsNumber],
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
