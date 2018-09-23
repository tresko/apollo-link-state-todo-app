import gql from "graphql-tag";
import uuid from 'uuid/v1';

export const defaults = {
  todos: [],
  visibilityFilter: "SHOW_ALL"
};

export const resolvers = {
  Mutation: {
    updateVisibilityFilter: (_, {visibilityFilter}, {cache}) => {
      const data = {
        visibilityFilter,
        __typename: "VisibilityxFilter"
      };
      cache.writeData({data});
    },
    addTodo: (_, {title}, {cache}) => {
      const query = gql`
        query GetTodos {
          todos @client {
            id
            title
            completed
          }
        }
      `;
      const previous = cache.readQuery({query});
      const newTodo = {
        title,
        id: uuid(),
        completed: false,
        __typename: "Todo"
      };
      const data = {
        todos: previous.todos.concat([newTodo])
      };
      cache.writeData({data});
      return newTodo;
    },
    toggleTodo: (_, {id}, {cache, getCacheKey}) => {
      const fragmentId = getCacheKey({__typename: 'Todo', id});
      const fragment = gql`
          fragment completeTodo on Todo {
              completed
          }
      `;
      const todo = cache.readFragment({fragment, id: fragmentId});
      const data = {...todo, completed: !todo.completed};
      cache.writeData({id: fragmentId, data});
      return data;
    },
  },
};
