import type { PoolClient, QueryResult } from 'pg';
import type { FastifyRequest, FastifyReply } from 'fastify';

import type { CalendarEvent } from '@dashboard-buddy/types/calendar';

export const getEvents = async (request: FastifyRequest, reply: FastifyReply) => {
    let client: PoolClient | undefined;

    try {
        client = await request.server.pg.connect();

        const sql = `
            SELECT
                event_id,
                title,
                location,
                start_time,
                end_time
            FROM
                calendar.events
        `;

        const result: QueryResult<CalendarEvent> = await client.query<CalendarEvent>(sql);
        reply.send(result.rows);
    } catch(error) {
        request.log.error(error, 'Failed to get calendar events');
        reply.status(500).send({ message: 'Internal Server Error' });
    } finally {
        if (client) {
            client.release();
        }
    }
};