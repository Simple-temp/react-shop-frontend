import React, { createContext, useReducer } from 'react';

export const Store = createContext()

const initialize = {
    cart: {
        cartItem: localStorage.getItem("cartItem")
        ? JSON.parse(localStorage.getItem("cartItem"))
        : [],
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            const newItem = action.payload
            const existItem = state.cart.cartItem.find(item => item._id === newItem._id)
            const cartItem = existItem
                ? state.cart.cartItem.map(item => item._id === existItem._id ? newItem : item)
                : [...state.cart.cartItem, newItem]
                localStorage.setItem("cartItem", JSON.stringify(cartItem))
            return { ...state, cart: { ...state.cart, cartItem } }
        case "CART_REMOVE_ITEM":
            {
                const cartItem = state.cart.cartItem.filter(item => item._id !== action.payload._id)
                localStorage.setItem("cartItem", JSON.stringify(cartItem))
                return { ...state, cart: { ...state.cart, cartItem } }
            }
        default:
            return state
    }
}

const StoreProvider = (props) => {

    const [state, dispatch] = useReducer(reducer, initialize)

    const value = { state, dispatch }

    return <Store.Provider value={value}>{props.children}</Store.Provider>
};

export default StoreProvider;