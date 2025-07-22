import { z } from 'zod';
import type { RouteGenericInterface } from 'fastify';

const _ApiResponseSchema = z.object({
    success: z.boolean()
});

export type ApiResponse = z.infer<typeof _ApiResponseSchema>;

const CalendarEventSchema = z.object({
    event_id: z.uuid({ version: 'v4' }),
    title: z.string().max(255),
    location: z.string().max(255).nullable(),
    start_time: z.iso.datetime({ offset: true }),
    end_time: z.iso.datetime({ offset: true })
}).transform((data) => ({
  eventId: data.event_id,
  title: data.title,
  location: data.location,
  startTime: data.start_time,
  endTime: data.end_time,
}))

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

export const CalendarEventsArraySchema = z.array(CalendarEventSchema)

export type CalendarEvents = z.infer<typeof CalendarEventsArraySchema>;

export const CreateEventBodySchema = z.object({
  title: z.string().max(255),
  location: z.string().max(255).nullable(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime()
});

export type CreateEventBody = z.infer<typeof CreateEventBodySchema>;

export interface CreateEventRoute extends RouteGenericInterface {
  Body: CreateEventBody
};