export const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, products: action.payload };
        case "FETCH_FAIL":
            return { ...state, loading: true, error: action.payload };
        default:
            return state
    }
}


