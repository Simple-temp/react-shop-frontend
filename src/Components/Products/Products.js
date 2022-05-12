import axios from 'axios';
import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../../Store';
import Rating from '../Rating/Rating';

const Products = (props) => {

    const { items } = props

    const { state, dispatch: ctxDispatch } = useContext(Store)

    const { cart: { cartItem } } = state

    const HomeAddToCart = async (item) =>{
        const existItem = cartItem.find( x => x._id === items._id )
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`https://ecomerce-00.herokuapp.com/api/products/cart/${item._id}`)
        if(data.stock < quantity){
            window.alert("Sorry, product is out of stock");
            return;
        }
        ctxDispatch( { 
            type: "ADD_TO_CART", 
            payload : {...item, quantity} } )
    }

    return (
        <Card className="col-lg-3 col-md-6 col-sm-12 ca">
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
                    {
                        items.stock === 0 ? <Button variant='light' disabled>Out of Stock</Button>
                        : <Button variant="primary" onClick={()=>HomeAddToCart(items)}>Add to cart</Button>
                    }
                </Card.Body>
            </div>
        </Card>
    )
};

export default Products;