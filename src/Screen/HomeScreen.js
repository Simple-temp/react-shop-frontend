import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { reducer } from '../Reducer/reducer';
import Products from '../Components/Products/Products';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Components/LoadingBox/LoadingBox';
import MessageBox from '../Components/MessageBox/MessageBox';


const HomeScreen = () => {

    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get("https://shop-dwhw.onrender.com/api/products");
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message })
            }
        }
        fetchData()
    }, [])

    return (
        <div className='container'>
            <Helmet>
                <title>Store00</title>
            </Helmet>
            <div className="row mt-4">
                {loading ? <div className='loading'><LoadingBox/> </div>
                    :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                        :
                        products.map(items => <Products items={items} key={items.name} />)
                }
            </div>
        </div>
    );
};

export default HomeScreen;