import React, { Component } from "react";

class Login extends Component {
  state = {
    name: "",
    password: "",
  };

    //onMounting token stored in localStorage should be removed
  componentDidMount(){
    localStorage.removeItem("authToken");
  }
  handleChange = (e) => {
    //code goes here to handle onChange event for input fields
    this.setState({ [e.target.name]: e.target.value});
  };

  loginRequest = async () => {
    //code goes here to return the response after hitting login api
    const {name, password} = this.state;
    try{
      const response = await fetch("/api/admin/login",{
        method: "post",
        headers: { "Content-type": "application/json; charset=UTF-8",},
        body: JSON.stringify({name,password}),
      });
      const data = await response.json();
      if(response.status === 200 && data.token){
        this.props.history.push("/login");
        return data.token;
      }else{
        throw new Error(data.error || "Invalid response");
      }
    } catch (error){
      alert(error.message);
      return null;
    }
  };

  handleLogin = async () => {
     //handles login button
    //based on the login response, token should be set in local storage or alert should be displayed
    const token = await this.loginRequest();
    if(token){
      localStorage.setItem("authToken",token);
      alert("Login Successful!");
    }
  };

  render() {
    const { name, password } = this.state;
    const isDisabled = name.trim() === "" || password.trim() === "";
    return (
      <div className="login">
        <h1>Login</h1>
        {/*code goes here to display input field to get name and password*/}
        <input
        type = "text"
        name = "name"
        placeholder= "Enter Name"
        value = {name}
        onChange={this.handleChange}
        />
        <br/>
        <input
        type = "password"
        name = "password"
        placeholder= "Enter Password"
        value = {password}
        onChange={this.handleChange}
        />
        <button onClick={this.handleLogin} disabled={isDisabled}>
          Login
        </button>
      </div>
    );
  }
}

export default Login;
