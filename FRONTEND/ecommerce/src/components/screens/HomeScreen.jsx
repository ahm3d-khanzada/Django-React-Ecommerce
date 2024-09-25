import React, { useState, useEffect } from 'react';
import { Container, Row, Col,Card} from 'react-bootstrap';
import axios from 'axios';
import Product from '../product';
import { listProducts } from '../../actions/productActions';
import { useDispatch , useSelector } from 'react-redux';
import Loader from '../Loader';
import Message from '../Message';

function HomeScreen() {
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.productsList);
  const { error , loading, products } = productsList;
  
  useEffect(()=> {
    dispatch(listProducts())
  },[dispatch]);
    

  return (
<Container>
  <br />
  <h1>My Products</h1>
  {loading ? (
    <Loader/> // Display loading state if `loading` is true.
  ) : error ? (
    <Message variant='danger'>{error}</Message> // Display error message if `error` is true.
  ) : (
    <Row>
      {products && products.length > 0 ? ( // Check if products exist and have a length greater than 0.
        products.map((product) => (
          <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))
      ) : (
        <p>No products available.</p> // Display message if there are no products, only when loading is false and error is false.
      )}
    </Row>
  )}
</Container>
  );
  
}

export default HomeScreen;
