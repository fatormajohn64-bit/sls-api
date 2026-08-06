import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable().unique();
    table.jsonb('permissions').notNullable().defaultTo('{}');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.uuid('role_id').references('id').inTable('roles').onDelete('RESTRICT');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('2fa_enabled').notNullable().defaultTo(false);
    table.string('2fa_secret').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('system_settings', (table) => {
    table.string('key').primary();
    table.jsonb('value').notNullable();
    table.string('description').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('system_settings');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('roles');
}
