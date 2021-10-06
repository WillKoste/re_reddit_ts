import {isAuth} from '../middleware/isAuth';
import {MyContext} from 'src/types';
import {Resolver, Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, FieldResolver, Root, ObjectType} from 'type-graphql';
import {Post} from '../entities/Post';
import {getConnection} from 'typeorm';

@InputType()
class PostInput {
	@Field()
	title: string;
	@Field()
	text: string;
}

@ObjectType()
class PaginatedPosts {
	@Field(() => [Post])
	posts: Post[];
	@Field(() => Boolean)
	hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(@Root() root: Post) {
		return root.text.slice(0, 50);
	}

	/**
	 * @name Get All Posts
	 */
	@Query(() => PaginatedPosts)
	async posts(@Arg('limit', () => Int) limit: number, @Arg('cursor', () => String, {nullable: true}) cursor: string | null): Promise<PaginatedPosts> {
		const realLimit = Math.min(50, limit);
		const realLimitPlusOne = realLimit + 1;
		const qb = getConnection().getRepository(Post).createQueryBuilder('p').orderBy('"createdAt"', 'DESC').take(realLimitPlusOne);

		if (cursor) {
			qb.where('"createdAt" < :cursor', {cursor: new Date(+cursor)});
		}
		const posts = await qb.getMany();
		const hasMore = posts.length === realLimitPlusOne;
		return {posts: posts.slice(0, realLimit), hasMore};
	}

	/**
	 * @name Get Post By ID
	 */
	@Query(() => Post, {nullable: true})
	async post(@Arg('id') id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	/**
	 * @name Create Post
	 */
	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(@Arg('input') input: PostInput, @Ctx() {req}: MyContext): Promise<Post> {
		return Post.create({
			...input,
			creatorId: req.session.userId
		}).save();
	}

	/**
	 * @name Update Post
	 */
	@Mutation(() => Post, {nullable: true})
	async updatePost(@Arg('id') id: number, @Arg('title', () => String, {nullable: true}) title: string): Promise<Post | undefined> {
		const post = await Post.findOne(id);
		if (!post) {
			return undefined;
		}
		if (typeof post.title !== 'undefined') {
			await Post.update({id}, {title});
		}
		return post;
	}

	/**
	 * @name Delete User
	 */
	@Mutation(() => Boolean)
	async deletePost(@Arg('id') id: number): Promise<boolean> {
		await Post.delete(id);
		return true;
	}
}
