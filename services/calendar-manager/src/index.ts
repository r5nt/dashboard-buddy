import Fastify from 'fastify';
import { type ZodTypeProvider, validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';

import { CreateEventBodySchema, type CreateEventRoute } from '@dashboard-buddy/types/calendar';

import { createEvent } from './endpoints/events/createEvent.js';
import { getEvents } from './endpoints/events/getEvents.js';

const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
server.setValidatorCompiler(validatorCompiler);
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
server.setSerializerCompiler(serializerCompiler);

const PORT = 3002;

server.get('/events', (_, reply) => { void getEvents(reply); });
server.post<CreateEventRoute>(
    '/events',
    {
        schema: {
            body: CreateEventBodySchema
        }
    },
    createEvent
);

void (async () => {
    try {
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