import React from 'react';
import {Button, Heading} from '@chakra-ui/react';
import {Link} from 'react-router-dom';

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
	return (
		<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
			<Heading size='xl'>404</Heading>
			<Heading size='md'>Page note found D:</Heading>
			<Button mt={6} bg='purple' color='#fff'>
				<Link to='/'>Go Home</Link>
			</Button>
		</div>
	);
};

export default NotFound;
