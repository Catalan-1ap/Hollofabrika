import { createOrderMutation } from "./mutations/createOrderMutation.js";
import { confirmOrderMutation } from "./mutations/confirmOrderMutation.js";


export default {
    Mutation: {
        createOrder: createOrderMutation,
        confirmOrder: confirmOrderMutation,
    }
};