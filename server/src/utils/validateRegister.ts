import {UsernamePasswordInput} from '../resolvers/UsernamePasswordInput';

export const validateRegister = (options: UsernamePasswordInput) => {
	if (!options.email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)) {
		return [
			{
				field: 'email',
				message: 'invalid email'
			}
		];
	}

	if (options.username.length <= 2) {
		return [
			{
				field: 'username',
				message: 'The username must be 2 characters or greater'
			}
		];
	}

	if (options.username.includes('@')) {
		return [
			{
				field: 'username',
				message: 'The username cannot contain the special character @ - please try another username'
			}
		];
	}

	if (options.password.length < 6) {
		return [
			{
				field: 'password',
				message: 'The password must be 6 characters or greater'
			}
		];
	}

	return null;
};
