import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'urql';
import {client} from './config/client';

const App = () => {
	return (
		<Provider value={client}>
			<Router>
				<div>
					<h1>Hello</h1>
					<Switch>
						<Route />
					</Switch>
				</div>
			</Router>
		</Provider>
	);
};

export default App;
