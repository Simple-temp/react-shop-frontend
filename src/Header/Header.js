import React, { useContext } from 'react'
import { Badge, Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import SearchBox from '../Components/SearchBox/SearchBox'
import { Store } from '../Store'

const Header = ({ sideBarIsOpen, setSideBarIsOpen }) => {

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart, userInfo } = state

    const signoutHandler = () => {
        ctxDispatch({ type: "SIGNOUT_USER" })
        localStorage.removeItem("userInfo")
        localStorage.removeItem("shippingAddress")
        localStorage.removeItem("paymentMethod")
        window.location.href = "/signin"
    }

    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Button variant='dark' onClick={() => setSideBarIsOpen(!sideBarIsOpen)}>
                    <i className="fa-solid fa-bars"></i>
                </Button>
                <Navbar.Brand> <Link to="/" className='link'>Store00</Link> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <SearchBox />
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
                        {
                            userInfo  && userInfo.isAdmin &&
                                (<NavDropdown title="Admin" id="basic-nav-dropdown">
                                    <LinkContainer to="admin/dashboard">
                                        <NavDropdown.Item> Dashboard</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="admin/productlist">
                                        <NavDropdown.Item> Product List </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="admin/orderlist">
                                        <NavDropdown.Item> Orders List</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="admin/userlist">
                                        <NavDropdown.Item> User List</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>)
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default Header