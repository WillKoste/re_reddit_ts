import path from 'path';
import {createConnection} from 'typeorm';
import {DB_TYPE} from './constants';
import {Post} from './entities/Post';
import {Upvote} from './entities/Upvote';
import {User} from './entities/User';

export const createTypeormConnection = async () => {
	const conn = await createConnection({
		type: DB_TYPE,
		url: process.env.DATABASE_URL,
		synchronize: true,
		migrations: [path.join(__dirname, 'migrations', '*')],
		entities: [User, Post, Upvote]
	});
	await conn.runMigrations();
};
