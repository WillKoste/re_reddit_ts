import React, {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {usePostQuery} from '../../generated/graphql';

interface PostPageProps extends RouteComponentProps<{postId: string | undefined}> {}

const PostPage: React.FC<PostPageProps> = ({match}) => {
	const [{data}, getPost] = usePostQuery();

	useEffect(() => {
		getPost(match.params.postId as any);
		console.log({data});
	}, []);

	return (
		<div>
			<h1>Sup bruh</h1>
		</div>
	);
};

export default PostPage;
