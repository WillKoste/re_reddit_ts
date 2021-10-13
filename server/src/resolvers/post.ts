import {isAuth} from '../middleware/isAuth';
import {MyContext} from 'src/types';
import {Resolver, Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, FieldResolver, Root, ObjectType} from 'type-graphql';
import {Post} from '../entities/Post';
import {getConnection} from 'typeorm';
import {Upvote} from '../entities/Upvote';

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

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async vote(@Arg('postId', () => Int) postId: number, @Arg('value', () => Int) value: number, @Ctx() {req}: MyContext) {
		const isUpvote = value !== -1;
		const realValue = isUpvote ? 1 : -1;
		const {userId} = req.session;
		const existingUpvote = await Upvote.findOne({where: {postId, userId}});

		if (existingUpvote && existingUpvote.value !== realValue) {
			await getConnection().transaction(async (tm) => {
				await tm.query(
					`
					update upvote
						set value = $1
						where "postId" = $2
						and "userId" = $3
				`,
					[realValue, postId, userId]
				);
				await tm.query(
					`
					update post
						set points = points + $1
						where id = $2
				`,
					[2 * realValue, postId]
				);
			});
		} else if (!existingUpvote) {
			await getConnection().transaction(async (tm) => {
				await tm.query(
					`
				insert into upvote ("userId", "postId", "value")
					values ($1, $2, $3)
				`,
					[userId, postId, realValue]
				);

				await tm.query(
					`
				update post
					set points = points + $1
					where id = $2
				`,
					[realValue, postId]
				);
			});
		}
		return true;
	}

	/**
	 * @name Get All Posts
	 */
	@Query(() => PaginatedPosts)
	async posts(@Ctx() {req}: MyContext, @Arg('limit', () => Int) limit: number, @Arg('cursor', () => String, {nullable: true}) cursor: string | null): Promise<PaginatedPosts> {
		const realLimit = Math.min(50, limit);
		const realLimitPlusOne = realLimit + 1;
		const replacements: any[] = [realLimitPlusOne];

		if (req.session.userId) {
			replacements.push(req.session.userId);
		}

		let cursorIdx = 3;
		if (cursor) {
			replacements.push(new Date(parseInt(cursor)));
			cursorIdx = replacements.length;
		}

		const posts = await getConnection().query(
			`
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
    ${req.session.userId ? '(select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"' : 'null as "voteStatus"'}
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $${cursorIdx}` : ''}
    order by p."createdAt" DESC
    limit $1
    `,
			replacements
		);
		const hasMore = posts.length === realLimitPlusOne;

		return {posts: posts.slice(0, realLimit), hasMore};
	}

	/**
	 * @name Get Post By ID
	 */
	@Query(() => Post, {nullable: true})
	async post(@Arg('id') id: number): Promise<Post | undefined> {
		const thePost = await getConnection().query(`
		select p.*, json_build_object('id', u.id, 'username', u.username, 'email', u.email, 'createdAt', u."createdAt") "creator" from "post" p
			inner join "user" u
			on u.id = p."creatorId"
			where p.id = ${id}
		`);
		return thePost[0];
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
	@UseMiddleware(isAuth)
	async updatePost(@Ctx() {req}: MyContext, @Arg('id') id: number, @Arg('text') text: string, @Arg('title') title: string): Promise<Post | undefined> {
		const result = await getConnection().createQueryBuilder().update(Post).set({title, text}).where('id = :id and "creatorId" = :creatorId', {id, creatorId: req.session.userId}).returning('*').execute();

		return result.raw[0];
	}

	/**
	 * @name Delete User
	 */
	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deletePost(@Arg('id', () => Int) id: number, @Ctx() {req}: MyContext): Promise<boolean> {
		await Post.delete({id, creatorId: req.session.userId});
		return true;
	}
}
