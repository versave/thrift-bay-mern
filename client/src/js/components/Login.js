import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ErrorAlert from './ErrorAlert'; 
import { login } from '../actions/userActions';
import { clearErrors } from '../actions/errorActions';

class Login extends Component {
    state = {
        email: '',
        password: '',
        msg: null
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;

        if(error !== prevProps.error) {
            // Check for login error
            if(error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.message });
            } else {
                this.setState({ msg: null });
            }
        }

        // Route to home
        if(isAuthenticated) {
            this.props.history.push('/');
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();

        const { email, password } = this.state;
        const user = {
            email,
            password
        };

        // Attempt to login
        this.props.login(user);
    }
    
    render() {
        return (
            <div className="form">
            
                <form onSubmit={this.onSubmit}>
                    <h2>Log In</h2>

                    {this.state.msg ? <ErrorAlert message={this.state.msg} /> : null}
                
                    <div className="form__row">
                        <label htmlFor="email">Email</label>

                        <input type="email" name="email" id="email" className="field" placeholder="Email address" onChange={this.onChange} />
                    </div>

                    <div className="form__row">
                        <label htmlFor="password">Password</label>

                        <input type="password" name="password" id="password" className="field" placeholder="Password" onChange={this.onChange} />
                    </div>

                    <div className="form__actions">
                        <button type="submit" className="btn">Log In</button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(Login);