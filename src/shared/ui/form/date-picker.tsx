"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  id?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  disableFuture?: boolean;
  className?: string;
};

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled = false,
  invalid = false,
  disableFuture = false,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid}
            data-empty={!value}
            className={cn(
              "w-full justify-start text-left font-normal",
              "data-[empty=true]:text-muted-foreground",
              className
            )}
          />
        }
      >
        <CalendarIcon />

        {value ? (
          format(value, "dd/MM/yyyy", {
            locale: vi,
          })
        ) : (
          <span>{placeholder}</span>
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={
            disableFuture
              ? {
                  after: new Date(),
                }
              : undefined
          }
        />
      </PopoverContent>
    </Popover>
  );
}
