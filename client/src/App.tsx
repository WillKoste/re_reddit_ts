import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'urql';
import {client} from './config/client';
import {ThemeProvider, CSSReset, ColorModeProvider} from '@chakra-ui/react';
import theme from './theme';

const App = () => {
	return (
		<Provider value={client}>
			<Router>
				<ThemeProvider theme={theme}>
					<ColorModeProvider options={{initialColorMode: 'light'}}>
						<CSSReset />
						<div>
							<h1>Hello</h1>
							<Switch>
								<Route />
							</Switch>
						</div>
					</ColorModeProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	);
};

export default App;
