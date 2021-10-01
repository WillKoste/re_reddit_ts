import React from 'react';
import {History} from 'history';
import Wrapper from '../layout/Wrapper';
import {Heading, Button} from '@chakra-ui/react';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import {Link} from 'react-router-dom';

interface RegisterProps {
	history: History;
}

const Register: React.FC<RegisterProps> = ({history}) => {
	const formData = {
		email: '',
		username: '',
		password: ''
	};

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='3xl' mb={8}>
				Register
			</Heading>
			<Formik initialValues={formData} onSubmit={(values, {setErrors, setSubmitting}) => {}}>
				{({handleSubmit, isSubmitting}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='username' label='Username' />
						<InputField name='email' label='Email' />
						<Button type='submit' bg='purple.300' _hover={{bg: 'purple.400'}} w='100%' display='block'>
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
