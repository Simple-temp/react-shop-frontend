import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';
import Rating from '../Components/Rating/Rating';
import { Store } from '../Store';


const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const prices = [
    {
        name: "$1 to $50",
        value: "1-50"
    },
    {
        name: "$51 to $200",
        value: "51-200"
    },
    {
        name: "$201 to $1000",
        value: "201-1000"
    },
]

const ratings = [
    {
        name: "4starts & up",
        rating: "4"
    },
    {
        name: "3starts & up",
        rating: "3"
    },
    {
        name: "2starts & up",
        rating: "2"
    },
    {
        name: "1starts & up",
        rating: "1"
    },
]

const SearchScreen = () => {

    const navigate = useNavigate()
    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const category = sp.get("category") || "all"
    const query = sp.get("query") || "all"
    const price = sp.get("price") || "all"
    const rating = sp.get("rating") || "all"
    const order = sp.get("order") || "newest"
    const page = sp.get("page") || 1


    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {

                const { data } = await axios.get(
                    `https://website-12.herokuapp.com/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                )
                dispatch({ type: "FETCH_SUCCESS", payload: data })

            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err })
                toast.error("Search not found")
            }
        }
        fetchData()
    }, [category, error, order, page, price, query, rating])

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`https://website-12.herokuapp.com/api/products/categories`)
                // console.log(data)
                setCategories(data)
            } catch (err) {
                // toast.error("Category not found")
            }
        }
        fetchCategories()
    }, [dispatch])

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page
        const filterCategory = filter.category || category
        const filterQuery = filter.query || query
        const filterRating = filter.rating || rating
        const filterPrice = filter.price || price
        const filterOrder = filter.order || order
        return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`
    }

    const { state, dispatch: ctxDispatch } = useContext(Store)

    const { cart: { cartItem } } = state

    const HomeAddToCart = async (item) =>{
        const existItem = cartItem.find( x => x._id === products._id )
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`https://website-12.herokuapp.com/api/products/cart/${item._id}`)
        if(data.stock < quantity){
            window.alert("Sorry, product is out of stock");
            return;
        }
        ctxDispatch( { 
            type: "ADD_TO_CART", 
            payload : {...item, quantity} } )
    }


    return (
        <div className='container'>
            <Helmet>
                <title>Search Products</title>
            </Helmet>
            <Row>
                <Col md={3}>
                    <h3>Depertment</h3>
                    <div>
                        <ul>
                            <li>
                                <Link className={"all" === category ? "text-bold" : ""} to={getFilterUrl({ category: "all" })}>Any</Link>
                            </li>
                            {
                                categories.map(c => (
                                    <li key={c}>
                                        <Link className={c === category ? "text-bold" : ""} to={getFilterUrl({ category: c })}>{c}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h3>Price</h3>
                        <ul>
                            <li>
                                <Link className={"all" === price ? "text-bold" : ""} to={getFilterUrl({ price: "all" })}>Any</Link>
                            </li>
                            {
                                prices.map(p => (
                                    <li key={p.value}>
                                        <Link className={p.value === price ? "text-bold" : ""} to={getFilterUrl({ price: p.value })}>{p.name}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div>
                        <h3>Avg customer review</h3>
                        <ul>
                            {
                                ratings.map(r => (
                                    <li key={r.name}>
                                        <Link className={`${r.rating}` === `${rating}` ? "text-bold" : ""} to={getFilterUrl({ rating: r.rating })}>
                                            <Rating caption={" & up"} rating={r.rating}></Rating>
                                        </Link>
                                    </li>
                                ))
                            }
                            <li>
                                <Link className={"all" === rating ? "text-bold" : ""} to={getFilterUrl({ rating: "all" })}>
                                    <Rating caption={" & up"} rating={0}></Rating>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {
                        loading ? <LoadingBox></LoadingBox>
                            : error ? <MessageBox variant="danger">{error}</MessageBox>
                                : (
                                    <>
                                        <Row className='justify-content-between mb-3'>
                                            <Col md={6}>
                                                <div>
                                                    {countProducts === 0 ? "No" : countProducts} Result
                                                    {query !== "all" && " : " + query}
                                                    {category !== "all" && " : " + category}
                                                    {price !== "all" && " : price" + price}
                                                    {rating !== "all" && " : rating" + rating + " & up"}
                                                    {query !== "all" ||
                                                        category !== "all" ||
                                                        rating !== "all" ||
                                                        price !== "all" ? (

                                                        <Button variant='light' onClick={() => navigate("/search")}>
                                                            <i className='fas fa-times-circle'></i>
                                                        </Button>

                                                    ) : null
                                                    }

                                                </div>
                                            </Col>
                                            <Col className='text-end'>
                                                Sort by {' '}
                                                <select value={order}
                                                    onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
                                                >
                                                    <option value="newest">Newest Arrivals</option>
                                                    <option value="lowest">Price Low to High</option>
                                                    <option value="highest">Price Hig to Low</option>
                                                    <option value="toprated">Avg customer reviews</option>
                                                </select>
                                            </Col>
                                        </Row>
                                        {products.length === 0 && (
                                            <MessageBox>No Product Found</MessageBox>
                                        )}
                                        <Row>
                                            {
                                                products.map(product => (
                                                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                                        <div className="items m-2 p-3">
                                                            <Link to={`/api/products/details/${product._id}`}>
                                                                <Card.Img variant="top" src={product.img} alt={product.img} className="d-block mx-auto img-fluid" style={{ height: "263px" }} />
                                                            </Link>
                                                            <Card.Body>
                                                                <Link to={`/api/products/details/${product._id}`}>
                                                                    <Card.Title>{product.name}</Card.Title>
                                                                </Link>
                                                                <Card.Text>{product.description}</Card.Text>
                                                                <Rating reviews={product.reviews} rating={product.rating} />
                                                                <Card.Text>
                                                                    <span> Price: <strong>${product.price}</strong> </span>
                                                                </Card.Text>
                                                                {
                                                                    product.stock === 0 ? <Button variant='light' disabled>Out of Stock</Button>
                                                                        : <Button variant="primary" onClick={() => HomeAddToCart(product)}>Add to cart</Button>
                                                                }
                                                            </Card.Body>
                                                        </div>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        <div>
                                            {
                                                [...Array(pages).keys()].map(x => (

                                                    <LinkContainer key={x + 1} className="mx-1" to={getFilterUrl({ page: x + 1 })}>
                                                        <Button variant='light' className={Number(page) === x + 1 ? "text-bold" : ""}>
                                                            {x + 1}
                                                        </Button>
                                                    </LinkContainer>

                                                )
                                                )

                                            }
                                        </div>
                                    </>
                                )
                    }
                </Col>
            </Row>

        </div>
    );
};

export default SearchScreen;