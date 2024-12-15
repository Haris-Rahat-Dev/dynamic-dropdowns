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
  }

  async componentDidMount() {
    const { SET_USERS, SET_POSTS } = this.props;
    const usersResp = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await usersResp.json();
    const postsResp = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await postsResp.json();
    SET_USERS(users);
    SET_POSTS(posts);
    this.setState({ loading: false });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.selectedUser !== prevProps.selectedUser) {
      const { selectedUser } = this.props;
      console.log(selectedUser, "selected User");
      if (+selectedUser === 0) {
        const postsResp = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const posts = await postsResp.json();
        this.props.SET_POSTS(posts);
        this.props.SET_SELECTED_POST("");
        return;
      }
      // filter the current posts
      const postsResp = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${+selectedUser}`
      );
      const posts = await postsResp.json();
      this.props.SET_POSTS(posts);
    }
    // do the same for posts
    if (this.props.selectedPost !== prevProps.selectedPost) {
      const { selectedPost } = this.props;
      const post = this.props.posts.filter(
        (post) => post.id === +selectedPost
      )[0];
      console.log(post, "post");
      if (post) {
        this.props.SET_SELECTED_USER(post.userId);
      }
    }
  }

  handleUserChange = (e) => {
    const { SET_SELECTED_USER } = this.props;
    SET_SELECTED_USER(e.target.value);
  };

  handlePostChange = (e) => {
    const { SET_SELECTED_POST } = this.props;
    SET_SELECTED_POST(e.target.value);
  };

  render() {
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
              <option>Select Post</option>
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

const mapStateToProps = (state) => {
  return {
    users: state.users.users,
    posts: state.posts.posts,
    selectedUser: state.users.selectedUser,
    selectedPost: state.posts.selectedPost,
  };
};

const mapDispatchToProps = {
  SET_USERS,
  SET_POSTS,
  SET_SELECTED_USER,
  SET_SELECTED_POST,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
