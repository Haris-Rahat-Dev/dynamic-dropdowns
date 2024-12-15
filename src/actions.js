// setting the users data in the redux store
const SET_USERS = (users) => (dispatch) => {
  dispatch({
    type: "SET_USERS",
    payload: users,
  });
};

// setting the selected user data in the redux store
const SET_SELECTED_USERS = (selectedUsers) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_USERS", payload: selectedUsers });
};

// setting the posts data in the redux store
const SET_POSTS = (posts) => (dispatch) => {
  dispatch({
    type: "SET_POSTS",
    payload: posts,
  });
};

// setting the selected post data in the redux store
const SET_SELECTED_POSTS = (selectedPosts) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_POSTS", payload: selectedPosts });
};

export { SET_USERS, SET_SELECTED_USERS, SET_POSTS, SET_SELECTED_POSTS };
