import 'express-session';

declare module 'express-session' {
	interface Session {
		/** This is the userId */
		userId: number;
	}
}
