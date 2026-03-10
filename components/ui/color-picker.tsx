"use client";

import { brandTokens } from "@/lib/design/tokens";
import type { EventColorId } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type ColorPickerProps = {
  value: EventColorId;
  onChange: (color: EventColorId) => void;
  name?: string;
};

export function ColorPicker({ value, onChange, name = "color" }: ColorPickerProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {brandTokens.eventColors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color.id as EventColorId)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105",
              value === color.id
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/50"
            )}
            aria-label={`Farbe: ${color.name}`}
            aria-pressed={value === color.id}
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full border-2"
                style={{
                  backgroundColor: color.hex,
                  borderColor: color.border,
                }}
              />
              {value === color.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white drop-shadow-md" strokeWidth={3} />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {color.name}
            </span>
          </button>
        ))}
      </div>
      
      {/* Hidden input for FormData submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
