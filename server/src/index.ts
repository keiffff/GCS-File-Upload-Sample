import { ApolloServer, gql } from "apollo-server";
import { makeExecutableSchema, IResolvers } from "graphql-tools";
import { Resolvers } from "./types/graphql";
import { Storage } from "@google-cloud/storage";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const typeDefs = gql`
  scalar Upload

  type Query {
    _: Boolean
  }

  type Mutation {
    uploadFile(file: Upload!): String
  }
`;

const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    "../image-processor-269205-27c047417fe4.json"
  ),
  projectId: process.env.PROJECT_ID
});

const bucket = storage.bucket(process.env.BUCKET_NAME || "");

const resolvers: Resolvers = {
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { filename, createReadStream } = await file;
      const fileInBucket = bucket.file(filename);
      await new Promise((resolve, reject) =>
        createReadStream()
          .pipe(
            fileInBucket.createWriteStream({ resumable: false, gzip: true })
          )
          .on("error", err => reject(console.error(err)))
          .on("finish", () => resolve(fileInBucket.makePublic()))
      );
      return `${process.env.GCS_BASE_URL}/${filename}`;
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers as IResolvers
});

const server = new ApolloServer({ schema });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
