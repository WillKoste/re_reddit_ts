import React, {useEffect} from 'react';
import {Heading, Box, Text} from '@chakra-ui/react';
import {usePostsQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';
import {Link} from 'react-router-dom';

interface PostsProps {}

const Posts: React.FC<PostsProps> = () => {
	const [{data, fetching}, getPosts] = usePostsQuery();

	useEffect(() => {
		getPosts();
	}, []);

	return (
		<Wrapper>
			{fetching || !data ? (
				<p>Loading...</p>
			) : data.posts.length < 1 ? (
				<p>No posts :C</p>
			) : (
				data.posts.map((post) => (
					<Box key={post.id} mb={5} p={3} bg='gray.50'>
						<Link to={`/posts/${post.id}`}>
							<Heading size='md'>{post.title}</Heading>
							<Text color='gray.400' fontSize='sm'>
								By: {post.creatorId}
							</Text>
							<Text>{post.text}</Text>
						</Link>
					</Box>
				))
			)}
		</Wrapper>
	);
};

export default Posts;
