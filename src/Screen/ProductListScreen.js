import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Card, Col, Form, FormControl, Row, InputGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import Rating from '../Components/Rating/Rating';
import Modal from 'react-modal';

const customStyles = {
    content: {
        height: "250px",
        width: "340px",
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

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

    const [inputdata, setInputdata] = useState("")
    const [outputdata, setOutputdata] = useState([])
    const navigate = useNavigate()
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: ""
    })

    useEffect(()=>{
        setOutputdata([])
        products.filter( val => {
            if(val.name.toLowerCase().includes(inputdata.toLowerCase()))
            {
                setOutputdata( outputdata=>[...outputdata, val] )
            }
        } )
    },[inputdata])

    useEffect(() => {

        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get("https://ecomerce-00.herokuapp.com/api/products",)
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
                console.log(result.data)
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
                console.log(err)
            }
        }
        fetchData()

    }, [])

    const handleRemoveProduct = async (id) =>{
        try {
            const { data } = await axios.delete(`https://ecomerce-00.herokuapp.com/api/products/${id}/delete`,
            )
            window.location.reload();
            if (data) {
                toast.success("Delete Successfull")
            }

        } catch (err) {
            toast.error("Not delete")
        }
    }

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className='container'>
            <Helmet>
                <title>Products list</title>
            </Helmet>
            <Row>
                <div className='d-flex justify-content-between my-4'>
                    <Form>
                        <InputGroup>
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e)=>setInputdata(e.target.value)}
                            />
                        </InputGroup>
                    </Form>
                    <Button type="button" variant='outline-success' onClick={() => navigate("/admin/addnew")}>Add new product</Button>
                </div>
                {
                    loading ? <LoadingBox />
                        :
                        error ? <MessageBox variant="danger">{error}</MessageBox>
                            : outputdata.map(items => (
                                <Col md={6} lg={3} xlg={4} key={items._id}>
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
                                            <div className='d-flex justify-content-between'>
                                                <Button variant='outline-dark' onClick={() => navigate(`/admin/productedit/${items._id}`)} >Edit</Button>
                                                <Modal
                                                    isOpen={modalIsOpen}
                                                    onRequestClose={closeModal}
                                                    style={customStyles}
                                                >
                                                    <h4 className='text-center mt-5'>Are you sure ?</h4>
                                                    <div className='confirm-box__actions mt-3'>
                                                        <button onClick={() => handleRemoveProduct(items._id)} className="outline-success">Confirm</button>
                                                        <button onClick={closeModal} className="outline-danger">Cancel</button>
                                                    </div>
                                                </Modal>
                                                <Button variant='outline-danger' onClick={openModal}><i className="fa-solid fa-trash-can"></i></Button>
                                            </div>
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