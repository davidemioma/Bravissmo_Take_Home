"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ListInputProps {
  values: string[];
  setValues: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled: boolean;
}

const ListInput = ({
  values,
  setValues,
  placeholder,
  label,
  disabled,
}: ListInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;

    const hasValue = values.find(
      (value) => value.toLowerCase() === inputValue.toLowerCase()
    );

    if (hasValue) {
      toast.error("Value already exists!");

      return;
    }

    setValues([...values, inputValue.trim()]);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleAdd();
    }
  };

  const handleDelete = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button
          className="bg-violet-400 hover:bg-violet-500"
          type="button"
          onClick={handleAdd}
          disabled={disabled}
        >
          Add
        </Button>
      </div>

      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <li
              key={index}
              className="w-fit flex items-center justify-between py-1 px-2 bg-gray-50 rounded-md"
            >
              <span className="text-xs">{value}</span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListInput;
