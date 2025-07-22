import Fastify from 'fastify';
import fastifyProxy from '@fastify/http-proxy';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';


import type { ApiResponse } from '@dashboard-buddy/types';

const server = Fastify({ logger: true });

const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    server.register(fastifyStatic, {
        root: path.join(__dirname, '..', '..', 'client', 'dist'),
    });
    server.setNotFoundHandler((_req, reply) => {
        reply.sendFile('index.html');
    });
}

void server.register(fastifyProxy, {
    upstream: 'http://localhost:3002',
    prefix: '/api/calendar'
});

void server.get('/api/health', (_, reply) => {
    const response: ApiResponse = { success: true }
    reply.code(200).send(response);
    return;
});

void (async () => {
    try {
        await server.listen({
            host: '0.0.0.0',
            port: PORT
        });
        console.log(`Server listening on port ${PORT.toString()}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();