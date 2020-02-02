import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteProduct } from '../actions/productActions';
import PropTypes from 'prop-types';

class Product extends Component {
    state = {
        btnClass: ''
    }

    static propTypes = {
        deleteProduct: PropTypes.func.isRequired,
        product: PropTypes.object,
        user: PropTypes.object
    };

    onDeleteClick = (id, e) => {
        e.target.closest('.product').classList.add('disabled')

        this.setState({btnClass: 'disabled'});
        this.props.deleteProduct(id);
    }

    render() {
        const authBtns = (
            <Fragment>
                <Link to={`/products/edit/${this.props.id}`} className="btn btn--blue">Edit</Link>
                <button className={`btn btn--red ${this.state.btnClass}`} onClick={this.onDeleteClick.bind(this, this.props.id)}>Remove</button>
            </Fragment>
        );

        const guestBtns = (
            <a href={`mailto:${this.props.ownerEmail}`} className="btn">Contact</a>
        );

        // Decode and add image
        // let b64encoded;
        let datajpg = null;
        
        if(this.props.image) {
            datajpg = 'data:image/jpg;base64,' + this.props.image;
        }
          
        return (
           <div className="product">
                <div className="product__image">
                    <figure style={{backgroundImage: `url(${datajpg ? datajpg : 'https://www.cowgirlcontractcleaning.com/wp-content/uploads/sites/360/2018/05/placeholder-img-2.jpg'})`}}></figure>
                </div>
                
                <div className="product__content">
                    <h3>{this.props.name}</h3>
                    
                    <h4>$ {this.props.price}</h4>
                    
                    <h5>
                        by
                        
                        <Link to={`/user/${this.props.ownerName}/${this.props.owner}`}>{this.props.ownerName}</Link>
                    </h5>

                    <div className="product__actions">
                        {this.props.user.isAuthenticated && this.props.user.user._id === this.props.owner ? authBtns : guestBtns}
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

export default connect(mapStateToProps, { deleteProduct })(Product);