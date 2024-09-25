import React from 'react'
import {Container} from 'react-bootstrap'
import Footer from './components/Footer'
import Header from './components/Header'
import { HashRouter as Router,Routes,Route } from 'react-router-dom'
import HomeScreen from './components/screens/HomeScreen';
import LoginScreen from './components/screens/LoginScreen'
import SignupScreen from './components/screens/SignupScreen'
import CartScreen from './components/screens/CartScreen'
import Product from './components/product';
import ProductScreen from './components/screens/ProductScreen'
import ForgetPassword_Screen from './components/screens/ForgetPassword_Screen'
import ResetPasswordScreen from './components/screens/ResetPasswordScreen'
export default function App() {
  return (
    <>
    <Router>
      {/* Header hy yee */}
      <Header/>
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
        <Route exact path="/product/:id" element={<ProductScreen/>} />
        <Route exact path="/login" element={<LoginScreen />} />
        <Route exact path="/signup" element={<SignupScreen />} />
        <Route exact path="/forgetpassword" element={<ForgetPassword_Screen/>} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordScreen/>} />
        <Route exact path="/cart/:id?" element={< CartScreen/>} />
      </Routes>
    </Router>
    </>
  )
}
