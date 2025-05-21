"use client";

import React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import useFiltersState from "@/hooks/use-filters-state";

const SearchBar = () => {
  const { filters, setFilters } = useFiltersState();

  return (
    <form
      onSubmit={() => {}}
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
