import { productsQuery } from "./queries/productsQuery.js";
import { productQuery } from "./queries/productQuery.js";


export default {
    Query: {
        products: productsQuery,
        product: productQuery
    }
};