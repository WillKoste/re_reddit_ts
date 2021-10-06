import path from 'path';
import {createConnection} from 'typeorm';
import {DB_TYPE, PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER} from './constants';
import {Post} from './entities/Post';
import {User} from './entities/User';

export const createTypeormConnection = async () => {
	const conn = await createConnection({
		type: DB_TYPE,
		database: PG_DATABASE,
		host: PG_HOST,
		port: PG_PORT,
		password: PG_PASSWORD,
		username: PG_USER,
		synchronize: true,
		migrations: [path.join(__dirname, 'migrations', '*')],
		entities: [User, Post]
	});
	await conn.runMigrations();
};
