import {Heading, Box} from '@chakra-ui/layout';
import React from 'react';
import {usePostsQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';

interface PostsProps {}

const Posts: React.FC<PostsProps> = () => {
	const [{data}, posts] = usePostsQuery();

	return (
		<Wrapper variant='large'>
			<Heading as='h1' size='3xl'>
				Posts
			</Heading>
			{!data ? (
				<p>Loading...</p>
			) : (
				data.posts.map((post) => (
					<Box key={post.id}>
						<p>
							<strong>Post ID: </strong>
							{post.id}
						</p>
						<p>
							<strong>Post Title: </strong>
							{post.title}
						</p>
					</Box>
				))
			)}
		</Wrapper>
	);
};

export default Posts;
