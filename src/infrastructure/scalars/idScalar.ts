import { GraphQLScalarType, Kind } from "graphql";


export const idTypeDef = "Id";

export const idResolver = {
    [idTypeDef]: new GraphQLScalarType({
        name: idTypeDef,
        description: "An encoded id",
        serialize(value) {
            return Buffer.from(value as string).toString("base64url");
        },
        parseValue(value) {
            return Buffer.from(value as string, "base64url").toString("utf8");
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return Buffer.from(ast.value, "base64url").toString("utf8");
            }

            return "";
        }
    })
};