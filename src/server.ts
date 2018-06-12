import { ApolloServer, AuthenticationError, PubSub } from "apollo-server";
import express from "express";
import mongoose from "mongoose";
import { GraphQLSchema, execute, subscribe } from "graphql";
import { mergeSchemas } from "graphql-tools";
const { OAuth2Client } = require("google-auth-library");
import schemas from "./schemas/schema";
import resolvers from "./resolvers/resolvers";
import { userController } from "./controllers/controllers";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";
const cors = require('cors');
import bodyParser from 'body-parser';

import {
	graphqlExpress,
	graphiqlExpress,
  } from 'graphql-server-express';

export const pubsub = new PubSub();

const MONGO_PORT = 27017;
const MONGO_URL = "localhost";
const dbName = "graphExample";
export const CLIENT_ID =
	"YOUR_ID";
export const client = new OAuth2Client(CLIENT_ID);
// help to debug mongoose
mongoose.set("debug", true);

mongoose.connect(`mongodb://${MONGO_URL}:${MONGO_PORT}/${dbName}`);

const schema: GraphQLSchema = mergeSchemas({
	schemas,
	resolvers
});

// GraphQL
const server = new ApolloServer({
	schema,
	context: async ({ req }: any) => {
		const token = req.headers.authorization || "";
		const checkToken = await userController.findOrCreateUser(token);
		if (!checkToken.hasOwnProperty('authorized')) {
			return {user: checkToken, authorized: true};
		}	
		return checkToken;
	},
	tracing: true,
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

/*****************************************************/
/*********			SUBSCRIPTIONS			**********/
/*****************************************************/
const PORT = 5000;
const app = express();

app.use('*', cors({ origin: 'http://localhost:5000' }));

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:5000/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(app);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});