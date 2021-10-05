import {Button} from '@chakra-ui/button';
import {Box, Heading, ListItem, UnorderedList} from '@chakra-ui/layout';
import React, {Fragment} from 'react';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import {useLogoutMutation, useMeQuery} from '../../generated/graphql';

interface NavbarProps extends RouteComponentProps {}

const Navbar: React.FC<NavbarProps> = ({history}) => {
	const [{data, fetching}] = useMeQuery();
	const [{fetching: logoutFetching}, logout] = useLogoutMutation();

	return (
		<Box bg='thistle' p={4} display='flex' alignItems='center' justifyContent='flex-end' pos='sticky' top={0} zIndex={10} boxShadow='sm'>
			{fetching ? null : !data?.me ? (
				<UnorderedList display='flex'>
					<ListItem listStyleType='none' mx={1}>
						<NavLink style={{padding: '.5rem .75rem'}} activeStyle={{color: 'white', background: 'purple', borderRadius: '8px'}} to='/login'>
							Login
						</NavLink>
					</ListItem>
					<ListItem listStyleType='none' mx={1}>
						<NavLink style={{padding: '.5rem .75rem'}} activeStyle={{color: 'white', background: 'purple', borderRadius: '8px'}} to='/register'>
							Register
						</NavLink>
					</ListItem>
				</UnorderedList>
			) : (
				<Fragment>
					<UnorderedList display='flex' mx={3}>
						<Box>
							<Heading size='lg'>{data.me.username}</Heading>
						</Box>
						<ListItem listStyleType='none' mx={3} alignSelf='center'>
							<NavLink to='/create-post'>Create Post</NavLink>
						</ListItem>
						<ListItem listStyleType='none' mx={3} alignSelf='center'>
							<NavLink to='/posts'>Posts</NavLink>
						</ListItem>
					</UnorderedList>
					<Button
						variant='link'
						color='steelblue'
						mr={4}
						onClick={() => {
							history.push('/login');
							logout();
						}}
						isLoading={logoutFetching}
					>
						Logout
					</Button>
				</Fragment>
			)}
		</Box>
	);
};

export default withRouter(Navbar);
