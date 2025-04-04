import React from "react";
import { Link } from "react-router-dom";
import logout from "../icon/logout.png";
import { withRouter } from "react-router";
import home from "../icon/home.png";

export function Header(props) {
  const { history } = props; // Extract history from props

  function handleLogout() {
    localStorage.removeItem("authToken");
    history.push("/login"); // Use history.push directly
  }

  function handleHome() {
    history.push("/"); // Navigate to home
  }
  // function handleLogout() {
  //   // code goes here to handle logout
  //   localStorage.removeItem("authToken");
  //   // props.history.push("/login");
  //   window.location.href = "/login"; 
  // }
  // function handleHome() {
  //   //code goes here to handle home icon
  //   // props.history.push("/");
  //   window.location.href = "/"; 
  // }

  return (
    <>
      <nav>
      {/*code goes here for Add Member and Move Member Link*/}
      {/*Link should navigate to respective pages*/}
      <Link to="/addMember">Add Member</Link>
      <Link to="/moveMember">Move Member</Link>
      </nav>
      <header>
        <h1>
          Team Tracker

          <img src={logout} alt="Logout" onClick={handleLogout} style={{ cursor: "pointer" }} />
          <img src={home} alt="Home" onClick={handleHome} style={{ cursor: "pointer" }} />
        </h1>
      </header>
    </>
  );
}

export default withRouter(Header);
