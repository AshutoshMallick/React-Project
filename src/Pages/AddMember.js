import React, { Component } from "react";
import Header from "../Components/Header";
import remove from "../icon/close.png";
import axios from "axios";
import { token, mockTeam } from "../Tests/mockData";
class AddMember extends Component {

  constructor(props) {
    super(props);
    this.state = {
      empId: "",
      empName: "",
      teamName: "",
      experience: "",
      newTeam: "",
      createTeam: false,
      deleteTeam: false,
      teams: [],
      errorStmtEmpId: "",
      errorStmtEmpName: "",
      errorStmtExperience: "",
      isValid: false
    };
    this.handleClear = this.handleClear.bind(this); // Bind handleClear
    this.handleAddMember = this.handleAddMember.bind(this);
    this.AddRequest = this.AddRequest.bind(this);
  }
  //onMounting
  //if local storage had token proceed to set data in state
  //if local storage does not have token route back to login page
  //code goes here to set value returned from handleGetTeam to teams state
  async componentDidMount() {
    const token = this.getLocalStorage();
    if (!token) {
      this.props.history.push("/login");
      return;
    }
    // this.handleGetTeam().then((teams)=> this.setState({teams}));
    // this.handleGetMembers("/api/tracker/members/display")
    // .then((data)=> this.setState({
    //   data
    // }));
    try {
      const teams = await this.handleGetTeam();
      // const data = await this.handleGetMembers("/api/tracker/members/display");
      this.setState({ teams: teams || [], isValid: true }); // Ensure button is enabled
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  getLocalStorage = () => {
    //code goes here to get token value from local storage

    const token = localStorage.getItem("authToken");
    console.log("inside getLocalStorage", token);
    return token ? token.trim() : ""; // Ensure it's never null
  };


  handleGetTeam = async () => {
    //code goes here to return the respose of technologies get api
    const res = await fetch("/api/tracker/technologies/get", {
      headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch teams");
    return res.json();
  };
  // handleChange = (e) => {
  //   //code goes here to handle onChange event
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //     errorStmtEmpId: "",
  //     errorStmtEmpName: "",
  //     errorStmtExperience: "",
  //   }, this.validateForm);
  // };
  handleChange = (e) => {
    const { name, value, type } = e.target;

    // Convert number inputs to actual numbers
    const newValue = type === "number" ? Number(value) : value;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.validateForm(); // Ensure validation runs AFTER state is updated
      }
    );
  };

  validateForm = () => {
    const { empId, empName, experience, teamName } = this.state;
    let isValid = true;
    let errorStmtEmpId = "";
    let errorStmtEmpName = "";
    let errorStmtExperience = "";
    // Emp ID Validation
    if (!empId) {
      errorStmtEmpId = "*Please enter a value";
      isValid = false;
    } else if (empId < 100000 || empId > 3000000) {
      errorStmtEmpId = "*Employee ID is expected between 100000 and 3000000";
      isValid = false;
    }
    // Emp Name Validation
    if (!empName) {
      errorStmtEmpName = "*Please enter a value";  // Ensure this comes first
      isValid = false;
    } else if (!/^[A-Za-z ]+$/.test(empName)) {
      errorStmtEmpName = "Employee name can have only alphabets and spaces";
      isValid = false;
    } else if (empName.length < 3) {
      errorStmtEmpName = "Employee Name should have atleast 3 letters";
      isValid = false;
    }



    if (!experience) {
      errorStmtExperience = "*Please enter a value";
      isValid = false;
    }

    if (!teamName) {
      isValid = false; // Add team validation
    }
    // else if (isNaN(experience) || experience < 1) { // Add validation if required for experience (numeric and range)
    //   errorStmtExperience = "Experience should be a number greater than 0";
    //   isValid = false;
    // }
    // **Ensure state update completes before enabling button**
    // this.setState(
    //   { errorStmtEmpId, errorStmtEmpName, errorStmtExperience, isValid },
    //   () => {
    //     console.log("Validation Complete - isValid:", this.state.isValid);
    //   }
    // );

    this.setState({ errorStmtEmpId, errorStmtEmpName, errorStmtExperience, isValid });
    return isValid;
  };
  handleAddMember = async (e) => {
    //code goes here to handle add member button using the return value of AddRequest 
    console.log("handleAddMember called");
    e.preventDefault();
    const token = this.getLocalStorage();
    if (!token) {
      console.error("Token is missing, cannot proceed.");
      return;
    }
    const status = await this.AddRequest();
    if (status === 409) {
      alert("Member already exists in the team which you are adding");
    } else {
      this.handleClear();
    }
  };

  AddRequest = async () => {
    //code goes here to return the response status of add member api
    console.log("AddRequest called");
    const { empId, empName, experience, teamName } = this.state;
    const res = await fetch(`/api/tracker/members/add`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${this.getLocalStorage()}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        employee_id: empId && !isNaN(empId) ? (typeof empId === 'number' ? empId : Number(empId)) : "",
        employee_name: empName,
        technology_name: teamName,
        experience:  experience && !isNaN(experience) ? (typeof experience === 'number' ? experience : Number(experience)) : "",
      }),
    });
    return res.status;
  };

  handleClear = () => {
    //code goes here to handle clear button
    console.log("handleClear");
    this.setState({
      empId: "",
      empName: "",
      experience: "",
      teamName: "", // Reset dropdown value
      errorStmtEmpId: "",
      errorStmtEmpName: "",
      errorStmtExperience: "",
    });
  };

  handleAddOrDeleteTeam = (e, action) => {
    // code goes here to swtich between add or delete team
    if (e === "createTeam") {
      this.setState({ createTeam: true })
    } else if (e === "deleteTeam") {
      this.setState({ deleteTeam: true })
    }
  };

  handleCancel = (e, action) => {
    //code goes here to handle cancel button
    if (e === "createTeam") {
      this.setState({ createTeam: false })
    } else if (e === "deleteTeam") {
      this.setState({ deleteTeam: false })
    }
  };

  handleSave = async (e) => {
    //code goes here to handle save button
    const status = await this.saveTeam();
    if (status === 201) {
      alert("Team added successfully");
    } else if (status === 409) {
      alert("Team already exists");
    }
  };

  // saveTeam = async () => {
  //   //code goes here to return the status of /technologies/add api
  //   const response = await axios.post("/api/tracker/technologies/add", {
  //     technology_name: this.state.newTeam,
  //   }, {
  //     headers: {
  //       Authorization: `Bearer ${this.getLocalStorage()}`,
  //     },
  //   });
  //   return response.status;
  // };
  saveTeam = async () => {
    try {
      const response = await fetch("/api/tracker/technologies/add", {
        method: "post",
        headers: {
          Authorization: `Bearer ${this.getLocalStorage()}`,
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          technology_name: this.state.newTeam,
        }),
      });

      return response.status;
    } catch (error) {
      console.error("Error adding team:", error);
      return 500; // Indicating failure
    }
  };

  // handleRemoveTeam = async (e, tech) => {
  //   //code goes here to handle remove team using the value returned from removeTeamRequest function
  //   // const status = await this.removeTeamRequest(tech);
  //   // if (status === 200) {
  //   //   alert("Team deleted successfully");
  //   // } else {
  //   //   alert("Couldn't delete the team");
  //   // }
  //   // Call removeTeamRequest and handle response status
  //   try {
  //     const status = await this.removeTeamRequest(tech);
  //     if (status === 200) {
  //       alert("Team deleted successfully");
  //     } else {
  //       alert("Couldn't delete the team");
  //     }
  //   } catch (error) {
  //     alert("An error occurred while deleting the team");
  //   }
  // };

  // removeTeamRequest = async (id) => {
  //   //code goes here to return response status of remove technologies api
  //   // const response = await axios.delete(`/api/tracker/technologies/remove/${tech}`, {
  //   //   headers: {
  //   //     Authorization: `Bearer ${this.getLocalStorage()}`,
  //   //   },
  //   // });
  //   // return response.status;
  //   // Ensure tech is passed correctly and get token securely
  //   try {
  //     const token = this.getLocalStorage();
  //     const response = await axios.delete(`/api/tracker/technologies/remove/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.status;
  //   } catch (error) {
  //     console.error("Error deleting team:", error);
  //     return error.response ? error.response.status : 500; // Return status or 500 for failure
  //   }
  // };
  // handleRemoveTeam = async (e, tech) => {
  //   try {
  //     const status = await this.removeTeamRequest(tech);
  //     if (status === 200) {
  //       alert("Team deleted successfully");
  //     } else {
  //       alert("Couldn't delete the team");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while deleting the team:", error);
  //   }
  // };
  handleRemoveTeam = async (tech) => {
    try {
      if (!tech) {
        console.error("No team name provided for deletion");
        return;
      }

      const status = await this.removeTeamRequest(tech);
      if (status === 200) {
        alert("Team deleted successfully");
      } else {
        alert("Couldn't delete the team");
      }
    } catch (error) {
      console.error("An error occurred while deleting the team:", error);
    }
  };

  // removeTeamRequest = async (tech) => {
  //   try {
  //     let token = this.getLocalStorage();
  //     console.log("removeTeamRequest",token);
  //     // Ensure token is valid
  //     if (!token || typeof token !== "string") {
  //       throw new Error("Invalid token");
  //     }
  //     token = token.trim(); // Remove unwanted spaces

  //     const response = await fetch(`/api/tracker/technologies/remove/${tech}`, {
  //       method: "Delete",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     return response.status;
  //   } catch (error) {
  //     console.error("Error deleting team:", error);
  //     return 500; // Return 500 for failure
  //   }
  // };
  removeTeamRequest = async (tech) => {
    try {
      const token = this.getLocalStorage()?.trim(); // Ensure token is valid

      if (!token) {
        console.error("Invalid token");
        return 401; // Unauthorized error
      }

      const response = await fetch(`/api/tracker/technologies/remove/${tech}`, {
        method: "Delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status;
    } catch (error) {
      console.error("Error deleting team:", error);
      return 500; // Return 500 for failure
    }
  };


  render() {
    const { empId, empName, teamName, experience, createTeam, deleteTeam, newTeam, teams, errorStmtEmpId, errorStmtEmpName, errorStmtExperience, isValid } = this.state;


    return (
      <>
        {/* onSubmit={this.handleAddMember} */}
        <Header />
        <form>
          <h1>Add Team Member</h1>
          <div>
            {/*code goes here to display the input fields, Plus and Delete button*/}
            <input
              name="empId"
              placeholder="Employee ID"
              type="number"
              value={empId}
              onChange={this.handleChange} />
            <span>{errorStmtEmpId}</span>
            <input
              name="empName"
              placeholder="Employee Name"
              type="text"
              value={empName}
              onChange={this.handleChange} />
            <span>{errorStmtEmpName}</span>
            <input
              name="experience"
              placeholder="Experience"
              type="number"
              value={experience}
              onChange={this.handleChange} />
            <span>{errorStmtExperience}</span>
            <select
              name="teamName"
              value={teamName}
              type="text"
              onChange={this.handleChange}>
              <option value="">Select Team</option>
              {/* <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option> */}
              {
                teams?.map((team) => (
                  <option key={team._id} value={team.name}>{team.name}</option>
                ))
              }
            </select>
            {/* create team */}
            <button
              type="button"
              onClick={() => this.handleAddOrDeleteTeam("createTeam")}>
              +
            </button>
            <button
              type="button"
              onClick={() => this.handleAddOrDeleteTeam("deleteTeam")}>
              Delete
            </button>
            {(createTeam || deleteTeam) && (
              <div className="addList">
                <p>{deleteTeam ? "Delete Team" : "Create New Label"}</p>

                {createTeam && (
                  <>
                    <input
                      name="newTeam"
                      placeholder="New Team"
                      value={newTeam}
                      onChange={this.handleChange}
                    />
                    <button type="button" onClick={this.handleSave}>Save</button>
                    <button type="button" onClick={() => this.handleCancel("createTeam")}>Cancel</button>
                  </>
                )}

                {deleteTeam && (
                  // <>
                  //   {teams.map((team) => (
                  //     <div key={team}>
                  //       <span>{team}</span>
                  //       <button type="button" onClick={() => this.handleRemoveTeam(team)}>X</button>
                  //     </div>
                  //   ))}
                  //   <button type="button" onClick={() => this.handleCancel("deleteTeam")}>Cancel</button>
                  // </>
                  <table>
                    <tbody>
                      {teams?.map((team, index) => (
                        <tr key={index}>
                          <td>{team.name}</td>
                          <td>
                            <img
                              src={remove}
                              alt="delete"
                              onClick={() => this.handleRemoveTeam(team.name)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))}
                      {/* Cancel button row */}
                      <tr>
                        <td colSpan="2">
                          <button type="button" onClick={() => this.handleCancel("deleteTeam")}>
                            Cancel
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Delete Team */}

            {/* )} */}
            {/* code goes here for the experience input fieldonClick={this.handleAddMember}  */}
          </div>
          <div>
            <button className="button" type="button" disabled={!isValid} onClick={this.handleAddMember}>
              Add
            </button>
            <button className="button" type="button" onClick={this.handleClear}>
              Clear
            </button>
          </div>
        </form>

      </>
    );
  }
}

export default AddMember;
