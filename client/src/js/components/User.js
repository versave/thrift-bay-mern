import React, { Component } from 'react';
import Product from './Product';
import Loader from './Loader';
import { connect } from 'react-redux';
import { getProducts, getUserProducts } from '../actions/productActions';
import PropTypes from 'prop-types';
import { setWindowTop } from '../utils/functions';

class User extends Component {
    state = {
        id: this.props.match.params.id
    }

    static propTypes = {
        getUserProducts: PropTypes.func.isRequired,
        product: PropTypes.object,
        user: PropTypes.object
    };

    componentDidMount() {
        setWindowTop();
        this.props.product.products.length <= 0 ? this.props.getProducts(this.state.id) : this.props.getUserProducts(this.state.id);
    }
    
    componentDidUpdate(prevState) {
        if(prevState.product.loaded !== this.props.product.loaded) {
            this.props.getUserProducts(this.state.id);      
        }
    }
    
    render() {
        const { userProducts } = this.props.product;
        const userName = this.props.match.params.name;

        return (
            <div className="user">
                <div className="user__head">
                    <h2>{userName}</h2>
                </div>
                
                <div className="user__body">
                    <h3>All products by {userName}</h3>

                    <div className="cols">
                        {
                            this.props.product.loading ? <Loader />
                            : userProducts.map(product => {
                                return (
                                    <div key={product._id} className={`col ${product.visible === 'hidden' ? 'hidden' : ''}`}>
                                    <Product
                                        id={product._id}
                                        name={product.name}
                                        price={product.price}
                                        owner={product.owner}
                                        ownerName={product.ownerName}
                                        ownerEmail={product.ownerEmail}
                                        image={product.hasImage}
                                        image64={product.image64}
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
    product: state.product,
    user: state.user
});

export default connect(mapStateToProps,
    { getProducts, getUserProducts })
(User);