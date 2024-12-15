import React from "react";
import {
  SET_POSTS,
  SET_USERS,
  SET_SELECTED_USERS,
  SET_SELECTED_POSTS,
} from "./actions";
import { connect } from "react-redux";
import Select from "react-select";

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
    const postsResp = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const posts = await postsResp.json();
    return posts;
  }

  // componentDidMount is called when the component mounts and we fetch the relevant data
  async componentDidMount() {
    const promises = [this.fetchPosts(), this.fetchUsers()];
    await Promise.all(promises);
    this.setState({ loading: false });
  }

  // componentDidUpdate is called when the component updates, in this case when the redux state is updated
  async componentDidUpdate(prevProps) {
    // when the selected users changes in state we compare it with the previous selected users
    if (
      JSON.stringify(this.props.selectedUsers) !==
      JSON.stringify(prevProps.selectedUsers)
    ) {
      const { selectedUsers } = this.props;
      // if the user reset's user dropdown we reset the posts
      // + is used to convert the string to a number
      if (!selectedUsers.length) {
        await this.fetchPosts();
        this.props.SET_SELECTED_POSTS([]);
        return;
      }
      // else we filter the posts based on the selected user and set the posts for that selected user
      // since the selected users are going to be in the form of an array, we loop the array and then fetch the posts for each of the users
      const promises = selectedUsers.map(async (selectedUser) => {
        return await this.fetchPostsByUser(+selectedUser.value);
      });
      // then store the result to the state
      const res = (await Promise.all(promises)).flatMap((res) => res);
      this.props.SET_POSTS(res);
    }

    // when the selected posts changes in state we compare it with the previous selected posts
    if (
      JSON.stringify(this.props.selectedPosts) !==
      JSON.stringify(prevProps.selectedPosts)
    ) {
      const { selectedPosts } = this.props;
      // if the user reset's post dropdown we reset the users
      // + is used to convert the string to a number
      if (!selectedPosts.length) {
        this.props.SET_SELECTED_USERS([]);
        return;
      }
      // now we find the posts that have been selected becuz the input returns us only a value and an id, so we use the id to get the posts from the state
      const posts = this.props.selectedPosts.map((selectedPost) => {
        return this.props.posts.find((post) => post.id === +selectedPost.value);
      });
      // after we get the selected posts we get their users
      const usersFromPosts = posts.map((post) => {
        return this.props.users.find((user) => user.id === post.userId);
      });
      // filter out invalid users and already selected users
      const filteredUsers = usersFromPosts.filter((user) => {
        // Ensure the user exists (not null or undefined)
        if (!user) return false;
        // check if the user is already in `selectedUsers`
        const isAlreadySelected = this.props.selectedUsers.some(
          (selectedUser) => selectedUser.value === user.id
        );
        // include the user only if they are not already selected
        return !isAlreadySelected;
      });
      // transform the remaining users into the dropdown format
      const newUsers = filteredUsers.map((user) => {
        return {
          value: user.id, // Use `user.id` as the value
          label: user.name, // Use `user.name` as the label
        };
      });

      // update the state only if there are new users to add
      if (newUsers.length > 0) {
        // merge the existing `selectedUsers` with the new users and update the state
        this.props.SET_SELECTED_USERS([
          ...this.props.selectedUsers, // keep the existing selected users
          ...newUsers, // add the new users
        ]);
      }
    }
  }

  // handleUserChange is called when the user selects a user
  handleUserChange = (value) => {
    const { SET_SELECTED_USERS } = this.props;
    SET_SELECTED_USERS(value);
  };

  // handlePostChange is called when the user selects a post
  handlePostChange = (value) => {
    const { SET_SELECTED_POSTS } = this.props;
    SET_SELECTED_POSTS(value);
  };

  render() {
    // formatting the data so it can be rendered in the Select component, becuz it needs an array of specific format, i.e {value: "", label: ""}
    const formattedUsers = this.props.users.map((user) => ({
      value: user.id,
      label: user.name,
    }));
    const formattedPosts = this.props.posts.map((post) => ({
      value: post.id,
      label: post.title,
    }));
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
            <p>
              Selected Users:{" "}
              {this.props.selectedUsers.length > 0
                ? this.props.selectedUsers.map((user) => user.label).join(",")
                : "None"}
            </p>

            <Select
              placeholder={"Select Users"}
              isMulti
              options={formattedUsers}
              onChange={this.handleUserChange.bind(this)}
              value={this.props.selectedUsers}
            />
          </div>
          <div>
            <Select
              placeholder={"Select Posts"}
              isMulti
              options={formattedPosts}
              onChange={this.handlePostChange.bind(this)}
              value={this.props.selectedPosts}
            />
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
    selectedUsers: state.users.selectedUsers,
    selectedPosts: state.posts.selectedPosts,
  };
};

// mapping the actions to the component props
const mapDispatchToProps = {
  SET_USERS,
  SET_POSTS,
  SET_SELECTED_USERS,
  SET_SELECTED_POSTS,
};

// connecting the component to the redux store
export default connect(mapStateToProps, mapDispatchToProps)(App);
