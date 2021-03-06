import DataLoader from 'dataloader';
import {Upvote} from '../entities/Upvote';

export const createUpvoteLoader = () =>
	new DataLoader<{userId: number; postId: number}, Upvote | null>(async (keys) => {
		const upvotes = await Upvote.findByIds(keys as any);
		const upvoteIdsToUpvotes: Record<string, Upvote> = {};

		upvotes.forEach((uv) => {
			upvoteIdsToUpvotes[`${uv.userId}|${uv.postId}`] = uv;
		});

		return keys.map((key) => upvoteIdsToUpvotes[`${key.userId}|${key.postId}`]);
	});
