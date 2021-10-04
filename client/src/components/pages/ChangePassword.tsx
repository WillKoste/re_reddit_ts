import React from 'react';
import {History} from 'history';
import {Heading, Button} from '@chakra-ui/react';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import Wrapper from '../layout/Wrapper';
import {RouteComponentProps} from 'react-router-dom';

interface ChangePasswordProps extends RouteComponentProps<{resetId: string}> {
	history: History;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({history, match}) => {
	const formData = {
		newPassword: '',
		confirmPassword: ''
	};

	return (
		<Wrapper variant='small'>
			<Heading mb={8}>Change Password</Heading>
			<Formik initialValues={formData} onSubmit={async (values, {setErrors, setSubmitting}) => {}}>
				{({isSubmitting, handleSubmit}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='newPassword' label='New Password' type='password' />
						<InputField name='confirmPassword' label='Confirm Password' type='password' />
						<Button bg='purple.300' _hover={{bg: 'purple.400'}} isLoading={isSubmitting}>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default ChangePassword;
