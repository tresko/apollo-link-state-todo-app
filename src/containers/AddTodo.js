import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) @client {
      id
    }
  }
`;

const AddTodo = () => (
  <Mutation mutation={ADD_TODO}>
    {addTodo => {
      let input;
      return (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!input.value.trim()) {
                return;
              }
              addTodo({
                variables: { title: input.value },
                /*optimisticResponse: {
                  __typename: "Mutation",
                  addTodo: {
                    title: input.value,
                  },
                },*/
              });
              input.value = "";
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
      );
    }}
  </Mutation>
);

export default AddTodo;
