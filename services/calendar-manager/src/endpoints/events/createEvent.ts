import { randomUUID } from 'node:crypto';

import pool from '@dashboard-buddy/database';

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { CalendarEvent, CreateEventRoute } from '@dashboard-buddy/types'

export const createEvent = async (
    request: FastifyRequest<CreateEventRoute>, 
    reply: FastifyReply
) => {
    let client;
    try {
        const {
            body: {
                title,
                location,
                startTime,
                endTime
            }
        } = request;

        const eventId = randomUUID();
        const userId = randomUUID();  // When user table is made, pull this from session

        client = await pool.connect();

        const sql = `
            INSERT INTO
                calendar.events
                (
                    event_id,
                    user_id,
                    title,
                    location,
                    start_time,
                    end_time
                )
            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
        `;

        const values = [ eventId, userId, title, location, startTime, endTime ];

        const result = await client.query<CalendarEvent>(sql, values);

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