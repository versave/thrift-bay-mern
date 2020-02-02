import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './js/actions/userActions';
import { BrowserRouter as Router } from 'react-router-dom'; 
import Renderer from './js/components/Renderer';
import './App.scss';

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="app">
                        <Renderer />
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;