import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom'; 
import PropTypes from 'prop-types';

import Header from './Header';
import Content from './Content';
import Login from './Login';
import SignUp from './Signup';
import Footer from './Footer';
import User from './User';
import AddItem from './AddItem';
import EditItem from './EditItem';
import Loader from './Loader';
import PrivateRoute from './PrivateRoute';

class Renderer extends Component {
    constructor() {
        super();

        this.state = {
            domLoaded: false
        }

        this.setDomLoaded();
    }

    static propTypes = {
        user: PropTypes.object.isRequired
    };

    setDomLoaded() {
        window.addEventListener('load', () => {
            this.setState({ domLoaded: true });
        });
    }

    render() {
        const fragment = (
            <Fragment>
                <Header />                    
                            
                <main className="main">
                    <Switch>
                        <Route path="/" exact component={Content} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/user/:name/:id" component={User} />

                        <PrivateRoute path="/products/add" component={AddItem} exact />
                        <PrivateRoute path="/products/edit/:id" component={EditItem} exact />
                        
                        <Route path="*">
                            <h1 className="not-found">404 Not found!</h1>
                        </Route>
                    </Switch>
                </main>
                
                <Footer />
            </Fragment>
        );

        return (
            !this.props.user.isLoading && this.state.domLoaded ? fragment : <Loader addClass="loader--fixed" />
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, {})(Renderer);