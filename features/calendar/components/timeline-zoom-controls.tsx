"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type TimelineZoomControlsProps = {
  label: string;
  onZoomOut: () => void;
  onZoomIn: () => void;
  canZoomOut: boolean;
  canZoomIn: boolean;
};

export function TimelineZoomControls({
  label,
  onZoomOut,
  onZoomIn,
  canZoomOut,
  canZoomIn,
}: TimelineZoomControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-full border bg-card/90 px-3 py-2 shadow-sm backdrop-blur-sm">
      <span className="text-xs font-medium text-muted-foreground">Zoom: {label}</span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          className="calendar-interactive h-8 w-8 rounded-full"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          disabled={!canZoomIn}
          className="calendar-interactive h-8 w-8 rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}