import axios from 'axios';
import { GET_PRODUCTS, GET_USER_PRODUCTS, ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT, PRODUCTS_LOADING, FILTER_PRODUCTS, CALL_LOADED } from './types';
import { tokenConfig } from './userActions';
import { returnErrors } from './errorActions';

export const getProducts = () => dispatch => {
    dispatch(setProductsLoading());
    
    axios.get('/products')
        .then(res => dispatch({
            type: GET_PRODUCTS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

export const getUserProducts = (id) => (dispatch) => {
    dispatch(setProductsLoading());
    dispatch(callLoaded(true));
    
    axios.get(`/products/${id}`)
        .then(res => dispatch({
            type: GET_USER_PRODUCTS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

export const deleteProduct = (id) => (dispatch, getState) => {
    axios.delete(`/products/${id}`, tokenConfig(getState))
        .then(res => dispatch({
            type: DELETE_PRODUCT,
            payload: id
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
    
    return {
        type: DELETE_PRODUCT,
        payload: id
    }
};

export const addProduct = (product) => (dispatch, getState) => {
    axios.post('/products', product, tokenConfig(getState))
        .then(res => {
            dispatch(setProductsLoading());
            dispatch(callLoaded(false));
            
            return dispatch({
                type: ADD_PRODUCT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

export const editProduct = (id, edits) => (dispatch, getState) => {
    axios.patch(`/products/${id}`, edits, tokenConfig(getState))
        .then(res => {
            dispatch(setProductsLoading());
            dispatch(callLoaded(false));

            return dispatch({
                type: EDIT_PRODUCT,
                payload: [id, edits, res.data]
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

export const filterProducts = (filter) => {
    return {
        type: FILTER_PRODUCTS,
        payload: filter
    }
};

export const setProductsLoading = () => {
    return {
        type: PRODUCTS_LOADING
    }
};

export const callLoaded = (bool) => {
    return {
        type: CALL_LOADED,
        payload: bool
    }
};