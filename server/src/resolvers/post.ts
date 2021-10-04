import {Resolver, Query, Arg, Mutation} from 'type-graphql';
import {Post} from '../entities/Post';

@Resolver()
export class PostResolver {
	/**
	 * @name Get All Posts
	 */
	@Query(() => [Post])
	async posts(): Promise<Post[]> {
		return Post.find();
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
	async createPost(@Arg('title') title: string): Promise<Post> {
		return Post.create({title}).save();
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
