import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.dropColumn('user_id')
        table.uuid('user_session_id').references('session_id').inTable('user').notNullable().after('type'); 
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.dropColumn('user_session_id')
        table.uuid('user_id').references('id').inTable('user').notNullable().after('type'); 
    })
}

