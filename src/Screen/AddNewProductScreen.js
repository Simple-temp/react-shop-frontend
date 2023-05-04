import axios from 'axios';
import React, { useReducer, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, loading: false, product: action.payload }
        case "FETCH_REQUEST":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const AddNewProductScreen = () => {

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ""
    })

    const [slug, setslug] = useState("")
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setdescription] = useState("")
    const [price, setprice] = useState("")
    const [quantity, setquantity] = useState("")
    const [stock, setstock] = useState("")
    const [reviews, setreview] = useState("")
    const [rating, setrating] = useState("")
    const [img, setImg] = useState("")
    const navigate = useNavigate()

    const haldleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch({ type: "FETCH_REQUEST" })
            const { data } = await axios.post(`https://shop-dwhw.onrender.com/api/products`, {
                slug,
                name,
                category,
                description,
                price,
                quantity,
                stock,
                reviews,
                rating,
                img
            })
            dispatch({ type: "FETCH_SUCCESS", payload: data })
            console.log(data)
            toast.success("Product Added")
            navigate("/admin/productlist")
        } catch (err) {
            dispatch({ type: "FETCH_REQUEST" })
            toast.error("Product do not Added")
        }

    }

    return (
        <Container className='signin-form'>
            <h3 className='text-center my-3'>Add new Product</h3>
            <Form onSubmit={haldleSubmit}>
                <Form.Group className='mb-3' controlId='slug'>
                    <Form.Label>slug</Form.Label>
                    <Form.Control type='text'
                        onChange={(e) => setslug(e.target.value)}
                        required ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' required
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='category'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control type='text' required
                        onChange={(e) => setCategory(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control type='text' required
                        onChange={(e) => setdescription(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='price'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type='number' required
                        onChange={(e) => setprice(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='Rating'>
                    <Form.Label>Qqantity</Form.Label>
                    <Form.Control type='number' required disabled
                        onChange={(e) => setquantity(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='setstock'>
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type='number' required
                        onChange={(e) => setstock(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='review'>
                    <Form.Label>Review</Form.Label>
                    <Form.Control type='number' required
                        onChange={(e) => setreview(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='Rating'>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control type='number' required
                        onChange={(e) => setrating(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3' controlId='img'>
                    <Form.Label>Img</Form.Label>
                    <Form.Control type='text' required placeholder='Enter Image Url'
                        onChange={(e) => setImg(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <div className='mb-3'>
                        <Button type="submit">Add product</Button>
                </div>
            </Form>
        </Container>
    );
};

export default AddNewProductScreen;