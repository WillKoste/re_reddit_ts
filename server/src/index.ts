import 'reflect-metadata';
import 'colors';
// import path from 'path';
// import fs from 'fs';
// import https from 'https';
import 'dotenv-safe/config';
import {__prod__} from './constants';
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
import {createTypeormConnection} from './typeormConfig';
import {createUserLoader} from './utils/createUserLoader';
import {createUpvoteLoader} from './utils/createUpvoteLoader';

const main = async () => {
	try {
		createTypeormConnection();
		const app = express();
		const RedisStore = connectRedis(session);
		const redis = new Redis(process.env.REDIS_URL);
		redis.connect(() => console.log(`Redis server running on port ${process.env.REDIS_PORT}`.magenta.bold));

		app.use(cors({origin: [process.env.CORS_ORIGIN], credentials: true}));
		app.use(
			session({
				name: process.env.COOKIE_NAME,
				secret: process.env.SESSION_SECRET,
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
			context: ({req, res}) => ({req, res, redis, userLoader: createUserLoader(), upvoteLoader: createUpvoteLoader()})
		});

		await apolloServer.start();
		apolloServer.applyMiddleware({app, cors: false});

		const port = process.env.PORT || 5001;
		const mode = process.env.NODE_ENV || 'DEFAULT';

		app.listen(port, () => {
			console.log(`Express server running on port ${port}, in ${mode} mode!`.cyan.underline.bold);
		});
	} catch (err) {
		console.error(err);
	}
};

main();
