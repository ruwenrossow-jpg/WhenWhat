"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { calendarConstants } from "@/lib/design/constants";
import { brandTokens } from "@/lib/design/tokens";

type FloatingActionButtonProps = {
  onClick: () => void;
};

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="fixed rounded-full shadow-lg z-30 sm:bottom-6"
      style={{ 
        bottom: calendarConstants.layout.fabBottomMobile,
        right: calendarConstants.layout.fabRight,
        width: brandTokens.sizes.fab.width,
        height: brandTokens.sizes.fab.height,
      }}
    >
      <Icon name="add" size="lg" />
      <span className="sr-only">Neues Event erstellen</span>
    </Button>
  );
}
