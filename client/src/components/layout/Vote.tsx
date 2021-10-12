import React from 'react';
import {ChevronUpIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {Box, Text, IconButton} from '@chakra-ui/react';
import {PostSnippetFragment, useVoteMutation} from '../../generated/graphql';

interface VoteProps {
	post: PostSnippetFragment;
}
const Vote: React.FC<VoteProps> = ({post}) => {
	const [{}, votePost] = useVoteMutation();

	return (
		<Box display='flex' flexDirection='column' flex={1} alignItems='center' justifyContent='center' pr={2}>
			<IconButton
				mb={3}
				color={post.voteStatus === 1 ? 'purple.400' : undefined}
				onClick={async () => {
					if (post.voteStatus === 1) {
						return;
					}
					await votePost({postId: post.id, value: 1});
				}}
				fontSize='5xl'
				background='transparent'
				_hover={{background: 'transparent'}}
				_active={{background: 'transparent'}}
				icon={<ChevronUpIcon />}
				aria-label='upvote'
			/>
			<Text fontWeight='bold' color={post.points < 0 ? 'red.400' : post.points > 0 ? 'green.400' : 'inherit'}>
				{post.points}
			</Text>
			<IconButton
				mt={3}
				onClick={async () => {
					if (post.voteStatus === -1) {
						return;
					} else {
						await votePost({postId: post.id, value: -1});
					}
				}}
				fontSize='5xl'
				background='transparent'
				color={post.voteStatus === -1 ? 'purple.400' : undefined}
				_hover={{background: 'transparent'}}
				_active={{background: 'transparent'}}
				icon={<ChevronDownIcon />}
				aria-label='downvote'
			/>
		</Box>
	);
};

export default Vote;
