import { applyMiddleware, combineReducers, createStore } from "redux";
import { PostReducer, UserReducer } from "./reducer";
import { thunk } from "redux-thunk";

export const store = createStore(
  combineReducers({ users: UserReducer, posts: PostReducer }),
  applyMiddleware(thunk)
);
