import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import Products from '../Components/Products/Products';
import Rating from '../Components/Rating/Rating';
import { Store } from '../Store';

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, loading: false, products: action.payload }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const ProductListScreen = () => {

    const navigate = useNavigate()
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: ""
    })

    useEffect(() => {

        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get("https://store00-1.herokuapp.com/api/products",)
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
                console.log(result.data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
                console.log(err)
            }
        }
        fetchData()

    }, [])

    return (
        <div className='container'>
            <Helmet>
                <title>Products list</title>
            </Helmet>
            <Row>
                {
                    loading ? <LoadingBox />
                        :
                        error ? <MessageBox variant="danger">{error}</MessageBox>
                            : products.map(items =>(
                            <Col md={6} lg={3} key={items._id}>
                                <Card>
                                    <div className="items m-2 p-3">
                                        <Link to={`/api/products/details/${items._id}`}>
                                            <Card.Img variant="top" src={items.img} alt={items.img} className="d-block mx-auto img-fluid" style={{ height: "263px" }} />
                                        </Link>
                                        <Card.Body>
                                            <Link to={`/api/products/details/${items._id}`}>
                                                <Card.Title>{items.name}</Card.Title>
                                            </Link>
                                            <Card.Text>{items.description}</Card.Text>
                                            <Rating reviews={items.reviews} rating={items.rating} />
                                            <Card.Text>
                                                <span> Price: <strong>${items.price}</strong> </span>
                                            </Card.Text>
                                        </Card.Body>
                                        <Button variant='outline-dark' onClick={()=>navigate(`/admin/productedit/${items._id}`)} >Edit</Button>
                                    </div>
                                </Card>
                            </Col>
                            ))
                }
            </Row>
        </div>
    );
};

export default ProductListScreen;