import { GET_PRODUCTS, GET_USER_PRODUCTS, ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT, PRODUCTS_LOADING, CALL_LOADED, FILTER_PRODUCTS } from '../actions/types';

const initialState = {
    products: [],
    cachedProducts: [],
    userProducts: [],
    loading: false,
    loaded: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                loading: false,
                loaded: true
            }
        case GET_USER_PRODUCTS:
            return {
                ...state,
                userProducts: state.products.filter(product => product.owner === action.payload),
                loading: false,
                loaded: false
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(product => product._id !== action.payload)
            }
        case ADD_PRODUCT:
            return {
                ...state,
                products: [action.payload, ...state.products],
                loading: false
            }
        case EDIT_PRODUCT:
            return {
                ...state,
                products: state.products.map(product => {
                    const [id, edits, productObject] = action.payload;

                    if(product._id === id) {
                        const editsObject = JSON.parse(JSON.stringify(Object.fromEntries(edits)));

                        Object.keys(editsObject)
                            .forEach(key => {
                                if(key === 'product') {
                                    product.image = productObject.image;
                                } else {
                                    product[key] = editsObject[key];
                                }
                            });
                            
                        return product;
                    } else {
                        return product;
                    }
                }),
                loading: false
            }
        case FILTER_PRODUCTS:
            return {
                ...state,
                products: state.products.map(product => {
                    if(action.payload === '') {
                        product.visible = '';
                        return product;
                    }
                    
                    if(product.name.toLowerCase().includes(action.payload.toLowerCase())) {
                        product.visible = '';
                        
                        return product;
                    } else {
                        product.visible = 'hidden';
                        return product;
                    }
                }),
            }
        case PRODUCTS_LOADING:
            return {
                ...state,
                loading: true
            }

        case CALL_LOADED:
            return {
                ...state,
                loaded: action.payload
            }
        default:
            return state;
    }
};