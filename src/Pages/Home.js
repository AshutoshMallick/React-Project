import React, { Component } from "react";
import Header from "../Components/Header";
import Teams from "../Components/Teams";

class Home extends Component {
  state = {
    data: [], //hold the members data catagorised based on teams
    initialData: [], //hold the members data got from backend
    team: [], //holds the teams data got from backend
    edit: false, //handle edit mode for particular member 
    editId: undefined, //holds _id of member in edit mode
    empId: "",
    empName: "",
    experience: "",
    experienceFilter: "",
    checked: "Expericence",
    teamName: ""
  };

  //onMounting:     
  //if local storage had token proceed to set data in state
  //if local storage does not have token route back to login page  
  //code goes here to set initialData, team and data
  //initialData - holds the data got from back-end
  //data - holds data catagoried with team 
  //team - holds teams data got from back-end
  async componentDidMount() {
    const token = this.getLocalStorage();
    if (!token) {
      this.props.history.push("/login");
      return;
    }
    // this.handleGetMembers("/api/tracker/members/display").then((data) => {
    //   this.setState({ initialData: data, data });
    // });
    // this.handleGetTech().then((team) => {
    //   this.setState({ team });
    // });
    try {
      const data = await this.handleGetMembers("/api/tracker/members/display");
      // Step 1: Group by technology_name
      const groupedData = data.reduce((acc, member) => {
        if (!acc[member.technology_name]) {
          acc[member.technology_name] = [];
        }
        acc[member.technology_name].push(member);
        return acc;
      }, {});

      // Step 2: Convert to an array of arrays
      const mockData2 = Object.values(groupedData);

      this.setState({ initialData: data, data: mockData2 });
      // this.setState({ initialData: data, data });
      const team = await this.handleGetTech();
      this.setState({ team });
    } catch (error) {
      // console.error("Error fetching data:", error);
    }


  }
  getLocalStorage = () => localStorage.getItem("authToken");
  // getLocalStorage = () => {
  //   //code goes here to get token value from local storage
  //   return localStorage.getItem("authToken");
  // };

  handleGetMembers = async (url) => {
    //code goes here to return the respose of getMember api
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
    });
    return res.json();
  };

  handleGetTech = async () => {
    //code goes here to return the respose of technologies get api
    const res = await fetch("/api/tracker/technologies/get", {
      headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
    });
    return res.json();
  };

  handleChange = (e) => {
    //code goes here to handle onChange event for input fields except radio
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDeleteMembers = async (id) => {
    //code goes here to return the response status of delete api
    const res = await fetch(`/api/tracker/members/delete/${id}`, {
      method: "Delete",
      headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
    });
    console.log("delete called", id);
    return res.status;
  };

  handleDelete = async (e, id) => {
    //code goes here to handle delete member using return value of handleDeleteMembers 
    const status = await this.handleDeleteMembers(id);
    console.log("delete status", status);
    if (status === 200) {
      this.setState({
        data: this.state.data.filter((member) => member._id !== id),
      });
    }
  };

  handleEdit = (id) => {
    //code goes here to handle the edit button
    const member = this.state.initialData.find((m) => m._id === id);
    if (member) {
      this.setState({
        edit: true,
        editId: id,
        empId: member.employee_id,
        empName: member.employee_name,
        experience: member.experience,
      });
    }
  };

  handleChecked = (event) => {
    //code goes here for the onChange event of radio input fields
    this.setState({ checked: event.target.value, experienceFilter: "", teamName: "" });
  };

  handleClear = async () => {
    //code goes here to handle the clear button
    this.setState({ data: this.state.initialData, experienceFilter: "", teamName: "" });
  }

  handleGo = async () => {
    //code goes here to handle go button
    let url = "/api/tracker/members/display";
    if (this.state.checked === "Expericence" && this.state.experienceFilter) {
      url += `?experience=${this.state.experienceFilter}`;
    } else if (this.state.checked === "Team" && this.state.teamName) {
      url += `?tech=${this.state.teamName}`;
    } else if (this.state.checked === "Both" && this.state.experienceFilter && this.state.teamName) {
      url += `?experience=${this.state.experienceFilter}&&tech=${this.state.teamName}`;
    }
    const data = await this.handleGetMembers(url);
    this.setState({ data });
  };

  handleCancel = () => {
    //code goes here for cancel button 
    this.setState({ edit: false, editId: undefined, empId: "", empName: "", experience: "" });
  };

  handleEditRequest = async () => {
    //code goes here to return response status of update api
    const { editId, empId, empName, experience } = this.state;
    const res = await fetch(`/api/tracker/members/update/${editId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.getLocalStorage()}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        employee_id: empId && !isNaN(empId) ? (typeof empId === 'number' ? empId : Number(empId)) : "",
        employee_name: empName,
        experience: experience && !isNaN(experience) ? (typeof experience === 'number' ? experience : Number(experience)) : "",
      }),
    });
    return res.status;
  };

  handleDone = async (e) => {
    //code goes here to handle Done button using the return value of handleEditRequest function 
    const status = await this.handleEditRequest();
    if (status === 200) {
      alert("Updated");
      this.setState({ edit: false, editId: undefined, empId: "", empName: "", experience: "" });
    }
  };

  render() {
    return (
      <>
        <Header />
        <section>
          <label>Filter By</label>
          {/*code goes here for Radio field, */}
          {/* Select and Input */}
          <input type="radio" name="checked" value="Expericence" checked={this.state.checked === "Expericence"} onChange={this.handleChecked} />
          <label>Expericence</label>
          <input type="radio" name="checked" value="Team" checked={this.state.checked === "Team"} onChange={this.handleChecked} />
          <label>Team</label>
          <input type="radio" name="checked" value="Both" checked={this.state.checked === "Both"} onChange={this.handleChecked} />
          <label>Both</label>
          {
            (this.state.checked === "Team" || this.state.checked === "Both") && <select name="teamName" value={this.state.teamName} onChange={this.handleChange} >
              <option value="">Select Team</option>
              {this.state?.team.map((team, index) => (
                <option key={index} value={team.name}>{team.name}</option>
              ))}
            </select>
          }
          {(this.state.checked === "Expericence" || this.state.checked === "Both")
            && <input type="number" name="experienceFilter" value={this.state.experienceFilter} onChange={this.handleChange} disabled={this.state.checked === "Team"} />
          }

          <button onClick={this.handleGo} 
          // disabled={(!this.state.experienceFilter && !this.state.teamName) }
          disabled={
            (this.state.checked === "Expericence" && !this.state.experienceFilter) || 
            (this.state.checked === "Team" && !this.state.teamName) || 
            (this.state.checked === "Both" && (!this.state.experienceFilter || !this.state.teamName))
          }
          >Go</button>
          <button onClick={this.handleClear}>Clear</button>
        </section>
        {/* display teams */}
        {this.state.data.length > 0 ? <Teams
          // {...this.state} 
          data={this.state.data}
          edit={this.state.edit}
          editId={this.state.editId}
          empId={this.state.empId}
          empName={this.state.empName}
          experience={this.state.experience}
          handleDelete={this.handleDelete}
          handleEdit={this.handleEdit}
          handleCancel={this.handleCancel}
          handleDone={this.handleDone}
          handleChange={this.handleChange}
        /> : <div className="noTeam">No Teams Found</div>}
        {/*Make sure, props name passed in child Component same as the state or function name which you are passing */}
      </>
    );
  }
}

export default Home;
