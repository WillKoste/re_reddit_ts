import {Resolver, Mutation, Arg, Field, Ctx, ObjectType, Query, Int, FieldResolver, Root} from 'type-graphql';
import {MyContext} from '../types';
import {User} from '../entities/User';
import argon2 from 'argon2';
import {validateRegister} from '../utils/validateRegister';
import {sendEmail} from '../utils/sendEmail';
import {v4 as uuidv4} from 'uuid';
const errorObj = {field: 'username', message: 'Not Authorized'};

@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], {nullable: true})
	errors?: FieldError[];

	@Field(() => User, {nullable: true})
	user?: User;
}

@Resolver(User)
export class UserResolver {
	@FieldResolver(() => String)
	email(@Root() user: User, @Ctx() {req}: MyContext) {
		if (req.session.userId === user.id) {
			return user.email;
		}
		return '';
	}

	/**
	 * @name Me Query
	 */
	@Query(() => User, {nullable: true})
	async me(@Ctx() {req}: MyContext) {
		if (!req.session.userId) {
			return null;
		}

		const meUser = await User.findOne(req.session.userId);
		return meUser;
	}

	/**
	 * @name Register User
	 */
	@Mutation(() => UserResponse, {nullable: true})
	async register(@Ctx() {req}: MyContext, @Arg('username', () => String) username: string, @Arg('password', () => String) password: string, @Arg('email', () => String) email: string): Promise<UserResponse> {
		try {
			const response = validateRegister(username, password, email);
			if (response) {
				return response;
			}

			const hash = await argon2.hash(password);
			const newUser = await User.create({username, password: hash, email}).save();
			req.session.userId = newUser.id;
			return {user: newUser};
		} catch (err) {
			console.error(err);
			if (err.code === '23505') {
				return {
					errors: [{field: 'username', message: 'This username is already taken'}]
				};
			}
			return {errors: [{field: 'register', message: `A registration attempt for the username ${username} was unsuccessful`}]};
		}
	}

	/**
	 * @name Login
	 */
	@Mutation(() => UserResponse, {nullable: true})
	async login(@Ctx() {req}: MyContext, @Arg('usernameOrEmail', () => String) usernameOrEmail: string, @Arg('password', () => String) password: string): Promise<UserResponse> {
		const user = await User.findOne({where: usernameOrEmail.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/) ? {email: usernameOrEmail} : {username: usernameOrEmail}});
		if (!user) {
			return {
				errors: [errorObj]
			};
		}
		const isMatch = await argon2.verify(user.password, password);
		if (!isMatch) {
			return {
				errors: [errorObj]
			};
		}
		req.session.userId = user.id;
		return {user};
	}

	/**
	 * @name Logout
	 */
	@Mutation(() => Boolean)
	logout(@Ctx() {req, res}: MyContext) {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				res.clearCookie(process.env.COOKIE_NAME, {
					secure: true,
					sameSite: 'none'
				});
				if (err) {
					console.error(err);
					resolve(false);
					return;
				}
				resolve(true);
			})
		);
	}

	/**
	 * @name Forgot Password
	 */
	@Mutation(() => Boolean)
	async forgotPassword(@Arg('email') email: string, @Ctx() {redis}: MyContext): Promise<Boolean> {
		const theUser = await User.findOne({where: {email}});
		if (!theUser) {
			return true;
		}
		const token: string = uuidv4();
		await redis.set(process.env.FORGET_PASSWORD_PREFIX + token, theUser.id, 'ex', 1000 * 60 * 60 * 3);

		await sendEmail(
			email,
			`
			<div>
				<h1>Request to reset email</h1>
				<p><a href="http://localhost:3000/change-password/${token}">Click here</a> to reset your password. you will be securely redirected to our site.</p>
				<p>If you did not make this request, you do not need to do anything.</p>
			</div>
		`
		);
		return true;
	}

	/**
	 * @name changePassword
	 */
	@Mutation(() => UserResponse)
	async changePassword(@Ctx() {redis, req}: MyContext, @Arg('resetId', () => String) resetId: string, @Arg('newPassword', () => String) newPassword: string): Promise<UserResponse> {
		if (newPassword.length < 6) {
			return {
				errors: [{field: 'newPassword', message: 'The password must be 6 characters or greater'}]
			};
		}

		const key = process.env.FORGET_PASSWORD_PREFIX + resetId;
		const userId = await redis.get(key);
		if (!userId) {
			return {
				errors: [{field: 'resetId', message: 'ResetID token is invalid'}]
			};
		}

		const userIdNum = parseInt(userId);
		const theUser = await User.findOne({id: userIdNum});
		if (!theUser) {
			return {
				errors: [{field: 'resetId', message: 'The user could not be found'}]
			};
		}
		await User.update({id: userIdNum}, {password: await argon2.hash(newPassword)});
		await redis.del(key);

		req.session.userId = theUser.id;

		return {user: theUser};
	}

	//////////////////////////// ADMIN \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

	/**
	 * @name Get All Users
	 */
	@Query(() => [User])
	async users(): Promise<User[]> {
		const theUsers = await User.find();
		return theUsers;
	}

	/**
	 * @name Get User By ID
	 */
	@Query(() => User, {nullable: true})
	async user(@Arg('id', () => Int) id: number): Promise<User | undefined> {
		const theUser = await User.findOne(id);
		return theUser;
	}

	/**
	 * @name Update User
	 */
	@Mutation(() => User, {nullable: true})
	async updateUser(@Arg('id', () => Int) id: number, @Arg('username', () => String) username: string): Promise<User | undefined> {
		const theUser = await User.findOne(id);
		if (!theUser) {
			return undefined;
		}
		if (typeof theUser.username !== 'undefined') {
			await User.update({id}, {username});
		}
		return theUser;
	}

	/**
	 * @name Delete User
	 */
	@Mutation(() => Boolean, {nullable: true})
	async deleteUser(@Arg('id', () => Int) id: number): Promise<Boolean> {
		await User.delete(id);
		return true;
	}
}
