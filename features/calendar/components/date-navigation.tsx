"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateHeader, getToday } from "../utils";

type DateNavigationProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  mode: "day" | "week" | "month";
};

export function DateNavigation({
  currentDate,
  onDateChange,
  onPrevious,
  onNext,
  mode,
}: DateNavigationProps) {
  const handleToday = () => {
    onDateChange(getToday());
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-2xl font-bold capitalize flex-1 truncate">
        {formatDateHeader(currentDate, mode)}
      </h2>

      <div className="flex items-center gap-1 shrink-0">
        <Button variant="outline" size="sm" onClick={handleToday}>
          Heute
        </Button>
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
