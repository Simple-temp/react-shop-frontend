import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import { Store } from '../Store';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, users: action.payload, loading: false }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}


const UserListScreen = () => {

    const { state } = useContext(Store)
    const { userInfo } = state


    const [{ loading, error, users }, dispatch] = useReducer(reducer, {
        loading: true,
        error: "",
    })

    useEffect(() => {

        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const { data } = await axios.get("https://store00-1.herokuapp.com/api/users",
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



    const handleRemove = async (id) => {
        try {
            const { data } = await axios.delete(`https://store00-1.herokuapp.com/api/users/${id}/delete`,
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            )
            window.location.reload();
            if (data) {
                toast.success("Delete Successfull")
            }

        } catch (err) {
            toast.error("Not delete")
        }
    }


    return (
        <div className="container">
            {
                loading ? <LoadingBox></LoadingBox>
                    : error ? <MessageBox variant="danger">{error}</MessageBox>
                        : <div className='container'>
                            <Helmet>
                                <title>User list</title>
                            </Helmet>
                            <h3 className='text-center my-3'>User list ({users.length - 1})</h3>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>USER-ID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>CREATED-AT</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            {
                                                !user.isAdmin && (
                                                    <>
                                                        <td data-label="USER-ID">{user._id}</td>
                                                        <td data-label="NAME">{user.name}</td>
                                                        <td data-label="EMAIL">{user.email}</td>
                                                        <td data-label="CREATED-AT">{user.createdAt.substring(0, 10)}</td>
                                                        <td data-label="ACTION">
                                                            <Button variant="outline-danger" onClick={() => handleRemove(user._id)}><i className="fa-solid fa-trash-can"></i></Button>
                                                        </td>
                                                    </>
                                                )
                                            }
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

export default UserListScreen;