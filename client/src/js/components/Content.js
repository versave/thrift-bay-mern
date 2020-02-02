import React, { Component } from 'react';
import Product from './Product';
import { connect } from 'react-redux';
import { getProducts, callLoaded } from '../actions/productActions';
import PropTypes from 'prop-types';
import Loader from './Loader';
import { setWindowTop } from '../utils/functions';

class Content extends Component {
    state = {
        loaded: false
    }

    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        callLoaded: PropTypes.func.isRequired,
        product: PropTypes.object
    };

    componentDidMount() {
        if(this.props.product.products.length <= 0 || !this.props.product.loading) {
            this.setState({loaded: true})
        }      
    }
    
    componentDidUpdate() {
        setWindowTop();

        if(!this.props.product.loading && !this.props.product.loaded) {
            this.props.getProducts();
            this.setState({loaded: this.props.product.loaded})
        }
    }

    render() {
        const { products } = this.props.product;

        return (
           <div className="content">
                <h2>Products</h2>

                <div className="content__inner">
                    <div className="cols">
                       {
                           this.props.product.loading ? <Loader />
                           : products.map(product => {
                               return (
                                   <div key={product._id} className={`col ${product.visible === 'hidden' ? 'hidden' : ''}`}>
                                       <Product
                                           id={product._id}
                                           name={product.name}
                                           price={product.price}
                                           owner={product.owner}
                                           ownerName={product.ownerName}
                                           ownerEmail={product.ownerEmail}
                                           image={product.image}
                                       />
                                   </div>  
                               );
                            })
                       }
                    </div>
                </div>
           </div>
        );
    }
}

const mapStateToProps = (state) => ({
    product: state.product
});

export default connect(mapStateToProps,
    { getProducts, callLoaded })
(Content);