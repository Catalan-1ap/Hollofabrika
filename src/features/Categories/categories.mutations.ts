import { createCategoryMutation } from "./mutations/createCategoryMutation.js";
import { deleteCategoryMutation } from "./mutations/deleteCategoryMutation.js";
import { updateCategoryMutation } from "./mutations/updateCategoryMutation.js";


export default {
    Mutation: {
        createCategory: createCategoryMutation,
        deleteCategory: deleteCategoryMutation,
        updateCategory: updateCategoryMutation
    }
};