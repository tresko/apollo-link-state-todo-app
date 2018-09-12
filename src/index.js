import React from "react";
import { render } from "react-dom";
import { ApolloClient } from "apollo-client";
import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import App from "./components/App";
import { resolvers, defaults } from "./resolvers";

const cache = new InMemoryCache();

const typeDefs = `
  enum VisibilityFilterEnum {
    SHOW_ALL
    SHOW_COMPLETED
    SHOW_ACTIVE
  }
  
  type Todo {
    id: ID!
    text: String!
    completed: Boolean!
  }

  type Mutation {
    addTodoes(text: String!): Todo
    toggleTodo(id: Int!): Todo
    updateVisibilityFilter(filter: VisibilityFilterEnum!): VisibilityFilterEnum
  }

  type Query {
    visibilityFilter: VisibilityFilterEnum
    allTodoes: [Todo]
  }
`;

const client = new ApolloClient({
  cache,
  link: withClientState({ resolvers, defaults, cache, typeDefs })
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
