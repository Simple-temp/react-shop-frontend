import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import HomeScreen from './Screen/HomeScreen';
import ProductScreen from './Screen/ProductScreen';
import CartScreen from "./Screen/CartScreen";
import SignInScreen from './Screen/SignInScreen';
import ShippingAddressScreen from './Screen/ShippingAddressScreen';
import SignUpScreen from './Screen/SignUpScreen';
import PaymentScreen from './Screen/PaymentScreen';
import PlaceOrderScreen from './Screen/PlaceOrderScreen';
import OrderScreen from './Screen/OrderScreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import ProfileScreen from './Screen/ProfileScreen';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';


function App() {

  const [sideBarIsOpen, setSideBarIsOpen] = useState(false)

  const [categories, setCategories] = useState([])

  useEffect(()=>{
    const fetchCategories = async () =>{
      try{
        const { data } = await axios.get(`http://localhost:5000/api/products/categories`)
        console.log(data)
        setCategories(data)
      }catch(err){
        // toast.error("Category not found")
      }
    }
    fetchCategories()
  },[])

  return (
    <BrowserRouter>
      <div className={
        sideBarIsOpen ? "d-flex flex-column inner-container active-count"
        : "d-flex flex-column inner-container"
        }>
        <ToastContainer position='top-right' limit={1}  />
        <header>
          <Header sideBarIsOpen={sideBarIsOpen} setSideBarIsOpen={setSideBarIsOpen}/>
        </header>
        <div className={
          sideBarIsOpen ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-cloumn"
           : "side-navbar d-flex justify-content-between flex-wrap flex-cloumn"
        }>

          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {
              categories.map(category => (
                <Nav.Item key={category}>
                  <LinkContainer to={`/search?category=${category}`} onClick={()=>setSideBarIsOpen(false)}>
                    <Nav.Link> <strong className='text-capitalize'>{category}</strong> </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))
            }
          </Nav>

        </div>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/api/products/details/:_id" element={<ProductScreen />} />
            <Route path="/api/cart/products/" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/orderhistory" element={<OrderHistoryScreen />} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
