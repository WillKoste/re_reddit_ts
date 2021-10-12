import React, {Fragment, useEffect} from 'react';
import {Heading, Text, Button} from '@chakra-ui/react';
import {RouteComponentProps} from 'react-router-dom';
import {usePostQuery} from '../../generated/graphql';
import Wrapper from '../layout/Wrapper';
import {Link} from 'react-router-dom';

interface PostPageProps extends RouteComponentProps<{postId: any}> {}

const PostPage: React.FC<PostPageProps> = ({match}) => {
	const [{data, fetching}, getPost] = usePostQuery({variables: {id: +match.params.postId}});

	useEffect(() => {
		getPost();
		console.log({data, voteStatus: data?.post?.voteStatus});
	}, [fetching]);

	return (
		<Wrapper variant='large'>
			{fetching ? (
				<Text>Loading...</Text>
			) : data ? (
				<Fragment>
					<Heading size='2xl' mb={3}>
						{data.post?.title}
					</Heading>
					<Text fontSize='sm' mb={6}>
						By: User {data.post?.creatorId}
					</Text>
					<Text fontSize='lg'>{data.post?.text}</Text>
					<Text p={2} bg='purple.500' color='white' display='inline-block' borderRadius='10px' my={5}>
						Points: {data.post?.points}
					</Text>
				</Fragment>
			) : null}
			<Button display='block'>
				<Link to='/posts'>Go back</Link>
			</Button>
		</Wrapper>
	);
};

export default PostPage;
