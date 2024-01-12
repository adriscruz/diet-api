import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
    const createMealsSchema = z.object({
            name: z.string(),
            description: z.string(),
            type: z.enum(['off diet', 'within diet']),
            rating: z.number().optional(),
            user_session_id: z.string().optional(),
    })

    const getMealsParamsSchema = z.object({
        id: z.string().uuid()
    });

    app.get('/',
    {
        preHandler: [checkSessionIdExists],
    } , async (request) => {
        const { session_id } = request.cookies;

        const meals = await knex('meals').select('*').where({user_session_id: session_id});

        return {meals};
    })

    app.get('/:id', async (request) => {
        const { id } = getMealsParamsSchema.parse(request.params);

        const meal = await knex('meals').select('*').where({id});

        return {meal};
    })

    app.post('/', async (request, reply) => {
        const { name, description, type, user_session_id, rating } = createMealsSchema.parse(request.body);

        const session_id = request.cookies.session_id;
        
        await knex('meals').insert({
            id: randomUUID(),
            name,
            description,
            type,
            rating,
            user_session_id: user_session_id || session_id,
        });

        return reply.status(201).send('Refeição criada com sucesso!');
    })

    app.put('/:id', async (request, reply) => {
        const { id } = getMealsParamsSchema.parse(request.params);
        const { name, description, type } = createMealsSchema.parse(request.body);

        await knex('meals').where({id}).update({
            name,
            description,
            type,
        });

        return reply.status(200).send('Refeição atualizada com sucesso!');        
    })

    app.delete('/:id', async (request, reply) => {
        const { id } = getMealsParamsSchema.parse(request.params);

        await knex('meals').where({id}).del();

        return reply.status(204).send('Refeição deletada com sucesso!');
    })

}

