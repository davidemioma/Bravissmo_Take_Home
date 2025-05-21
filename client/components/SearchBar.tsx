"use client";

import React from "react";
import { cleanParams } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import useFiltersState, { FiltersState } from "@/hooks/use-filters-state";

const SearchBar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const { filters, setFilters } = useFiltersState();

  const updateUrl = (filters: FiltersState) => {
    const cleanFilters = cleanParams(filters);

    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUrl(filters);
  };

  if (pathname !== "/") return null;

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl mx-auto h-8 bg-background flex gap-3 border border-input px-3 py-2 rounded-md text-sm ring-offset-background "
    >
      <input
        className="w-full flex-1 outline-none"
        placeholder="Search..."
        value={filters.query}
        onChange={(e) => {
          setFilters({
            ...filters,
            query: e.target.value,
          });
        }}
      />

      {filters.query.trim() && (
        <button
          type="button"
          className="flex items-center justify-center"
          onClick={() => {
            setFilters({
              ...filters,
              query: "",
            });
          }}
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}

      <button type="submit" className="flex items-center justify-center">
        <SearchIcon className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;
