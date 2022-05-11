import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, loading: false, product: action.payload }
        case "FETCH_FAIL":
            return { ...state, loading: true, error: action.payload }
        case "UPDATE_REQUEST":
            return { ...state, loading: true }
        case "UPDATE_SUCCESS":
            return { ...state, loading: false, product: action.payload }
        case "UPDATE_FAIL":
            return { ...state, loading: true, error: action.payload }
        default:
            return state
    }
}

const ProductEditScreen = () => {

    const params = useParams()

    const { id } = params

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ""
    })

    const [img, setImg] = useState("")
    const [name, setName] = useState("")
    const [description, setdescription] = useState("")
    const [rating, setrating] = useState("")
    const [reviews, setreviews] = useState("")
    const [price, setprice] = useState("")


    useEffect(() => {

        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" })
                const { data } = await axios.get(`https://store00-1.herokuapp.com/api/products/edit/${id}`)
                dispatch({ type: "FETCH_SUCCESS", payload: data })
                console.log(data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
            }
        }
        fetchData()

    }, [])


    const haldleSubmit = async (e, id) => {

        e.preventDefault()
        try {
            dispatch({ type: "UPDATE_REQUEST" })
            const { data } = await axios.put(`https://store00-1.herokuapp.com/api/products/update/${id}`,
                {
                    img,
                    name,
                    description,
                    rating,
                    reviews,
                    price,
                }
            )
            dispatch({ type: "UPDATE_SUCCESS", payload: data })
            toast.success("Product Updated ")
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: err.message })
            toast.error("Product do not update")
        }

    }

    return (
        <div className='container'>
            <Container className='signin-form'>
                <Helmet>
                    <title>Edit Product</title>
                </Helmet>
                <h3 className='text-center my-3'>Edit Product</h3>
                {
                    loading ? <LoadingBox />
                        :
                        error ? <MessageBox variant="danger">{error}</MessageBox>
                            : <Form onSubmit={(e) => haldleSubmit(e, id)}>
                                <Form.Group className='mb-3' controlId='slug'>
                                    <Form.Label>Img</Form.Label>
                                    <Form.Control type='text' placeholder='Enter Image Url'
                                        onChange={(e) => setImg(e.target.value)}
                                        required defaultValue={product.img}></Form.Control>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type='text' required
                                        onChange={(e) => setName(e.target.value)}
                                        defaultValue={product.name}></Form.Control>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='description'>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type='text' required
                                        onChange={(e) => setdescription(e.target.value)}
                                        defaultValue={product.description}></Form.Control>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='Rating'>
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control type='number' required
                                        onChange={(e) => setrating(e.target.value)}
                                        defaultValue={product.rating}></Form.Control>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='Reviews'>
                                    <Form.Label>Reviews</Form.Label>
                                    <Form.Control type='number' required
                                        onChange={(e) => setreviews(e.target.value)}
                                        defaultValue={product.reviews}></Form.Control>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='price'>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type='number' required
                                        onChange={(e) => setprice(e.target.value)}
                                        defaultValue={product.price}></Form.Control>
                                </Form.Group>
                                <div className='mb-3'>
                                    <Button type="submit">Update product</Button>
                                </div>
                            </Form>
                }
            </Container>
        </div>
    );
};

export default ProductEditScreen;