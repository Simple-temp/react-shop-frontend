import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';

const SignUpScreen = () => {

    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectInUrl ? redirectInUrl : "/"

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conPassword, setConPassword] = useState("")

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state

    const haldleSubmit = async (e) => {
        e.preventDefault()
        if(password !== conPassword){
            toast.error(" password do not match")
            return;
        }
        try {

            const { data } = await axios.post("https://store00-1.herokuapp.com/api/users/signup", {
                name,
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
                    <title>Sign up</title>
                </Helmet>
                <h3 className='text-center my-3'>Sign Up</h3>
                <Form onSubmit={haldleSubmit}>
                    <Form.Group className='mb-3' controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' required onChange={(e) => setName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' required onChange={(e) => setEmail(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' required onChange={(e) => setPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='conpassword'>
                        <Form.Label>confirm Password</Form.Label>
                        <Form.Control type='password' required onChange={(e) => setConPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                    <div className='mb-3'>
                        <Button type="submit">Sign UP</Button>
                    </div>
                    <div className='mb-3'>
                        Already have an account? {" "}
                        <Link to={`/signin?redirect=${redirect}`}>sign in</Link>
                    </div>
                </Form>
            </Container>

        </div>
    );
};

export default SignUpScreen;