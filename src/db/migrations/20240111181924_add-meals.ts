import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary().index();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.enum('type', ['off diet', 'within diet']).notNullable();
        table.uuid('user_id').references('id').inTable('user').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals');
}

