"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock, FileText } from "lucide-react";
import type { Event } from "../queries";
import { useState } from "react";
import { deleteEvent } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EventCardProps = {
  event: Event;
  onEdit: () => void;
  onDeleted?: () => void;
};

export function EventCard({ event, onEdit, onDeleted }: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEvent(event.id);
    if (result.success) {
      setShowDeleteDialog(false);
      onDeleted?.();
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="bg-card border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </span>
        </div>

        {event.description && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="line-clamp-3">{event.description}</p>
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event löschen?</DialogTitle>
            <DialogDescription>
              Möchtest du &quot;{event.title}&quot; wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Löschen..." : "Löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
