import 'reflect-metadata';
import 'colors';
// import path from 'path';
// import fs from 'fs';
// import https from 'https';
import {MikroORM} from '@mikro-orm/core';
import {__prod__, COOKIE_NAME, PORT, NODE_ENV, SESSION_SECRET, REDIS_PORT} from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

const main = async () => {
	try {
		const orm = await MikroORM.init(microConfig);
		await orm.getMigrator().up();
		const app = express();
		const RedisStore = connectRedis(session);
		const redis = new Redis();
		redis.connect(() => console.log(`Redis server running on port ${REDIS_PORT}`.magenta.bold));

		app.use(cors({origin: ['*', 'http://localhost:3000'], credentials: true}));
		app.use(
			session({
				name: COOKIE_NAME,
				secret: SESSION_SECRET,
				store: new RedisStore({client: redis, disableTouch: true}),
				cookie: {
					maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
					secure: true,
					sameSite: 'none'
				},
				saveUninitialized: false,
				resave: false
			})
		);

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [HelloResolver, PostResolver, UserResolver],
				validate: false
			}),
			context: ({req, res}) => ({em: orm.em, req, res, redis})
		});

		await apolloServer.start();
		apolloServer.applyMiddleware({app, cors: false});

		const port = PORT || 5001;
		const mode = NODE_ENV || 'DEFAULT';

		app.listen(port, () => {
			console.log(`Express server running on port ${port}, in ${mode} mode!`.cyan.underline.bold);
		});
	} catch (err) {
		console.error(err);
	}
};

main();
