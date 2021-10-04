import React, {useState} from 'react';
import {Heading, Button, Box} from '@chakra-ui/react';
import {Form, Formik} from 'formik';
import InputField from '../layout/InputField';
import Wrapper from '../layout/Wrapper';
import {RouteComponentProps} from 'react-router-dom';
import {useChangePasswordMutation} from '../../generated/graphql';
import toErrorMap from '../../utils/toErrorMap';

interface ChangePasswordProps extends RouteComponentProps<{resetId: string}> {}

const ChangePassword: React.FC<ChangePasswordProps> = ({match, history}) => {
	const formData = {
		newPassword: '',
		resetId: match.params.resetId
	};
	const [tokenError, setTokenError] = useState('');
	const [{}, changePassword] = useChangePasswordMutation();

	return (
		<Wrapper variant='small'>
			<Heading mb={8}>Change Password</Heading>
			<Formik
				initialValues={formData}
				onSubmit={async (values, {setErrors, setSubmitting}) => {
					const response = await changePassword(values);

					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(response.data.changePassword.errors);
						if ('resetId' in errorMap) {
							setTokenError(errorMap.resetId);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						history.push('/');
					}
					setSubmitting(false);
				}}
			>
				{({isSubmitting, handleSubmit}) => (
					<Form onSubmit={handleSubmit}>
						<InputField name='newPassword' label='New Password' type='password' />
						{tokenError ? <Box color='red'>{tokenError}</Box> : null}
						<Button bg='purple.300' _hover={{bg: 'purple.400'}} isLoading={isSubmitting} type='submit'>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default ChangePassword;
