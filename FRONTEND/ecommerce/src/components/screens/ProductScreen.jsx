import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Form, Container, Breadcrumb } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProductsDetails } from '../../actions/productActions';
import Rating from '../Rating';
import Loader from '../Loader';
import Message from '../Message';
import ButtonBack from '../ButtonBack';

function ProductScreen() {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const productDetails = useSelector((state) => state.productDetails);
    const { error, loading, product } = productDetails;
    const [qty, setQty] = useState('1');

    useEffect(() => {
        dispatch(listProductsDetails(id));
    }, [dispatch, id]);

    const addtocartHandle = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    };

    return (
        <Container className="product-screen">
            <Breadcrumb className="mt-3">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{product.productname}</Breadcrumb.Item>
            </Breadcrumb>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Row>
                    <Col md={6} className="d-flex justify-content-center">
                        <div className="image-zoom-container">
                            <Image
                                src={`http://127.0.0.1:8000${product.image}`}
                                alt={product.productname}
                                fluid
                                className="product-image"
                            />
                        </div>
                    </Col>

                    <Col md={6}>
                        <ListGroup variant="flush" className="shadow-lg p-4 bg-white rounded product-details">
                            <ListGroup.Item className="text-center product-title">
                                <h3>{product.productname}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <i>Brand: <b>{product.productbrand}</b></i>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating
                                    value={product.rating}
                                    text={`${product.rating} from ${product.reviews} Reviews`}
                                    color={"#f8e825"}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <b>Price:</b> <span className="product-price">{product.price} Rs</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <b>Description:</b> {product.productinfo}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h5 className={product.stockcount > 0 ? "text-success" : "text-danger"}>
                                    {product.stockcount > 0 ? "In Stock" : "Out of Stock"}
                                </h5>
                            </ListGroup.Item>
                            {product.stockcount > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col xs="auto">
                                            <Form.Control
                                                as="select"
                                                value={qty}
                                                onChange={(e) => setQty(e.target.value)}
                                            >
                                                {[...Array(product.stockcount).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <Button
                                    className="btn-block btn-primary"
                                    disabled={product.stockcount === 0}
                                    onClick={addtocartHandle}
                                >
                                    Add to Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default ProductScreen;
