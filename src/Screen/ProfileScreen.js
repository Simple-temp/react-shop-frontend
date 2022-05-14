import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../Store';


const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true }
        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false }
        case "UPDATE_FAIL":
            return { ...state, loadingUpdate: false }
        default:
            return state
    }
}

const ProfileScreen = () => {

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart, userInfo } = state
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState("")
    const [conPassword, setConPassword] = useState("")

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    })

    const haldleSubmit = async (e) => {
        e.preventDefault()
        dispatch({ type: "UPDATE_REQUEST" })
        if(password !== conPassword){
            toast.error(" password do not match")
            return;
        }
        try {
            const { data } = await axios.put("https://website-12.herokuapp.com/api/users/profile",
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            )
            dispatch({ type: "UPDATE_SUCCESS" })
            ctxDispatch({ type: "USER_LOGIN", payload: data })
            localStorage.setItem("userInfo",JSON.stringify(data))
            toast.success("User Updated successfully")
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL" })
            toast.error("Profile do not update")
        }
    }

    return (
        <div className='signin-form'>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h3 className='text-center my-3'>User Profile</h3>
            <Form onSubmit={haldleSubmit}>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='text' required value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='email' required value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' required onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' required onChange={(e) => setConPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <div className='mb-3'>
                    <Button type="submit">Update</Button>
                </div>
            </Form>
        </div>
    );
};

export default ProfileScreen;