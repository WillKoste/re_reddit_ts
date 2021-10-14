import {createClient, dedupExchange, fetchExchange} from 'urql';
import {cacheExchange} from '@urql/exchange-graphcache';
import {betterUpdateQuery} from '../utils/betterUpdateQuery';
import {ChangePasswordMutation, DeletePostMutationVariables, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables} from '../generated/graphql';
import {cursorPagination} from './cursorPagination';
import gql from 'graphql-tag';
import {invalidateAllPosts} from './invalidateAllPosts';

export const client = createClient({
	url: `https://127.0.0.1:5000/graphql`,
	fetchOptions: () => ({
		credentials: 'include'
	}),
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
						invalidateAllPosts(cache);
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
						invalidateAllPosts(cache);
					},
					vote: (_result, args, cache, info) => {
						const {postId, value} = args as VoteMutationVariables;
						const data = cache.readFragment(
							gql`
								fragment _ on Post {
									id
									points
									voteStatus
								}
							`,
							{id: postId} as any
						);
						if (data) {
							if (data.voteStatus === value) {
								return;
							}
							const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
							cache.writeFragment(
								gql`
									fragment __ on Post {
										points
										voteStatus
									}
								`,
								{id: postId, points: newPoints, voteStatus: value} as any
							);
						}
					},
					deletePost: (_result, args, cache, info) => {
						cache.invalidate({__typename: 'Post', id: (args as DeletePostMutationVariables).id});
					}
				}
			}
		}),
		fetchExchange
	]
});
