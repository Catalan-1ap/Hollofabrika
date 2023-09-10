import { GraphQLError, GraphQLFormattedError } from "graphql/index.js";
import { GqlError, GqlErrorCode } from "./types/gqlTypes.js";


export function makeApplicationError(message: string, code: GqlErrorCode) {
    return new GraphQLError(message, {
        extensions: {
            type: "ApplicationError",
            code: code
        }
    });
}


export const formatErrorHandler: (
    formattedError: GraphQLFormattedError,
    error: unknown,
) => any = (formattedError, error) => {
    if (error instanceof GraphQLError && error.extensions.type === "ApplicationError") {
        return {
            message: error.message,
            code: error.extensions.code as GqlErrorCode
        } satisfies GqlError;
    }

    console.error("Unhandled, undocumented error occured", error);

    if (process.env.NODE_ENV === "development" && error instanceof GraphQLError)
        return {
            message: error.message,
            code: GqlErrorCode.InternalError
        } satisfies GqlError;

    return {
        message: "UndocumentedError",
        code: GqlErrorCode.InternalError
    } satisfies GqlError;
};