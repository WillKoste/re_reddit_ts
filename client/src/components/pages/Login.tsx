import React from 'react';
import {History} from 'history';
import Wrapper from '../layout/Wrapper';
import {Heading, Button} from '@chakra-ui/react';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import toErrorMap from '../../utils/toErrorMap';
import {useLoginMutation} from '../../generated/graphql';
import {Link} from 'react-router-dom';

interface LoginProps {
	history: History;
}

const Login: React.FC<LoginProps> = ({history}) => {
	const formData = {
		usernameOrEmail: '',
		password: ''
	};

	const [{}, login] = useLoginMutation();

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='3xl' mb={8}>
				Login
			</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values, {setErrors, setSubmitting}) => {
					const response = await login(values);
					if (response.data?.login?.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login?.user) {
						history.push('/');
					}
					setSubmitting(false);
				}}
			>
				{({handleSubmit, isSubmitting}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='usernameOrEmail' label='Username or email' />
						<InputField name='password' label='Password' type='password' />
						<Button type='submit' display='block' w='100%' bg='blue.200' _hover={{bg: 'blue.300'}} isLoading={isSubmitting}>
							Login
						</Button>
					</Form>
				)}
			</Formik>
			<p style={{marginTop: '.75rem'}}>
				Need an account?{' '}
				<Link style={{color: 'coral', fontWeight: 600}} to='/register'>
					Click Here
				</Link>{' '}
				to create an account.
			</p>
		</Wrapper>
	);
};

export default Login;
