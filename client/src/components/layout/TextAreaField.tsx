import React from 'react';
import {useField} from 'formik';
import {FormControl, FormLabel, Textarea, FormErrorMessage} from '@chakra-ui/react';

interface TextAreaFieldProps {
	label: string;
	name: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({label, ...props}) => {
	const [field, {error}] = useField(props);

	return (
		<FormControl isInvalid={!!error} mb={4}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Textarea {...field} id={field.name} {...props} rows={8} />
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};

export default TextAreaField;
