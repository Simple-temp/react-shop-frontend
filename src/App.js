import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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


function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column inner-container">
        <ToastContainer position='top-right' limit={1}  />
        <header>
          <Header />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/api/products/details/:_id" element={<ProductScreen />} />
            <Route path="/api/cart/products/" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
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
