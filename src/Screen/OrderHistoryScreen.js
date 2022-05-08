import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import { Store } from '../Store';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, orders: action.payload, loading: false }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const OrderHistoryScreen = () => {

    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
    })

    useEffect(() => {

        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const { data } = await axios.get("http://localhost:5000/api/orders/mine",
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                )
                dispatch({ type: "FETCH_SUCCESS", payload: data })
                console.log(data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err })
                toast.error("Data not loaded")
            }
        }
        fetchData()

    }, [userInfo])



    return (
        loading ? <LoadingBox></LoadingBox>
            : error ? <MessageBox variant="danger">{error}</MessageBox>
                : <div className='container'>
                    <Helmet>
                        <title>Preview Order</title>
                    </Helmet>
                    <h3 className='text-center my-3'>Order history</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                                    <td>{
                                        order.isDelivered
                                            ? order.deliveredAt.substring(0, 10)
                                            : "No"
                                    }
                                    </td>
                                    <td>
                                        <Button type="button" variant="light" onClick={() => navigate(`/order/${order._id}`)}>
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
    );
};

export default OrderHistoryScreen;