import {useState} from 'react';
import {Heading, Button} from '@chakra-ui/react';
import {Form, Formik} from 'formik';
import React from 'react';
import InputField from '../layout/InputField';
import Wrapper from '../layout/Wrapper';
import {RouteComponentProps} from 'react-router';

interface ResetPasswordProps extends RouteComponentProps<{resetId: string}> {}

interface FormData {
	newPassword: string;
	confirmPassword: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({match}) => {
	const [resetData, setResetData] = useState(match.params.resetId);

	const formData: FormData = {
		newPassword: '',
		confirmPassword: ''
	};

	return (
		<Wrapper variant='small'>
			<Heading as='h1' size='3xl' mb={8}>
				Change Password
			</Heading>
			<Formik initialValues={formData} onSubmit={(values, {setErrors, setSubmitting}) => {}}>
				{({handleSubmit, isSubmitting}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='newPassword' label='New Password' type='password' />
						<InputField name='confirmPassword' label='Confirm New Password' type='password' />
						<Button type='submit' isLoading={isSubmitting} display='block' w='100%' bg='purple.300' _hover={{bg: 'purple.400'}}>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default ResetPassword;
