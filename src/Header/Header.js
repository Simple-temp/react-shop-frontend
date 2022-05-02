import React, { useContext } from 'react'
import { Badge, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { Store } from '../Store'

const Header = () => {

    const {state } = useContext(Store)
    const { cart } = state

    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand> <Link to="/" className='link'>amazon</Link> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="">
                        <NavLink to="/" className='link'>Home</NavLink>
                        <NavLink to="/" className='link'>Products</NavLink>
                        <NavLink to="/api/cart/products/" className='link'>
                            Cart
                            {
                                cart.cartItem.length > 0 && (
                                    <Badge pill bg="danger">
                                        {cart.cartItem.reduce((a, c) => a + c.quantity, 0)}
                                    </Badge>
                                )
                            }
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header