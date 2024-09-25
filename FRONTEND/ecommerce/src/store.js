import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';  // Import without curly braces
import { composeWithDevTools } from 'redux-devtools-extension';
import { productsListReducers, productDetailsReducers } from './reducers/productReducer';
import { userSignupReducer, userSigninReducer, forgotPasswordReducer, resetPasswordReducer } from './reducers/UserReducer';
import { cartReducer } from './reducers/CartReducer';

const reducers = combineReducers({
  productsList: productsListReducers,       // products
  productDetails: productDetailsReducers,   // product
  userSignin: userSigninReducer,            // user signin
  userSignup: userSignupReducer,            // user signup
  cart: cartReducer,                        // cart
  userForgotPassword: forgotPasswordReducer, // forgot password
  resetPassword: resetPasswordReducer,      // reset password
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
  cart: { cartItems: cartItemsFromStorage },  // cart items from local storage or initial state
};

const middleware = [thunk];

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
