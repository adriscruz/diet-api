import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

export async function metricsMealsRoutes(app: FastifyInstance) {
    app.get('/', {
        preHandler: [checkSessionIdExists],
    } ,async () => {
        const totMeals = await knex('meals').count('id');
        const totMealsOffDiet = await knex('meals').count('id').where({type: 'off diet'});
        const totMealsWithinDiet = await knex('meals').count('id').where({type: 'within diet'});
        const bestMealList = await knex('meals').select('name').where({type: 'within diet'}).orderBy('rating', 'desc');

        return {
            totMeals: `Você tem ${totMeals[0]['count(`id`)']} refeições cadastradas.`,
            totMealsOffDiet: `Você tem ${totMealsOffDiet[0]['count(`id`)']} refeições fora da dieta.`,
            totMealsWithinDiet: `Você tem ${totMealsWithinDiet[0]['count(`id`)']} refeições dentro da dieta.`,
            bestMealList: `Suas melhores refeições são: ${bestMealList.map(meal => meal.name).join(', ')}.`,
        }
    })
}