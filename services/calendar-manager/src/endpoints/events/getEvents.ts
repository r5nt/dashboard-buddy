import pool from '@dashboard-buddy/database';

import type { CalendarEvent } from '@dashboard-buddy/types';
import type { FastifyReply } from 'fastify';

export const getEvents = async (reply: FastifyReply) => {
    let client;
    try {
        client = await pool.connect();

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

        const result = await client.query<CalendarEvent>(sql);

        if (!result.rows.length) {
            reply.send([]);
            return;
        }

        reply.send(result.rows);
    } catch (error) {
        console.error({ error });
        reply.code(500).send(error);
        return;
    } finally {
        if (client) {
            client.release();
        }
    }
};