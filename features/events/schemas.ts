import { z } from "zod";

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
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: "Endzeitpunkt muss nach dem Startzeitpunkt liegen",
    path: ["end_time"],
  });

export type EventInput = z.infer<typeof eventSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
