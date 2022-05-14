import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Badge, Button, Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import Rating from '../Components/Rating/Rating';
import { Store } from '../Store';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, product: action.payload };
        case "FETCH_FAIL":
            return { ...state, loading: true, error: action.payload };
        default:
            return state
    }
}

const ProductScreen = () => {

    const navigate = useNavigate()
    const params = useParams()
    const { _id } = params

    const [{ loading, error, product }, dispatch] = useReducer((reducer), {
        product: [],
        loading: true,
        error: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get(`https://website-12.herokuapp.com/api/products/details/${_id}`);
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
            }
        }
        fetchData()
    }, [_id])

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart } = state;
    const handleAddToCart = async () => {
        const existItem = cart.cartItem.find(x => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`https://website-12.herokuapp.com/api/products/cart/${product._id}`)
        if (data.stock < quantity) {
            window.alert("Sorry, product is out of stock");
            return;
        }
        ctxDispatch({
            type: "ADD_TO_CART",
            payload: { ...product, quantity }
        })
        navigate("/api/cart/products/")
    }

    return (
        <div className="container">
            {
                loading
                    ? <LoadingBox />
                    : error
                        ? <MessageBox variant="danger">{error}</MessageBox>
                        : <div className='container selected-product mt-3'>
                            <Row>
                                <Col md={6}>
                                    <img src={product.img} alt={product.img} className="img-large w-100" />
                                </Col>
                                <Col md={3}>
                                    <ListGroup variant='flush'>
                                        <Helmet>
                                            <title>
                                                {product.name}
                                            </title>
                                        </Helmet>
                                        <ListGroup.Item>
                                            <h2 className='text-capitalize'>{product.name}</h2>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Rating reviews={product.reviews} rating={product.rating} />
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <span> Price : ${product.price}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <h5>Description: </h5>
                                            <span>{product.description}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={3}>
                                    <Card>
                                        <Card.Body>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Price : </Col>
                                                        <Col>${product.price}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Status : </Col>
                                                        <Col>
                                                            {
                                                                product.stock === 0 ? <Badge bg="danger">Unavailable</Badge>
                                                                    : <Badge bg="success">In Stock {product.stock}</Badge>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                {
                                                    product.stock > 0 && <ListGroup.Item>
                                                        <div className="d-grid">
                                                            <Button variant="primary" onClick={() => handleAddToCart()}>Add to cart</Button>
                                                        </div>
                                                    </ListGroup.Item>
                                                }
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
            }
        </div>
    );
};

export default ProductScreen;