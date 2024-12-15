// reducer.js
const initialUserState = { users: [], selectedUser: "" };

export const UserReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    default:
      return state;
  }
};

const initialPostState = { posts: [], selectedPosts: "" };

export const PostReducer = (state = initialPostState, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "SET_SELECTED_POST":
      return { ...state, selectedPost: action.payload };
    default:
      return state;
  }
};
