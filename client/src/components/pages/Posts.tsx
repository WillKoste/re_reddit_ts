import React, {useEffect, useState} from 'react';
import {Heading, Box, Text, Stack, Flex, Button, IconButton} from '@chakra-ui/react';
import {DeleteIcon, EditIcon} from '@chakra-ui/icons';
import Vote from '../layout/Vote';
import {useDeletePostMutation, useMeQuery, usePostsQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';
import {Link, RouteComponentProps} from 'react-router-dom';

interface PostsProps extends RouteComponentProps {}

const Posts: React.FC<PostsProps> = ({history}) => {
	const [variables, setVariables] = useState({limit: 15, cursor: null as null | string});
	const [{data, fetching}, getPosts] = usePostsQuery({variables});
	const [{data: meData}, getMe] = useMeQuery();
	const [{}, deletePost] = useDeletePostMutation();

	useEffect(() => {
		getMe();
		getPosts();
	}, []);

	if (!fetching && !data) {
		return <div>You aint got no data</div>;
	}

	return (
		<Wrapper>
			{fetching && !data ? (
				<p>Loading...</p>
			) : data!.posts.posts.length < 1 ? (
				<p>No posts :C</p>
			) : (
				<Box>
					<Flex justifyContent='space-between' alignItems='flex-end'>
						<Heading size='2xl' as='h1'>
							Posts
						</Heading>
						<Button bg='#333' color='#fff' _hover={{bg: 'gray.600'}}>
							<Link to='/create-post'>Create Post</Link>
						</Button>
					</Flex>
					<Stack spacing={8} mt={10}>
						{data!.posts.posts.map((post) => {
							return !post ? null : (
								<Box key={post.id} p={6} pl={2} shadow='md' display='flex' alignItems='center' justifyContent='space-between'>
									<Vote post={post as any} />
									<Box flex={11} ml={1}>
										<Link to={`/posts/${post.id}`}>
											<Heading size='md' mb={1}>
												{post.title}
											</Heading>
											<Text mb={2} color='gray.400' fontSize='sm'>
												Posted by: {post.creator.username}
											</Text>
											<Text mb={2} color='gray.400' fontSize='sm'>
												Posted on: {post.createdAt}
											</Text>
											<Text>{post.textSnippet}</Text>
										</Link>
									</Box>
									{post.creatorId === meData?.me?.id ? (
										<Box display='flex'>
											<IconButton icon={<EditIcon />} aria-label='Update post' mr={2} onClick={() => history.push(`/posts/edit/${post.id}`)} />
											<IconButton icon={<DeleteIcon />} aria-label='Delete post' onClick={() => deletePost({id: post.id})} />
										</Box>
									) : null}
								</Box>
							);
						})}
					</Stack>
				</Box>
			)}
			{data ? (
				<Box display='flex' alignItems='center' justifyContent='center'>
					{data.posts.hasMore ? (
						<Button
							onClick={() => {
								setVariables({limit: variables.limit, cursor: data.posts.posts[data.posts.posts.length - 1].createdAt});
							}}
							isLoading={fetching}
							size='lg'
							my={8}
						>
							Load more
						</Button>
					) : (
						<Text my={8} fontSize='xl'>
							Sorry Charlie, you're out of content :c
						</Text>
					)}
				</Box>
			) : null}
		</Wrapper>
	);
};

export default Posts;
