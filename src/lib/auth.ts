import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_CONNECTION_STRING_URI;
if (!mongoUri) throw new Error("MONGODB_CONNECTION_STRING_URI must be configured.");

const globalForMongo = globalThis as typeof globalThis & {
  bookNookAuthMongoClient?: MongoClient;
};
const client = globalForMongo.bookNookAuthMongoClient ?? new MongoClient(mongoUri, {
  maxPoolSize: 5,
  maxConnecting: 2,
  maxIdleTimeMS: 30_000,
  serverSelectionTimeoutMS: 10_000,
});
globalForMongo.bookNookAuthMongoClient = client;
const db = client.db("booknook");
const authBaseUrl = process.env.BETTER_AUTH_URL?.trim().replace(/\/$/, "");
const trustedOrigins = Array.from(new Set([
  "http://localhost:3000",
  ...(authBaseUrl ? [new URL(authBaseUrl).origin] : []),
]));

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  baseURL: authBaseUrl,
  trustedOrigins,
  socialProviders: {
    google: {
      clientId: process.env.Google_OAuth_Client_ID as string,
      clientSecret: process.env.Google_OAuth_Client_Secret as string,
    },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "7d",
        ...(authBaseUrl ? { issuer: authBaseUrl, audience: authBaseUrl } : {}),
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});
