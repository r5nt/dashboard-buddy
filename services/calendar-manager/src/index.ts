import Fastify from 'fastify';

import { getEvents } from './endpoints/events/getEvents.js';

const server = Fastify({ logger: true });
const PORT = 3002;

server.get('/events', (_, reply) => { void getEvents(reply); });

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