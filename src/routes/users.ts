import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";


export async function usersRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const users = await knex('user').select('*');

        return users;
    })

    app.post('/', async (request, reply) => {
        const createUserSchema = z.object({
            username: z.string(),
        })

        let { session_id } = request.cookies

        if (!session_id) {
            session_id = randomUUID();

            reply.setCookie('session_id', session_id, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })
        }

        const { username } = createUserSchema.parse(request.body);

        await knex('user').insert({
            id: randomUUID(),
            username,
            session_id: session_id,
        });

        return reply.status(201).send('Usuário criado com sucesso!');
    })

    app.delete('/:id', async (request, reply) => {
        const getUserParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getUserParamsSchema.parse(request.params);

        await knex('user').where({id}).del();

        return reply.status(204).send();
    })
}