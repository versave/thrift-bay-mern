import React, { Component } from 'react';
import Product from './Product';
import Loader from './Loader';
import { connect } from 'react-redux';
import { getUserProducts } from '../actions/productActions';
import PropTypes from 'prop-types';
import { setWindowTop } from '../utils/functions';

class User extends Component {
    static propTypes = {
        getUserProducts: PropTypes.func.isRequired,
        product: PropTypes.object,
        user: PropTypes.object
    };

    componentDidMount() {
        setWindowTop();

        const id = this.props.match.params.id;
        this.props.getUserProducts(id);      
    }

    render() {
        const { products } = this.props.product;
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
    product: state.product,
    user: state.user
});

export default connect(mapStateToProps,
    { getUserProducts })
(User);