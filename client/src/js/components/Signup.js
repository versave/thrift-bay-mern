import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/userActions';
import ErrorAlert from './ErrorAlert'; 
import { clearErrors } from '../actions/errorActions';

class SignUp extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        msg: null
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        
        if(error !== prevProps.error) {
            // Check for register error
            if(error.id === 'REGISTER_FAIL') {
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

        const { name, email, password } = this.state;

        // Creater user objectc
        const newUser = {
            name,
            email,
            password
        };

        // Attempt to register
        this.props.register(newUser);
    }

    render() {
        return (
            <div className="form">
                <form onSubmit={this.onSubmit}>
                    <h2>Sign Up</h2>

                    {this.state.msg ? <ErrorAlert message={this.state.msg} /> : null}
                    
                    <div className="form__row">
                        <label htmlFor="name">Name</label>

                        <input type="text" name="name" id="name" className="field" placeholder="Name" onChange={this.onChange} />
                    </div>

                    <div className="form__row">
                        <label htmlFor="email">Email</label>

                        <input type="email" name="email" id="email" className="field" placeholder="Email address" onChange={this.onChange} />
                    </div>

                    <div className="form__row">
                        <label htmlFor="password">Password</label>

                        <input type="password" name="password" id="password" className="field" placeholder="Password" onChange={this.onChange} />
                    </div>

                    <div className="form__actions">
                        <button type="submit" className="btn">Sign Up</button>
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

export default connect(mapStateToProps, { register, clearErrors })(SignUp);