import React, { Component, Fragment } from 'react';
import Search from './Search';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';
import PropTypes from 'prop-types';

class Header extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        logout: PropTypes.func.isRequired
    };

    stickyHeader = ($header) => {
        let scrollPos = 0;
    
        window.addEventListener('scroll', function() {
            (document.body.getBoundingClientRect()).top > scrollPos ? $header.classList.add('sticky') : $header.classList.remove('sticky');
    
            scrollPos = (document.body.getBoundingClientRect()).top;
        });
    };
        
    componentDidMount() {
        this.stickyHeader(document.querySelector('.header'));
    }

    render() {
        const { isAuthenticated } = this.props;

        const authLinks = (
            <Fragment>
                <li> 
                    <Link to="/products/add" className="btn btn--white">+ Add Item</Link>
                </li>
                <li>
                    <button className="btn btn--red" onClick={this.props.logout}>Logout</button>
                </li>
            </Fragment>
        );
        const guestLinks = (
            <Fragment>
                <li>
                    <Link to="/login" className="btn">Log In</Link>
                </li>
                <li>
                    <Link to="/signup" className="btn btn--blue">Sign Up</Link>
                </li>
            </Fragment>
        );

        return (
           <header className="header sticky">
                <nav className="nav">
                    <div className="nav__logo">
                        <Link to="/" className="logo">
                            Thrift<br />
                            Bay
                        </Link>
                    </div>

                    <div className="nav__search">
                        <Search />
                    </div>

                    <div className="nav__actions">
                        <ul>
                           {isAuthenticated ? authLinks : guestLinks}
                        </ul>
                    </div>
                </nav>
           </header>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Header);