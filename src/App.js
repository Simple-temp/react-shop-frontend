import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import HomeScreen from './Screen/HomeScreen';
import ProductScreen from './Screen/ProductScreen';
import CartScreen from "./Screen/CartScreen";
import SignInScreen from './Screen/SignInScreen';


function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column inner-container">
        <header>
          <Header />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/api/products/details/:slug" element={<ProductScreen />} />
            <Route path="/api/cart/products/" element={<CartScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
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
