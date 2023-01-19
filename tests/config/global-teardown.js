require('dotenv').config();
process.env["NODE_CONFIG_DIR"] = require('path').join(__dirname, '../../src/config');
const config = require('config');

const { knexSnakeCaseMappers } = require('objection');
const Knex = require('knex');

const database = process.env.TEST_DB_NAME;
const knex = Knex({
    client: 'mysql2',
    connection: {
        host: config.get('database.host'),
        port: config.get('database.port'),
        user: config.get('database.user'),
        password: config.get('database.password'),
        database: config.get('database.test_name'),
    },
    pool: { min: 0, max: 7 },
    ...knexSnakeCaseMappers(),
});

module.exports = async () => {
    try {
        await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        knex.destroy();
        process.exit(1);
    }
};
