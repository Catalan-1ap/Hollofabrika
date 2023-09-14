import { createProductMutation } from "./mutations/createProductMutation.js";
import { updateProductMutation } from "./mutations/updateProductMutation.js";
import { changeCategoryMutation } from "./mutations/changeCategoryMutation.js";


export default {
    Mutation: {
        createProduct: createProductMutation,
        updateProduct: updateProductMutation,
        changeCategory: changeCategoryMutation
    }
};