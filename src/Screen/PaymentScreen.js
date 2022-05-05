import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckOutSteps from '../Components/CheckOutSteps/CheckOutSteps';
import { Store } from '../Store';

const PaymentScreen = () => {

    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart: { shippingAddress, paymentMethod } } = state

    const [paymentMethodName , setPaymentMethodName] = useState(
        paymentMethod || "PayPal"
    )

    useEffect(()=>{
        if(!shippingAddress.address){
            navigate("/shipping")
        }
    },[shippingAddress, navigate])

    const handleSubmit = (e) =>{
        e.preventDefault()
        ctxDispatch({ type : "SAVE_PAYMENT_METHOD", payload : paymentMethodName})
        localStorage.setItem("paymentMethod", paymentMethodName)
        navigate("placeorder")
    }

    return (
        <div className='container'>
            <Helmet>
                <title>Payment method</title>
            </Helmet>
            <CheckOutSteps step1 step2 step3></CheckOutSteps>
            <h3 className='text-center my-3'>Payment method</h3>
            <Form onSubmit={handleSubmit} className='signin-form'>
                <div className="mb-3">
                    <Form.Check
                    type='radio'
                    id="PayPal"
                    label="PayPal"
                    value="PayPal"
                    checked={ paymentMethodName === "PayPal" }
                    onChange={(e)=> setPaymentMethodName (e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <Form.Check
                    type='radio'
                    id="Stripe"
                    label="Stripe"
                    value="Stripe"
                    checked={ paymentMethodName === "Stripe" }
                    onChange={(e)=> setPaymentMethodName (e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <Button type='submit'>Continue</Button>
                </div>
            </Form>

        </div>
    );
};

export default PaymentScreen;