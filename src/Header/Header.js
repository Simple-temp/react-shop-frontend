import React, { useContext } from 'react'
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Store } from '../Store'

const Header = () => {

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart, userInfo } = state

    const signoutHandler = () => {
        ctxDispatch({ type: "SIGNOUT_USER" })
        localStorage.removeItem("userInfo")
        localStorage.removeItem("shippingAddress")
        localStorage.removeItem("paymentMethod")
    }

    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand> <Link to="/" className='link'>amazon</Link> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="">
                        <Link to="/" className='link'>Home</Link>
                        <Link to="/" className='link'>Products</Link>
                        <Link to="/api/cart/products/" className='link'>
                            Cart
                            {
                                cart.cartItem.length > 0 && (
                                    <Badge pill bg="danger">
                                        {cart.cartItem.reduce((a, c) => a + c.quantity, 0)}
                                    </Badge>
                                )
                            }
                        </Link>
                        {
                            userInfo
                                ? (<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item> User Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/orderhistory">
                                        <NavDropdown.Item> Order History</NavDropdown.Item>
                                    </LinkContainer>
                                    <Link className='dropdown-item' to="#signout" onClick={() => signoutHandler()}>
                                        Sign out
                                    </Link>
                                </NavDropdown>)
                                :
                                <Link to="/signin" className='link'>Sign in</Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default Header