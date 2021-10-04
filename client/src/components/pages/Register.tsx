import React from 'react';
import {History} from 'history';
import Wrapper from '../layout/Wrapper';
import {Heading, Button} from '@chakra-ui/react';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import {Link} from 'react-router-dom';
import {useRegisterMutation} from '../../generated/graphql';
import toErrorMap from '../../utils/toErrorMap';

interface RegisterProps {
	history: History;
}

const Register: React.FC<RegisterProps> = ({history}) => {
	const formData = {
		email: '',
		username: '',
		password: ''
	};

	const [{data}, register] = useRegisterMutation();

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='3xl' mb={8}>
				Register
			</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values, {setErrors, setSubmitting}) => {
					const response = await register(values);

					if (response.data?.register?.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register?.user) {
						history.push('/');
					}
					setSubmitting(false);
				}}
			>
				{({handleSubmit, isSubmitting}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='username' label='Username' />
						<InputField name='email' label='Email' />
						<InputField name='password' label='Password' type='password' />
						<Button type='submit' bg='purple.300' _hover={{bg: 'purple.400'}} w='100%' display='block' isLoading={isSubmitting}>
							Register
						</Button>
					</Form>
				)}
			</Formik>
			<p style={{marginTop: '.75rem'}}>
				Already have an account?{' '}
				<Link to='/login' style={{color: 'coral', fontWeight: 600}}>
					Click here
				</Link>{' '}
				to login.
			</p>
		</Wrapper>
	);
};

export default Register;
