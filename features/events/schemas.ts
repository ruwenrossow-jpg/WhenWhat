import { z } from "zod";

const recurrenceSchema = z.object({
  recurrence_type: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
  recurrence_interval: z.coerce.number().int().min(1).max(12).default(1),
  recurrence_until: z.string().optional().or(z.literal("")),
  recurrence_days: z.array(z.coerce.number().int().min(1).max(7)).optional(),
});

// Helper to convert datetime-local input to ISO string
const datetimeLocalToISO = (value: string) => {
  // datetime-local format: "2024-03-10T14:30"
  // We need to convert to full ISO: "2024-03-10T14:30:00.000Z"
  if (!value) {
    throw new Error("DateTime-Wert ist erforderlich");
  }
  
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    throw new Error("Ung\u00fcltiges DateTime-Format");
  }
  
  return date.toISOString();
};

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Titel ist erforderlich")
    .max(200, "Titel darf maximal 200 Zeichen lang sein"),
  description: z.string().optional(),
  start_time: z.string().min(1, "Startzeit ist erforderlich").transform(datetimeLocalToISO),
  end_time: z.string().min(1, "Endzeit ist erforderlich").transform(datetimeLocalToISO),
  color: z.enum(['primary', 'secondary', 'tertiary', 'accent', 'dark', 'light']).default('primary'),
}).merge(recurrenceSchema)
.superRefine((data, ctx) => {
  if (data.recurrence_type === "weekly" && (!data.recurrence_days || data.recurrence_days.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["recurrence_days"],
      message: "Wähle mindestens einen Wochentag für wöchentliche Termine",
    });
  }

  if (data.recurrence_type !== "none" && data.recurrence_until) {
    const untilDate = new Date(`${data.recurrence_until}T23:59:59.999Z`);
    if (Number.isNaN(untilDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrence_until"],
        message: "Ungültiges Enddatum für die Serie",
      });
      return;
    }

    if (untilDate < new Date(data.start_time)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrence_until"],
        message: "Serienende muss nach dem Startdatum liegen",
      });
    }
  }
});

export const createEventSchema = eventSchema.refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  {
    message: "Endzeitpunkt muss nach dem Startzeitpunkt liegen",
    path: ["end_time"],
  }
);

export const updateEventSchema = eventSchema
  .extend({
    id: z.string().uuid(),
    source_event_id: z.string().uuid().optional(),
    occurrence_date: z.string().optional(),
    edit_scope: z.enum(["single", "series"]).default("series"),
    _intent: z.enum(["save", "delete"]).default("save"),
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: "Endzeitpunkt muss nach dem Startzeitpunkt liegen",
    path: ["end_time"],
  });

export type EventInput = z.infer<typeof eventSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
