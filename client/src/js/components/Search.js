import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filterProducts } from '../actions/productActions';
import PropTypes from 'prop-types';

class Search extends Component {
    state = {
        search: ''
    }

    static propTypes = {
        product: PropTypes.object.isRequired,
        filterProducts: PropTypes.func.isRequired
    }
    
    onChange = (e) => {
        this.setState({search: e.target.value});
    }
    
    onSubmit = (e) => {
        e.preventDefault();

        this.props.filterProducts(this.state.search);
    }

    render() {
        return (
           <div className="search">
                <form onSubmit={this.onSubmit}>
                    <input type="search" placeholder="Search for..." onChange={this.onChange}></input>

                    <button type="submit" className="search__btn btn--blue">Search</button>
                </form>
           </div>
        );
    }
}


const mapStateToProps = (state) => ({
    product: state.product
});

export default connect(mapStateToProps, { filterProducts })(Search);