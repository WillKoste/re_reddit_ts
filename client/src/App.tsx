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
import ForgotPassword from './components/pages/ForgotPassword';
import CreatePost from './components/pages/CreatePost';
import Posts from './components/pages/Posts';
import PostPage from './components/pages/PostPage';

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
							<Route exact path='/forgot-password' component={ForgotPassword} />
							<Route exact path='/create-post' component={CreatePost} />
							<Route exact path='/posts' component={Posts} />
							<Route exact path='/posts/:postId' component={PostPage} />
							<Route component={NotFound} />
						</Switch>
					</ColorModeProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	);
};

export default App;
