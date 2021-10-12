import {createClient, dedupExchange, fetchExchange} from 'urql';
import {cacheExchange} from '@urql/exchange-graphcache';
import {betterUpdateQuery} from '../utils/betterUpdateQuery';
import {ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables} from '../generated/graphql';
import {cursorPagination} from './cursorPagination';
import gql from 'graphql-tag';

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
					},
					createPost: (_result, args, cache, info) => {
						const allFields = cache.inspectFields('Query');
						const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
						fieldInfos.forEach((fi) => {
							cache.invalidate('Query', 'posts', fi.arguments || {});
						});
					},
					vote: (_result, args, cache, info) => {
						const {postId, value} = args as VoteMutationVariables;
						const data = cache.readFragment(
							gql`
								fragment _ on Post {
									id
									points
								}
							`,
							{id: postId} as any
						);
						console.log({data, info});
						if (data) {
							const newPoints = data.points + value;
							cache.writeFragment(
								gql`
									fragment __ on Post {
										points
									}
								`,
								{id: postId, points: newPoints} as any
							);
						}
					}
				}
			}
		}),
		fetchExchange
	]
});
