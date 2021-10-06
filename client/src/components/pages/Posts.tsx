import React, {Fragment, useEffect} from 'react';
import {Heading, Box, Text, Stack, Flex, Button} from '@chakra-ui/react';
import {usePostsQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';
import {Link} from 'react-router-dom';

interface PostsProps {}

const Posts: React.FC<PostsProps> = () => {
	const [{data, fetching}, getPosts] = usePostsQuery({variables: {limit: 10}});

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
				<Fragment>
					<Flex justifyContent='space-between' alignItems='flex-end'>
						<Heading size='2xl' as='h1'>
							Posts
						</Heading>
						<Button>
							<Link to='/create-post'>Create Post</Link>
						</Button>
					</Flex>
					<Stack spacing={8} mb={16} mt={10}>
						{data.posts.map((post) => (
							<Box key={post.id} mb={5} p={4} shadow='md'>
								<Link to={`/posts/${post.id}`}>
									<Heading size='md'>{post.title}</Heading>
									<Text mb={3} color='gray.400' fontSize='sm'>
										By: {post.creatorId}
									</Text>
									<Text>{post.textSnippet}</Text>
								</Link>
							</Box>
						))}
					</Stack>
				</Fragment>
			)}
		</Wrapper>
	);
};

export default Posts;
