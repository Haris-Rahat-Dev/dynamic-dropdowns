import { applyMiddleware, combineReducers, createStore } from "redux";
import { PostReducer, UserReducer } from "./reducer";
import { thunk } from "redux-thunk";

// creating the redux store
export const store = createStore(
  // combining the reducers
  combineReducers({ users: UserReducer, posts: PostReducer }),
  // adding the middleware, other wise the store will throw an error when passing the data to the dispatch function
  applyMiddleware(thunk)
);
