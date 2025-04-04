import React, { Component } from "react";
import Header from "../Components/Header";

class MoveMember extends Component {
  state = {
    teams: [],
    data: [],
    empId: "",
    from:"",
    to:"",
    errorStmtEmpId: "",
  };
    
  //onMounting
    //if local storage had token proceed to set data in state
    //if local storage does not have token route back to login page
    //code goes here to set value returned from handleGetTeam and handleGetMembers to state teams and data
    async componentDidMount(){
      const token = this.getLocalStorage();
      if(!token){
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
        const data = await this.handleGetMembers("/api/tracker/members/display");
        this.setState({ teams: teams || [], data: data || [] });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

  getLocalStorage = () => {
    //code goes here to get and return token value from local storage
    return localStorage.getItem("authToken");
  };

  handleGetTeam = async () => {
    //code goes here to return the respose of technologies get api
    const res = await fetch("/api/tracker/technologies/get",{
      headers:{ Authorization: `Bearer ${this.getLocalStorage()}`},
    });
    if (!res.ok) throw new Error("Failed to fetch teams");
    return res.json();
  };

  handleGetMembers = async (url) => {
    //code goes here to return the response of api that is used to getMember 
    const res = await fetch( url, {
      headers: { Authorization: `Bearer ${this.getLocalStorage()}`},
    });
    if (!res.ok) throw new Error("Failed to fetch members");
    return res.json();
  };

  handleChange = (e) => {
    //code goes here to handle onChange for select and input 
    this.setState({ [e.target.name]: e.target.value}, this.validateForm);
  };
  validateForm = () =>{
    const {empId,from,to} = this.state;
    let errorStmtEmpId = "";
    const empIdNum = Number(empId);
    if(!empId){
      errorStmtEmpId = "*Please enter a value";
    } else if(empIdNum < 100000 || empIdNum > 3000000){
      errorStmtEmpId = "*Employee ID is expected between 100000 and 3000000";
    }
    this.setState({errorStmtEmpId});
  };
  handleClear = () => {
    //code goes here to handle clear 
    this.setState({
      empId:"",
      from: "",
      to:"",
      errorStmtEmpId:""
    });
  };

  MoveRequest = async (id) => {
    //code goes here to return the response status code of api that is used to move members from one team to 
    const res = await fetch(`/api/tracker/members/update/${id}`,{
      method: "PATCH",
      headers:{
        Authorization: `Bearer ${this.getLocalStorage()}`,
        "Content-type":"application/json; charset=UTF-8",
      },
      body: JSON.stringify({ technology_name: this.state.to}),
    });
    return res.status;
  };

  handleMove = async (e) => {
    //code goes here to handle move button
    e.preventDefault();
    const { empId, data } = this.state;
    // const member = data.find((m)=> m.employee_d == empId);
    const member = data.find((m) => String(m.employee_id) === String(empId));
    if(member){
      const status = await this.MoveRequest(member._id);
      if(status === 200){
        this.handleClear();
      }
    }
  };

  render() {
    const { teams, empId, from, to, errorStmtEmpId} = this.state;
    const isDisabled = !empId || !from || !to || errorStmtEmpId !== "";
    return (
      <>
        <Header />
        <form className="MoveMember">
          <h1>Move Team Member</h1>
        {/*code goes here for the input field*/}
        {/*use sapn to display error msg*/}
        <input
          type="number"
          name="empId"
          value={empId}
          onChange={this.handleChange}
          placeholder="Enter Employee ID"
        />
        <span>{errorStmtEmpId}</span>
          <div className="fromTo">
            {/*code goes here for from and to labels and input fields*/}
            <label>From</label>
            <select name="from" value={from} onChange={this.handleChange}>
              <option value="">Select Team</option>
              {
                teams.map((t)=>(
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))
              }
            </select>
            <label>To</label>
            <select name="to" value={to} onChange={this.handleChange}>
              <option value="">Select Team</option>
              {
                teams.map((t)=>(
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))
              }
            </select>
          </div>
          <div className="row3">
          <button className="add" onClick={this.handleMove} disabled={isDisabled}>
              Move
            </button>
            <button className="add" onClick={this.handleClear} type="button">
              Clear
            </button>
          </div>
        </form>
      </>
    );
  }
}
export default MoveMember;
