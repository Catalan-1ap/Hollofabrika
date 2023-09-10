import type { CodegenConfig } from "@graphql-codegen/cli";


const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3333/graphql",
  generates: {
      "src/infrastructure/types/gqlTypes.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        scalars: {
            JSONObject: "Record<string, any>",
            Id: "string",
            Upload: "{" +
                "file: Promise<{\n" +
                "  filename: string;\n" +
                "  mimetype: string;\n" +
                "  encoding: string;\n" +
                "  createReadStream(): ReadStream;\n" +
                "}>" +
                "}"
        },
        typesPrefix: "Gql",
        maybeValue: "T | undefined",
        nonOptionalTypename: false,
        skipTypename: true
      }
    }
  }
};

export default config;