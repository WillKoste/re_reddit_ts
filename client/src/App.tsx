import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'urql';
import {client} from './config/client';
import {ThemeProvider, CSSReset, ColorModeProvider} from '@chakra-ui/react';
import theme from './theme';

import Navbar from './components/layout/Navbar';
import NotFound from './components/pages/NotFound';
import Splash from './components/pages/Splash';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ChangePassword from './components/pages/ChangePassword';

const App = () => {
	return (
		<Provider value={client}>
			<Router>
				<ThemeProvider theme={theme}>
					<ColorModeProvider options={{initialColorMode: 'light'}}>
						<CSSReset />
						<Navbar />
						<Switch>
							<Route exact path='/' component={Splash} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/register' component={Register} />
							<Route exact path='/change-password/:resetId' component={ChangePassword} />
							<Route component={NotFound} />
						</Switch>
					</ColorModeProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	);
};

export default App;
