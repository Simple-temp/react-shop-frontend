import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import StripeCheckout from 'react-stripe-checkout';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from "../Components/LoadingBox/LoadingBox"
import MessageBox from "../Components/MessageBox/MessageBox"
import { Store } from '../Store';
import { toast } from 'react-toastify';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" }
        case "FETCH_SUCCESS":
            return { ...state, loading: false, order: action.payload, error: "" }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "PAY_REQUEST":
            return { ...state, loadigPay: true }
        case "PAY_SUCCESS":
            return { ...state, loadigPay: false, successPay: true }
        case "PAY_FAIL":
            return { ...state, loadigPay: false }
        case "PAY_RESET":
            return { ...state, loadigPay: false, successPay: false }
        default:
            return state
    }
}

const OrderScreen = () => {

    const publishKey = "pk_test_51KJhEFFesKPGWiP3YH9pPx3aDpRX44wil8afCvneKe2ziTVEPoBgXnEFnanssjwK1RbAeyKbQV5kSBYGcjeOsxoB00m0ZXAjF8"
    const params = useParams()
    const { id: orderId } = params
    const navigate = useNavigate()
    const { state } = useContext(Store)
    const { userInfo } = state

    const [{ loading, order, error, loadigPay, successPay }, dispatch] = useReducer(reducer,
        {
            loading: true,
            order: {},
            error: "",
            loadigPay: false,
            successPay: false,
        }
    )

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    const createOrder = (data, actions) => {
        return actions.order
            .create(
                {
                    purchase_units: [
                        {
                            amount: { value: order.totalPrice }
                        }
                    ]
                }
            )
            .then((orderID) => {
                return orderID
            })
    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: "PAY_REQUEST" })
                const { data } = await axios.put(`https://shop-dwhw.onrender.com/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                )
                dispatch({ type: "PAY_SUCCESS", payload: data })
                toast.success("Paid Successfull")
            } catch (err) {
                dispatch({ type: "PAY_FAIL", payload: err })
                toast.error("Not paid")
            }
        })
    }

    function onError(err) {
        toast.error("Something went wrong")
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" })
                const { data } = await axios.get(`https://shop-dwhw.onrender.com/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                dispatch({ type: "FETCH_SUCCESS", payload: data })
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err })
            }
        }

        if (!userInfo) {
            navigate("/signin")
        }

        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder()
            if (successPay) {
                dispatch({ type: "PAY_RESET" })
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get("https://shop-dwhw.onrender.com/api/key/paypal", {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": clientId,
                        currency: "USD"
                    }
                })
                paypalDispatch({ type: "setLoadingStatus", value: "pending" })
            }
            loadPaypalScript()
        }

    }, [order, userInfo, orderId, navigate, paypalDispatch, successPay])

    const onToken = async (token) => {

        try {
            const { data } = await axios.put(`https://shop-dwhw.onrender.com/api/orders/${order._id}/stripe`,
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                    token,
                },
                {
                    data: {
                        amount: order.totalPrice * 100,
                        token,
                    }
                }
            )
            window.location.reload();
            if (data) {
                toast.success("Paid Successfull")
            }

        } catch (err) {
            toast.error("Not paid")
        }

    }

    return (
        <div className="container">
            {
                loading ? <LoadingBox></LoadingBox>
                    : error ? <MessageBox variant="danger">{error}</MessageBox>
                        : <div className='container'>
                            <Helmet>
                                <title>Order {orderId}</title>
                            </Helmet>
                            <h3 className=' my-3'> Order Id :{orderId} </h3>
                            <Row>
                                <Col md={8}>
                                    <Card className='mb-3'>
                                        <Card.Body>
                                            <Card.Title>Shipping</Card.Title>
                                            <Card.Text>
                                                <strong>Name</strong>:{order.shippingAddress.fullname}<br />
                                                <strong>Address</strong>:{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalcode}, {order.shippingAddress.country}
                                            </Card.Text>
                                            {
                                                order.isDelivered ? <MessageBox variant="success"> Delivered at, {order.deliveredAt} </MessageBox>
                                                    : <MessageBox variant="danger">Not Delivered</MessageBox>
                                            }
                                        </Card.Body>
                                    </Card>
                                    <Card className='mb-3'>
                                        <Card.Body>
                                            <Card.Title>Payment</Card.Title>
                                            <Card.Text>
                                                <strong>Name</strong>:{order.paymentMethod}
                                            </Card.Text>
                                            {
                                                order.isPaid ? <MessageBox variant="success"> Paid at, {order.paidAt} </MessageBox>
                                                    : <MessageBox variant="danger">Not Paid</MessageBox>
                                            }
                                        </Card.Body>
                                    </Card>
                                    <Card className='mb-3'>
                                        <Card.Body>
                                            <Card.Title>Item</Card.Title>
                                            <ListGroup>
                                                {
                                                    order.orderItem.map(item => (
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
                                                        <Col>${order.itemPrice.toFixed(2)}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Shipping</Col>
                                                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Tax</Col>
                                                        <Col>${order.taxPrice.toFixed(2)}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col><strong>Order total</strong></Col>
                                                        <Col><strong>${order.totalPrice.toFixed(2)}</strong></Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                {/* 6279e64fae2cc92c80276131 */}
                                                {
                                                    !order.isPaid && order.paymentMethod === "PayPal" && <ListGroup.Item>
                                                        {
                                                            isPending ? <LoadingBox />
                                                                : <div>
                                                                    <PayPalButtons
                                                                        createOrder={createOrder}
                                                                        onApprove={onApprove}
                                                                        onError={onError}
                                                                    />
                                                                </div>
                                                        }
                                                    </ListGroup.Item>
                                                }
                                                {
                                                    !order.isPaid && order.paymentMethod === "Stripe" && < ListGroup.Item >
                                                        <StripeCheckout
                                                            token={onToken}
                                                            stripeKey={publishKey}
                                                            name="Order total"
                                                            amount={order.totalPrice * 100}
                                                            label="Pay with Card"
                                                            currency='USD'
                                                            billingAddress
                                                            shippingAddress
                                                        />
                                                    </ListGroup.Item>
                                                }
                                                {
                                                    loadigPay && <LoadingBox />
                                                }
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div >
            }
        </div>
    );
};

export default OrderScreen;