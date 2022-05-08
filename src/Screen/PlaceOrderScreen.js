import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckOutSteps from '../Components/CheckOutSteps/CheckOutSteps';
import { Store } from '../Store';
import LoadingBox from "../Components/LoadingBox/LoadingBox"


const reducer = (state, action) => {

    switch (action.type) {
        case "CREATE_REQUEST":
            return { ...state, loading: true }
        case "CREATE_SUCCESS":
            return { ...state, loading: false }
        case "CREATE_FAIL":
            return { ...state, loading: false }
        default:
            return state;
    }

}

const PlaceOrderScreen = () => {

    const navigate = useNavigate()

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    })

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart, userInfo } = state

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100
    cart.itemPrice = round2(
        cart.cartItem.reduce((a, c) => a + c.quantity * c.price, 0)
    )
    cart.shippingPrice = cart.itemPrice > 100 ? round2(0) : round2(10)
    cart.taxPrice = round2(0.15 * cart.itemPrice)
    cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice

    const placeOrderHandler = async () => {
        try {
            dispatch({ type: "CREATE_REQUEST" })
            const { data } = await axios.post("http://localhost:5000/api/orders",
                {
                    orderItem: cart.cartItem,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemPrice: cart.itemPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    }
                }
            )
            console.log(data)
            ctxDispatch({ type: "CART_CLEAR" })
            dispatch({ type: "CREATE_SUCCESS" })
            localStorage.removeItem("cartItem")
            navigate(`/order/${data.order._id}`)
        } catch (err) {
            dispatch({ type: "CREATE_FAIL" })
            toast.error("something wrong")
        }
    }

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate("/payment")
        }
    }, [cart, navigate])

    return (
        <div className='container'>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <CheckOutSteps step1 step2 step3 step4></CheckOutSteps>
            <h3 className='text-center my-3'>Preview Order</h3>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name</strong>:{cart.shippingAddress.fullname}<br />
                                <strong>Address</strong>:{cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalcode}, {cart.shippingAddress.country}
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Name</strong>:{cart.paymentMethod}<br />
                            </Card.Text>
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Item</Card.Title>
                            <ListGroup>
                                {
                                    cart.cartItem.map(item => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <img src={item.img} alt={item.img} className="img-fluid rounded img-thumbnail" />
                                                    <Link to={`/api/products/details/${item._id}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={3}><span>{item.quantity}</span></Col>
                                                <Col md={3}>${item.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                            <Link to="/api/cart/products/">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cart.itemPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cart.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Order total</strong></Col>
                                        <Col><strong>${cart.totalPrice.toFixed(2)}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="submit"
                                            disabled={cart.cartItem.length === 0}
                                            onClick={placeOrderHandler}
                                        > Place order
                                        </Button>
                                        {
                                            loading && <LoadingBox/>
                                        }
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;