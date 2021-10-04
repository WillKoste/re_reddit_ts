import {createClient, dedupExchange, fetchExchange} from 'urql';
import {cacheExchange} from '@urql/exchange-graphcache';
import {betterUpdateQuery} from '../utils/betterUpdateQuery';
import {LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation} from '../generated/graphql';

export const client = createClient({
	url: `https://127.0.0.1:5000/graphql`,
	fetchOptions: {credentials: 'include'},
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					login: (_result, args, cache, info) => {
						betterUpdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
							if (result.login?.errors) {
								return query;
							} else {
								return {
									me: result.login?.user
								};
							}
						});
					},
					register: (_result, args, cache, info) => {
						betterUpdateQuery<RegisterMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
							if (result.register?.errors) {
								return query;
							} else {
								return {
									me: result.register?.user
								};
							}
						});
					},
					logout: (_result, args, cache, info) => {
						betterUpdateQuery<LogoutMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => ({me: null}));
					}
				}
			}
		}),
		fetchExchange
	]
});
