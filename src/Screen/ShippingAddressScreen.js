import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckOutSteps from '../Components/CheckOutSteps/CheckOutSteps';
import { Store } from '../Store';

const ShippingAddressScreen = () => {

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { shippingAddress }, userInfo } = state

    const [fullname, setFullname] = useState(shippingAddress.fullname || "")
    const [address, setAddress] = useState(shippingAddress.address || "")
    const [city, setCity] = useState(shippingAddress.city || "")
    const [postalcode, setPostalCode] = useState(shippingAddress.postalcode || "")
    const [country, setCountry] = useState(shippingAddress.country || "")
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate("/signin?redirect=/shipping")
        }
    }, [userInfo, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        ctxDispatch({
            type: "SAVE_SHIPPING_ADDRESS",
            payload: {
                fullname,
                address,
                city,
                postalcode,
                country
            }
        })
        localStorage.setItem(
            "shippingAddress",
            JSON.stringify({
                fullname,
                address,
                city,
                postalcode,
                country
            })
        )
        navigate("/payment")
    }

    return (
        <div className='container'>
            <Helmet>
                <title>Shipping</title>
            </Helmet>
            <CheckOutSteps step1 step2></CheckOutSteps>
            <h3 className='text-center my-3'>Shipping Address</h3>
            <div className="row">
                <div className="col-lg-6 col-md-6 col-12 mx-auto">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPstCode">
                            <Form.Label>PostalCode</Form.Label>
                            <Form.Control type="text" value={postalcode} onChange={(e) => setPostalCode(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ShippingAddressScreen;