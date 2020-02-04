import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editProduct } from '../actions/productActions';
import PropTypes from 'prop-types';
import ErrorAlert from './ErrorAlert';
import Loader from './Loader';
import { setWindowTop } from '../utils/functions';

class EditItem extends Component {
    state = {
        name: '',
        price: '',
        image: null,
        imageName: '',
        uploadBg: '',
        msg: null,
        loading: false
    }

    static propTypes = {
        editProduct: PropTypes.func.isRequired,
        product: PropTypes.object,
        error: PropTypes.object
    };

    componentDidMount() {
        setWindowTop();
    }

    componentDidUpdate(prevProps) {
        const { loading } = this.props.product;
        const { error } = this.props;

        if(prevProps.error !== error) {
            this.setState({msg: error.msg.error, loading: false});
        } 

        if(prevProps.product.loading !== loading) {
            // Route back to home
            this.props.history.push('/');
        }
    }

    validateInput({ name, price, image }) {
        return new Promise((resolve, reject) => {
            if(name === '' & price === '' && image === null) {
                reject('Please make at least one change in order to submit');

            } else if(image !== null) {
                if(!image.type.match(/\/(jpg|jpeg|png)$/)) {
                    reject('File format must be .jpg, .jpeg or .png');
                } else if(image.size > 3000000){
                    reject('File size too large. Must be under 3mb.');
                }
            }
            resolve();
        });
    }

    onChange = (e) => {
        if(e.target.type !== 'file') {
            this.setState({ [e.target.name]: e.target.value });
        }
        
        // Set image to state and file uploader background
        if(e.target.type === 'file' && e.target.files[0] !== undefined) {
            this.setState({ image: e.target.files[0], imageName: e.target.files[0].name });

            const reader = new FileReader();

            reader.onload = (e) => {
                this.setState({ uploadBg: e.target.result });
            };

            reader.readAsDataURL(e.target.files[0]);
        }   
    }

    onSubmit = (e) => {
        e.preventDefault();

        const allowedEdits = {
            name: this.state.name,
            price: this.state.price,
            image: this.state.image
        };

        this.validateInput(allowedEdits).then(() => {
            const id = this.props.match.params.id;
            const updates = Object.keys(allowedEdits);
            const formData = new FormData();

            updates.forEach(update => {
                if(allowedEdits[update] !== '' && allowedEdits[update] !== null) {
                    update === 'image' ? formData.append('product', allowedEdits[update]) : formData.append(update, allowedEdits[update]);
                }
            })

            // Edit product via editProducts action
            this.setState({loading: true});
            
            this.props.editProduct(id, formData);
        })
        .catch(e => {
            this.setState({ msg: e });
        });
    }
    
    render() {
        return (
           <div className="form">
                <form onSubmit={this.onSubmit}>
                    {this.state.msg ? <ErrorAlert message={this.state.msg} /> : null}

                    {this.state.loading ? <div className="form__disabled"><Loader /></div> : null}

                    <h2>Edit Item</h2>

                    <div className="form__row form__row--image">
                        <label htmlFor="image" style={{backgroundImage: `url(${this.state.uploadBg})`}}>{this.state.imageName === '' ? 'Upload an image' : this.state.imageName}</label>
    
                        <input type="file" name="image" id="image" className="hidden" onChange={this.onChange} />
                    </div>
    
                    <div className="form__row">
                        <label htmlFor="name">Name</label>
    
                        <input type="text" name="name" id="name" className="field" placeholder="Name" onChange={this.onChange} />
                    </div>
    
                    <div className="form__row">
                        <label htmlFor="price">Price $</label>
    
                        <input type="number" name="price" id="price" className="field" placeholder="Price" onChange={this.onChange} />
                    </div>
    
                    <div className="form__actions">
                        <button type="submit" className="btn">Edit</button>
                    </div>
                </form>
           </div>
        );
    }
}

const mapStateToProps = (state) => ({
    product: state.product,
    error: state.error
});


export default connect(mapStateToProps, { editProduct })(EditItem);