import {UserResponse} from 'src/resolvers/user';

export const validateRegister = (username: string, password: string, email: string): UserResponse | null => {
	if (username.length <= 2) {
		return {
			errors: [{field: 'username', message: 'The username must be 2 characters or greater'}]
		};
	}
	if (username.includes('@')) {
		return {
			errors: [{field: 'username', message: 'The username cannot contain the special character @ - please try another username'}]
		};
	}
	if (password.length < 6) {
		return {
			errors: [{field: 'password', message: 'The password must be 6 characters or greater'}]
		};
	}
	if (!email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)) {
		return {
			errors: [{field: 'email', message: 'Email address not valid, please try again'}]
		};
	}
	return null;
};
