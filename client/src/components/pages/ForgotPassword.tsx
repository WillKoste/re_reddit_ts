import React, {useState} from 'react';
import {Heading, Button, Box} from '@chakra-ui/react';
import Wrapper from '../layout/Wrapper';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import {useForgotPasswordMutation} from '../../generated/graphql';

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
	const [complete, setComplete] = useState(false);
	const formData = {
		email: ''
	};
	const [{}, forgotPassword] = useForgotPasswordMutation();

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='2xl' mb={8}>
				Forgot Password
			</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values, {setSubmitting}) => {
					await forgotPassword(values);
					setSubmitting(false);
					setComplete(true);
				}}
			>
				{({isSubmitting, handleSubmit}) =>
					complete ? (
						<Box>If an account with that email exists, we sent you an email to reset your password.</Box>
					) : (
						<Form onSubmit={handleSubmit}>
							<InputField name='email' label='Email' />
							<Button type='submit' bg='purple.300' _hover={{bg: 'purple.400'}} display='block' w='100%' isLoading={isSubmitting}>
								Submit
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default ForgotPassword;
