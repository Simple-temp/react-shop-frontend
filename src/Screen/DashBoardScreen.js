import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS_ORDER":
            return { ...state, orders: action.payload, loading: false }
        // case "FETCH_SUCCESS_USER":
        //     return { ...state, users: action.payload, loading: false }
        // case "FETCH_SUCCESS_PRODUCTS":
        //     return { ...state, products: action.payload, loading: false }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const DashBoardScreen = () => {

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
    })

    const [users, setUsers] = useState([])
    const [products, setproducts] = useState([])

    useEffect(() => {

        const fetchOrder = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const { data } = await axios.get("https://shop-dwhw.onrender.com/api/orders")
                dispatch({ type: "FETCH_SUCCESS_ORDER", payload: data })
                console.log(data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err })
                toast.error("Data not loaded")
            }
        }
        fetchOrder()

        const fetchProducts = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get("https://shop-dwhw.onrender.com/api/products",)
                setproducts(result.data)
                console.log(result.data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
                toast.error("Data not loaded")
            }
        }
        fetchProducts()

        const fetchUser = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" })
                const { data } = await axios.get("https://shop-dwhw.onrender.com/api/users/")
                setUsers(data)
                console.log(data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
                toast.error("Data not loaded")
            }

        }
        fetchUser()

    }, [])

    return (
        <div className='container'>
            <h3 className='text-center my-3'>Dashboard</h3>
            {
                loading ? <div className='loading'><LoadingBox/> </div>
                    : error ? <MessageBox variant="danger">{error}</MessageBox>
                        : <Row>
                            <Col md={6}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Total selling price</Card.Title>
                                    <strong>${orders.reduce((a, c) => a + c.totalPrice, 0)}</strong>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Total order price</Card.Title>
                                    <strong>${orders.reduce((a, c) => a + c.totalPrice, 0)}</strong>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Total users</Card.Title>
                                    {users.length - 1}
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Total Products</Card.Title>
                                    {products.length}
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Total Orders</Card.Title>
                                    {orders.length}
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Delivered Items</Card.Title>
                                    Comming soon with better way
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Not Delivered Items</Card.Title>
                                    Comming soon with better way
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Total Paid</Card.Title>
                                    Comming soon with better way
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className='text-center my-3 p-3'>
                                    <Card.Title>Not Paid</Card.Title>
                                    Comming soon with better way
                                </Card>
                            </Col>
                        </Row>
            }
        </div>
    );
};

export default DashBoardScreen;