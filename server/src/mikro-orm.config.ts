import {Post} from './entities/Post';
import {DATABASE_TYPE, PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER} from './constants';
import {MikroORM} from '@mikro-orm/core';
import path from 'path';
import {User} from './entities/User';

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/
	},
	entities: [Post, User],
	password: PG_PASSWORD,
	dbName: PG_DATABASE,
	host: PG_HOST,
	port: PG_PORT,
	user: PG_USER,
	type: DATABASE_TYPE
} as Parameters<typeof MikroORM.init>[0];
