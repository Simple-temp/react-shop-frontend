import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';

const SignInScreen = () => {

    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectInUrl ? redirectInUrl : "/"

    return (
        <div>

            <Container className='signin-form'>
                <Helmet>
                    <title>Amazona</title>
                </Helmet>
                <h3 className='text-center my-3'>Sign In</h3>
                <Form>
                    <Form.Group className='mb-3' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' required></Form.Control>
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