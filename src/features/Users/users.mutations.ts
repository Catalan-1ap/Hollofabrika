import { loginMutation } from "./mutations/loginMutation.js";
import { refreshMutation } from "./mutations/refreshMutation.js";
import { registerMutation } from "./mutations/registerMutation.js";
import { verifyEmailMutation } from "./mutations/verifyEmailMutation.js";


export default {
	Mutation: {
		register: registerMutation,
		verifyEmail: verifyEmailMutation,
		login: loginMutation,
		refresh: refreshMutation
	}
};