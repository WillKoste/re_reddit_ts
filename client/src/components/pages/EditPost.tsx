import React from 'react';
import {Heading, Button, Text} from '@chakra-ui/react';
import {RouteComponentProps} from 'react-router';
import Wrapper from '../layout/Wrapper';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import TextAreaField from '../layout/TextAreaField';
import {usePostQuery, useUpdatePostMutation} from '../../generated/graphql';

interface EditPostProps extends RouteComponentProps<{postId: string}> {}

const EditPost: React.FC<EditPostProps> = ({match, history}) => {
	const [{}, updatePost] = useUpdatePostMutation();
	const [{data: postData, fetching}] = usePostQuery({variables: {id: +match.params.postId}});

	const formData = {
		title: postData?.post?.title ? postData?.post?.title : '',
		text: postData?.post?.text ? postData?.post?.text : ''
	};

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='2xl' mb={8}>
				Edit Post
			</Heading>
			{fetching ? (
				<Text>Loading...</Text>
			) : !postData?.post ? (
				<Text>Post does not exist.</Text>
			) : (
				<Formik
					initialValues={formData}
					onSubmit={async (values) => {
						await updatePost({id: +match.params.postId, text: values.text, title: values.title});
						history.push('/posts');
					}}
				>
					{({isSubmitting, handleSubmit}) => (
						<Form onSubmit={handleSubmit}>
							<InputField name='title' label='Title' />
							<TextAreaField name='text' label='Text' />
							<Button display='block' w='100%' bg='purple.400' _hover={{bg: 'purple.300'}} mb={3} isLoading={isSubmitting} type='submit'>
								Update Post
							</Button>
							<Button display='block' w='100%' onClick={() => history.goBack()}>
								Go back
							</Button>
						</Form>
					)}
				</Formik>
			)}
		</Wrapper>
	);
};

export default EditPost;
