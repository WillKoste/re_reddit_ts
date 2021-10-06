import {createClient, dedupExchange, fetchExchange, stringifyVariables} from 'urql';
import {cacheExchange, Resolver} from '@urql/exchange-graphcache';
import {betterUpdateQuery} from '../utils/betterUpdateQuery';
import {ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation} from '../generated/graphql';

const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const {parentKey: entityKey, fieldName} = info;
		const allFields = cache.inspectFields(entityKey);
		const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}
		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
		const isItInCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, 'posts');
		info.partial = !isItInCache;
		let hasMore = true;
		const results: string[] = [];
		fieldInfos.forEach((info) => {
			const key = cache.resolve(entityKey, info.fieldKey) as string;
			const data = cache.resolve(key, 'posts') as string[];
			const _hasMore = cache.resolve(key, 'hasMore');
			if (!_hasMore) {
				hasMore = _hasMore as boolean;
			}
			results.push(...data);
		});
		return {
			__typename: 'PaginatedPosts',
			hasMore,
			posts: results
		};
	};
};

export const client = createClient({
	url: `https://127.0.0.1:5000/graphql`,
	fetchOptions: {credentials: 'include'},
	exchanges: [
		dedupExchange,
		cacheExchange({
			keys: {
				PaginatedPosts: () => null
			},
			resolvers: {
				Query: {
					posts: cursorPagination()
				}
			},
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
					},
					changePassword: (_result, args, cache, info) => {
						betterUpdateQuery<ChangePasswordMutation, MeQuery>(cache, {query: MeDocument}, _result, (result, query) => {
							if (result.changePassword.errors) {
								return query;
							} else {
								return {
									me: result.changePassword.user
								};
							}
						});
					}
					// createPost: (_result, args, cache, info) => {
					// 	betterUpdateQuery<CreatePostMutation, PostsQuery>(cache, {query: PostsDocument}, _result, (result, query) => {
					// 		return {
					// 			posts: result.createPost
					// 		};
					// 	});
					// }
				}
			}
		}),
		fetchExchange
	]
});
