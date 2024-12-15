// setting the users data in the redux store
const SET_USERS = (users) => (dispatch) => {
  dispatch({ type: "SET_USERS", payload: users });
};

// setting the selected user data in the redux store
const SET_SELECTED_USER = (selectedUser) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_USER", payload: selectedUser });
};

 // setting the posts data in the redux store
const SET_POSTS = (posts) => (dispatch) => {
  dispatch({ type: "SET_POSTS", payload: posts.slice(0, 50) });
};

// setting the selected post data in the redux store
const SET_SELECTED_POST = (selectedPost) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_POST", payload: selectedPost });
};

export { SET_USERS, SET_SELECTED_USER, SET_POSTS, SET_SELECTED_POST };
