import React, {Fragment, useEffect} from 'react';
import {Heading, Text, Button, Box, IconButton} from '@chakra-ui/react';
import {RouteComponentProps} from 'react-router-dom';
import {useDeletePostMutation, useMeQuery, usePostQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';
import {Link} from 'react-router-dom';
import {DeleteIcon, EditIcon} from '@chakra-ui/icons';

interface PostPageProps extends RouteComponentProps<{postId: any}> {}

const PostPage: React.FC<PostPageProps> = ({match, history}) => {
	const [{data, fetching}, getPost] = usePostQuery({variables: {id: +match.params.postId}});
	const [{data: meData}] = useMeQuery();
	const [{}, deletePost] = useDeletePostMutation();

	useEffect(() => {
		getPost();
		console.log({data, voteStatus: data?.post?.voteStatus});
	}, [fetching]);

	return (
		<Wrapper variant='large'>
			{fetching ? (
				<Text>Loading...</Text>
			) : data?.post ? (
				<Fragment>
					<Heading size='2xl' mb={3}>
						{data.post?.title}
					</Heading>
					<Text fontSize='sm' mb={6}>
						Posted by: {data.post?.creator.username}
					</Text>
					{data.post.creatorId === meData?.me?.id ? (
						<Box display='flex' mb={4}>
							<IconButton icon={<EditIcon />} aria-label='Update post' mr={2} onClick={() => history.push(`/posts/edit/${data?.post?.id}`)} />
							<IconButton
								icon={<DeleteIcon />}
								aria-label='Delete post'
								onClick={() => {
									deletePost({id: data?.post?.id ? data.post.id : 0});
									history.push('/posts');
								}}
							/>
						</Box>
					) : null}
					<Text fontSize='lg'>{data.post?.text}</Text>
					<Text p={2} bg='purple.500' color='white' display='inline-block' borderRadius='10px' my={5}>
						Points: {data.post?.points}
					</Text>
				</Fragment>
			) : (
				<Text>Aint no post {match.params.postId} found, sorry...</Text>
			)}
			<Button display='block' onClick={() => history.goBack()}>
				Go back
			</Button>
		</Wrapper>
	);
};

export default PostPage;
