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
    this.handleClear = this.handleClear.bind(this); 
    this.handleAddMember = this.handleAddMember.bind(this);
    this.AddRequest = this.AddRequest.bind(this);
  }
  async componentDidMount() {
    const token = this.getLocalStorage();
    if (!token) {
      this.props.history.push("/login");
      return;
    }
    
    try {
      const teams = await this.handleGetTeam();
      this.setState({ teams: teams || [], isValid: true }); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  getLocalStorage = () => {
    const token = localStorage.getItem("authToken");
    console.log("inside getLocalStorage", token);
    return token ? token.trim() : ""; 
  };
  handleGetTeam = async () => {
    const res = await fetch("/api/tracker/technologies/get", {
      headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch teams");
    return res.json();
  };
  handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.validateForm(); 
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
    console.log("handleAddMember called");
    e.preventDefault();
    const status = await this.AddRequest();
    if (status === 409) {
      alert("Member already exists in the team which you are adding");
    } else {
      this.handleClear();
    }
  };

  AddRequest = async () => { // Convert to arrow function
    console.log("AddRequest called");
    const { empId, empName, experience, teamName } = this.state;
    const res = await fetch(`/api/tracker/members/add`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${this.getLocalStorage()}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        employee_id: empId ? Number(empId) : "",
        employee_name: empName,
        technology_name: teamName,
        experience: experience ? Number(experience) : "",
      }),
    });
    return res.status;
  };

  handleClear = () => {
    console.log("handleClear");
    this.setState({
      empId: "",
      empName: "",
      experience: "",
      teamName: "", 
      errorStmtEmpId: "",
      errorStmtEmpName: "",
      errorStmtExperience: "",
    });
  };

  handleAddOrDeleteTeam = (e, action) => {
    if (e === "createTeam") {
      this.setState({ createTeam: true })
    } else if (e === "deleteTeam") {
      this.setState({ deleteTeam: true })
    }
  };

  handleCancel = (e, action) => {
    if (e === "createTeam") {
      this.setState({ createTeam: false })
    } else if (e === "deleteTeam") {
      this.setState({ deleteTeam: false })
    }
  };

  handleSave = async (e) => {
    const status = await this.saveTeam();
    if (status === 201) {
      alert("Team added successfully");
    } else if (status === 409) {
      alert("Team already exists");
    }
  };

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

  removeTeamRequest = async (tech) => {
    try {
      const token = this.getLocalStorage()?.trim(); 
      if (!token) {
        console.error("Invalid token");
        return 401; 
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
      return 500; 
    }
  };


  render() {
    const { empId, empName, teamName, experience, createTeam, deleteTeam, newTeam, teams, errorStmtEmpId, errorStmtEmpName, errorStmtExperience, isValid } = this.state;
    return (
      <>
        <Header />
        <form>
          <h1>Add Team Member</h1>
          <div>
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
              {
                teams?.map((team) => (
                  <option key={team._id} value={team.name}>{team.name}</option>
                ))
              }
            </select>
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
                    <button type="button" onClick={() => this.handleSave()}>Save</button>
                    <button type="button" onClick={() => this.handleCancel("createTeam")}>Cancel</button>
                  </>
                )}

                {deleteTeam && (
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
            <button className="button" type="button" disabled={!isValid} onClick={(e) => this.handleAddMember(e)}>
              Add
            </button>
            <button className="button" type="button" onClick={(e) => this.handleClear()}>
              Clear
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default AddMember;
