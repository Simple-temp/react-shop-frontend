import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';

const SignInScreen = () => {

    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectInUrl ? redirectInUrl : "/"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state

    const haldleSubmit = async (e) => {
        e.preventDefault()
        try {

            const { data } = await axios.post("https://shop-dwhw.onrender.com/api/users/signin", {
                email,
                password
            })
            ctxDispatch({ type: "USER_LOGIN", payload: data })
            localStorage.setItem("userInfo", JSON.stringify(data))
            navigate(redirect || "/")
            console.log(data)

        } catch (err) {
            console.log(err.message)
            toast.error("Invalid email and password")
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    return (
        <div>

            <Container className='signin-form'>
                <Helmet>
                    <title>Sign In</title>
                </Helmet>
                <h3 className='text-center my-3'>Sign In</h3>
                <Form onSubmit={haldleSubmit}>
                    <Form.Group className='mb-3' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' required onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' required onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <div className='mb-3'>
                        <Button type="submit">Sign in</Button>
                    </div>
                    <div className='mb-3'>
                        New customer? {" "}
                        <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                    </div>
                </Form>
            </Container>

        </div>
    );
};

export default SignInScreen;