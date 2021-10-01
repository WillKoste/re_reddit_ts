import React from 'react';
import {Box, Heading} from '@chakra-ui/react';
import {History} from 'history';

interface SplashProps {
	history: History;
}

const Splash: React.FC<SplashProps> = ({history}) => {
	return (
		<Box display='flex' flexDir='column' justifyContent='center' alignItems='center' h='80vh'>
			<Heading>Welcome to the app! :D</Heading>
		</Box>
	);
};

export default Splash;
