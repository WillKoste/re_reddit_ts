import React, {useEffect} from 'react';
import {Heading, Button} from '@chakra-ui/react';
import Wrapper from '../layout/Wrapper';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import TextAreaField from '../layout/TextAreaField';
import {useCreatePostMutation, useMeQuery} from '../../generated/graphql';
import {RouteComponentProps} from 'react-router-dom';

interface CreatePostProps extends RouteComponentProps {}

const CreatePost: React.FC<CreatePostProps> = ({history, location}) => {
	const formData = {
		title: '',
		text: ''
	};
	const [{data, fetching}, getMe] = useMeQuery();
	useEffect(() => {
		getMe();
		if (!fetching && !data?.me) {
			history.push('/login', {pathname: location.pathname});
		}
	}, [data]);

	const [{error}, createPost] = useCreatePostMutation();

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='2xl' mb={8}>
				Create Post
			</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values) => {
					if (error) {
						console.log({error});
					} else {
						console.log({values});
						await createPost({input: values});
						history.push('/');
					}
				}}
			>
				{({isSubmitting, handleSubmit}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='title' label='Title' />
						<TextAreaField name='text' label='Body' />
						<Button type='submit' isLoading={isSubmitting} display='block' w='100%' bg='purple.300' _hover={{bg: 'purple.400'}}>
							Create Post
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default CreatePost;
