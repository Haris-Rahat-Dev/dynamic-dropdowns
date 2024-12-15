// reducers
// initial state for the users
const initialUserState = { users: [], selectedUser: "" };

// user reducer for the users
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

// initial state for the posts
const initialPostState = { posts: [], selectedPosts: "" };

// post reducer for the posts
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
