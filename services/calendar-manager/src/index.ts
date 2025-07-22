import Fastify from 'fastify';
import { type ZodTypeProvider, validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import fastifyPostgres from '@fastify/postgres';

import { HttpError } from '@dashboard-buddy/error-handlers/api';
import { postgresOptions } from '@dashboard-buddy/database';
import { CreateEventBodySchema, type CreateEventRoute } from '@dashboard-buddy/types/calendar';

import { createEvent } from './endpoints/events/createEvent.js';
import { getEvents } from './endpoints/events/getEvents.js';

const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
server.setValidatorCompiler(validatorCompiler);
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, _, reply) => {
    if (error instanceof HttpError) {
        server.log.warn(`HttpError: ${error.statusCode.toString()} - ${error.message}`);
        reply.status(error.statusCode).send({ message: error.message });
        return;
    }

    if (error.validation) {
        server.log.warn('Validation error occurred');
        reply.status(400).send({ message: 'Validation Error', errors: error.validation });
        return;
    }

    server.log.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
});

const PORT = 3002;

void (async () => {
    try {
        await server.register(fastifyPostgres, postgresOptions);

        server.get('/events', getEvents);
        server.post<CreateEventRoute>(
            '/events',
            {
                schema: {
                    body: CreateEventBodySchema
                }
            },
            createEvent
        );

        await server.listen({
            host: '0.0.0.0',
            port: PORT
        });
        console.log(`Calendar Manager service listening on port ${PORT.toString()}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();