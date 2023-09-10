import { createProductMutation } from "./mutations/createProductMutation.js";
import { deleteProductMutation } from "./mutations/deleteProductMutation.js";
import { updateProductMutation } from "./mutations/updateProductMutation.js";
import { changeCategoryMutation } from "./mutations/changeCategoryMutation.js";


export default {
    Mutation: {
        createProduct: createProductMutation,
        deleteProduct: deleteProductMutation,
        updateProduct: updateProductMutation,
        changeCategory: changeCategoryMutation
    }
};