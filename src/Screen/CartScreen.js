import axios from 'axios';
import React, { useContext } from 'react';
import { Button, Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MessageBox from '../Components/MessageBox/MessageBox';
import { Store } from "../Store"

const CartScreen = () => {

    const navigate = useNavigate()
    
    const { state, dispatch: ctxDispatch } = useContext(Store)

    const { cart: { cartItem } } = state

    const updateAddToCart = async (item, quantity) =>{
        const { data } = await axios.get(`https://ecomerce-00.herokuapp.com/api/products/cart/${item._id}`)
        if(data.stock < quantity){
            window.alert("Sorry, product is out of stock");
            return;
        }
        ctxDispatch( { 
            type: "ADD_TO_CART", 
            payload : {...item, quantity} } )
    }

    const removeItem = (item) =>{
        ctxDispatch({ type : "CART_REMOVE_ITEM", payload : item})
    }

    const CheckOutHandler = () =>{
        navigate("/signin?redirect=/shipping")
    }

    return (
        <div className='container'>
            <Helmet>
                <title>Shopping cart</title>
            </Helmet>
            <h2 className='text-center my-4 text-capitalize'>Shopping cart</h2>
            <Row>
                <Col md={8}>
                    {
                        cartItem.length === 0 ? (
                            <MessageBox>
                                Cart is empty, <Link to="/">Go to shopping</Link>
                            </MessageBox>
                        ) : (
                            <ListGroup>
                                {
                                    cartItem.map(item => (
                                        <ListGroup.Item key={item._id}>
                                            <Row className='align-items-center'>
                                                <Col md={4}>
                                                    <img src={item.img} alt={item.img} className="img-fluid rounded img-thumbnail" />
                                                    <Link to={`/api/products/details/${item._id}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={3}>
                                                    <Button 
                                                    variant='light' 
                                                    disabled={item.quantity === 1}
                                                    onClick={()=>updateAddToCart(item, item.quantity - 1)}
                                                    >
                                                        <i className="fa-solid fa-minus"></i>
                                                    </Button>{" "}
                                                    <span>{item.quantity}</span>{" "}
                                                    <Button 
                                                    variant='light' 
                                                    disabled={item.quantity === item.stock}
                                                    onClick={()=>updateAddToCart(item, item.quantity + 1)}
                                                    >
                                                        <i className="fa-solid fa-plus"></i>
                                                    </Button>{" "}
                                                </Col>
                                                <Col md={3}>
                                                    ${item.price}
                                                </Col>
                                                <Col md={2}>
                                                    <Button 
                                                    variant='light'
                                                    onClick={()=> removeItem(item)}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        )
                    }
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h4>
                                        Subtotal ({cartItem.reduce( (a, c) => a + c.quantity, 0 )}items){" "}
                                        Price : $ {cartItem.reduce( (a, c) => a + c.price * c.quantity, 0 )}
                                    </h4>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button type="button" variant='primary' disabled={ cartItem.length === 0 } onClick={()=>CheckOutHandler()}>
                                        Proceed to Checkout
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartScreen;