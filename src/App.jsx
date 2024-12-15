import React from "react";
import {
  SET_POSTS,
  SET_USERS,
  SET_SELECTED_USER,
  SET_SELECTED_POST,
} from "./actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    // binding the functions so that the props and the state (component state not to be confused with redux state) can be accessed
    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.fetchPostsByUser = this.fetchPostsByUser.bind(this);
  }

  // fetch functions to fetch the relevant data
  async fetchPosts() {
    const { SET_POSTS } = this.props;
    const postsResp = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await postsResp.json();
    SET_POSTS(posts);
  }

  async fetchUsers() {
    const { SET_USERS } = this.props;
    const usersResp = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await usersResp.json();
    SET_USERS(users);
  }

  async fetchPostsByUser(userId) {
    const { SET_POSTS } = this.props;
    const postsResp = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const posts = await postsResp.json();
    SET_POSTS(posts);
  }

  // componentDidMount is called when the component mounts and we fetch the relevant data
  async componentDidMount() {
    const promises = [this.fetchPosts(), this.fetchUsers()];
    await Promise.all(promises);
    this.setState({ loading: false });
  }

  // componentDidUpdate is called when the component updates, in this case when the redux state is updated
  async componentDidUpdate(prevProps) {
    // when the selected user changes in state we compare it with the previous selected user
    if (this.props.selectedUser !== prevProps.selectedUser) {
      const { selectedUser } = this.props;
      // if the user select's the first option "Select User" we reset the posts
      // + is used to convert the string to a number
      if (+selectedUser === 0) {
        await this.fetchPosts();
        this.props.SET_SELECTED_POST("");
        return;
      }
      // else we filter the posts based on the selected user and set the posts for that selected user
      this.fetchPostsByUser(+selectedUser);
    }

    // when the selected post changes in state we compare it with the previous selected post
    if (this.props.selectedPost !== prevProps.selectedPost) {
      const { selectedPost } = this.props;
      // if the user select's the first option "Select Post" we reset the user
      // + is used to convert the string to a number
      if (+selectedPost === 0) {
        this.props.SET_SELECTED_USER("");
        return;
      }
      // else we filter the users based on the selected post and set the user for that selected post
      const post = this.props.posts.filter(
        (post) => post.id === +selectedPost
      )[0];
      // if the post exists we set the user
      if (post) {
        this.props.SET_SELECTED_USER(post.userId);
      }
    }
  }

  // handleUserChange is called when the user selects a user
  handleUserChange = (e) => {
    const { SET_SELECTED_USER } = this.props;
    SET_SELECTED_USER(e.target.value);
  };

  // handlePostChange is called when the user selects a post
  handlePostChange = (e) => {
    const { SET_SELECTED_POST } = this.props;
    SET_SELECTED_POST(e.target.value);
  };

  render() {
    // filtering the users based on the selected user
    const user = this.props.users.filter(
      (user) => user.id === +this.props.selectedUser
    )[0];
    if (this.state.loading) return <p>Loading...</p>;
    return (
      <div className="App">
        <h1>Dependent Dropdowns</h1>
        <h2>Start editing to see some magic happen!</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "30%",
            gap: "2rem",
          }}
        >
          <div>
            {user && <p>selected User: {user.name}</p>}
            <select
              value={this.props.selectedUser}
              onChange={this.handleUserChange.bind(this)}
            >
              <option value={0}>Select User</option>
              {this.props.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={this.props.selectedPost}
              onChange={this.handlePostChange.bind(this)}
            >
              <option value={0}>Select Post</option>
              {this.props.posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
            <p>Total posts: {this.props.posts.length}</p>
          </div>
        </div>
      </div>
    );
  }
}

// mapping the redux state to the component props
const mapStateToProps = (state) => {
  return {
    users: state.users.users,
    posts: state.posts.posts,
    selectedUser: state.users.selectedUser,
    selectedPost: state.posts.selectedPost,
  };
};

// mapping the actions to the component props
const mapDispatchToProps = {
  SET_USERS,
  SET_POSTS,
  SET_SELECTED_USER,
  SET_SELECTED_POST,
};

// defining the prop types, otherwise the linter will throw an error saying invalid prop types, because we are modifying the props from the outside
App.propTypes = {
  users: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
  selectedUser: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedPost: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  SET_USERS: PropTypes.func.isRequired,
  SET_POSTS: PropTypes.func.isRequired,
  SET_SELECTED_USER: PropTypes.func.isRequired,
  SET_SELECTED_POST: PropTypes.func.isRequired,
};

App.defaultProps = {
  users: [],
  posts: [],
  selectedUser: "",
  selectedPost: "",
};

// connecting the component to the redux store
export default connect(mapStateToProps, mapDispatchToProps)(App);
