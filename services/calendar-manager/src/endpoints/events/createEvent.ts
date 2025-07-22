import type { PoolClient, QueryResult } from 'pg';
import { randomUUID } from 'node:crypto';

import { HttpError } from '@dashboard-buddy/error-handlers/api';

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { CalendarEvent, CreateEventRoute } from '@dashboard-buddy/types/calendar'

export const createEvent = async (
    request: FastifyRequest<CreateEventRoute>, 
    reply: FastifyReply
) => {
    let client: PoolClient | undefined;

    try {
        client = await request.server.pg.connect();

        const {
            body: {
                title,
                location,
                startTime,
                endTime
            }
        } = request;

        const eventId = randomUUID();
        const userId = randomUUID(); // TODO: When user table is made, pull this from session

        const sql = `
            INSERT INTO
                calendar.events (event_id, user_id, title, location, start_time, end_time)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [ eventId, userId, title, location, startTime, endTime ];
            
        const result: QueryResult<CalendarEvent> = await client.query<CalendarEvent>(sql, values);

        if (result.rowCount !== 1) {
            throw new HttpError(500, 'Failed to create the event resource.');
        }

        reply.code(201).send(result.rows[0]);
    } catch(error) {
        request.log.error(error, 'Failed to get calendar events');
        reply.status(500).send({ message: 'Internal Server Error' });
    } finally {
        if (client) {
            client.release();
        }
    }
};