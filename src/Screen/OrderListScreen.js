import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import { Store } from '../Store';
import Modal from 'react-modal';

const customStyles = {
    content: {
        height: "250px",
        width: "340px",
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

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

const OrderListScreen = () => {

    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
    })

    const [user, setUser] = useState([])

    useEffect(() => {

        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const { data } = await axios.get(" https://website-12.herokuapp.com/api/orders",
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

        const fetchUser = async () => {
            try {
                const { data } = await axios.get(" https://website-12.herokuapp.com/api/users/",
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                )
                setUser(data)
            } catch (err) {
                toast.error("Data not loaded")
            }

        }
        fetchUser()

    }, [userInfo])



    const handleRemove = async (id) => {
        try {
            const { data } = await axios.delete(`https://website-12.herokuapp.com/api/orders/${id}/delete`,
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            )
            if (data) {
                toast.success("Delete Successfull")
            }
            window.location.reload();

        } catch (err) {
            toast.error("Not delete")
        }
    }


    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleDelivered = async (id) => {
        try {

            const { data } = await axios.put(`https://website-12.herokuapp.com/api/orders/${id}/delireved`,
                { headers: { authorization: `Bearer ${userInfo.token}` }, }
            )
            if (data) {
                toast.success("Delivered Successfull")
            }
            window.location.reload();
            console.log(id)

        } catch (err) {
            console.log(err.message)
            toast.error("Not Delivered")
        }
    }

    return (
        <div className="container">
            {
                loading ? <div className='loading'><LoadingBox/> </div>
                    : error ? <MessageBox variant="danger">{error}</MessageBox>
                        : <div className='container'>
                            <Helmet>
                                <title>Order list</title>
                            </Helmet>
                            <h3 className='text-center my-3'>Order list ({orders.length})</h3>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th>DETAILS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (

                                        <tr key={order._id}>
                                            <td data-label="ID">Order-Id: {order._id}</td>
                                            <td data-label="NAME">
                                                {
                                                    user.map(u => <p key={u._id}>{
                                                        u._id === order.user && <span className='text-capitalize'>Username: {u.name}</span>
                                                    }</p>)
                                                }
                                            </td>
                                            <td data-label="DATE">{order.createdAt.substring(0, 10)}</td>
                                            <td data-label="TOTAL">${order.totalPrice.toFixed(2)}</td>
                                            <td data-label="PAID">{order.isPaid ? <Button variant="outline-success">Paid at {order.paidAt.substring(0, 10)}</Button> : <Button variant="outline-danger">Not Paid</Button>}</td>
                                            <td data-label="DELIVERED">
                                                <Button variant={order.isDelivered ? `outline-success` : `outline-dark`} onClick={() => handleDelivered(order._id)}>
                                                    {
                                                        order.isDelivered ? `Delivered at,${order.deliveredAt.substring(0, 10)}` : "Click to Delivered"
                                                    }
                                                </Button>
                                            </td>
                                            <td data-label="DETAILS">
                                                <Button type="button" variant="outline-secondary" onClick={() => navigate(`/order/${order._id}`)}>
                                                    Details
                                                </Button>
                                            </td>
                                            <td data-label="ACTION">
                                                <Modal
                                                    isOpen={modalIsOpen}
                                                    onRequestClose={closeModal}
                                                    style={customStyles}
                                                >
                                                    <h4 className='text-center mt-5'>Are you sure ?</h4>
                                                    <div className='confirm-box__actions mt-3'>
                                                        <button onClick={() => handleRemove(order._id)} className="outline-success">Confirm</button>
                                                        <button onClick={closeModal} className="outline-danger">Cancel</button>
                                                    </div>
                                                </Modal>
                                                <Button variant="outline-danger" onClick={openModal}>
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </Button>
                                            </td>
                                        </tr>

                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
            }
        </div>
    );
};

export default OrderListScreen;