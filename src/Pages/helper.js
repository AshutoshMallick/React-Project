// helper.js

// Function to check if an array is empty
export const isEmptyArray = (array) => {
    return array.length === 0;
  };
  
  // Function to validate if an object is empty
  export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  // Function to validate if a string is a valid team name
  export const isValidTeamName = (teamName) => {
    const regex = /^[a-zA-Z0-9 ]+$/; // Only letters, numbers, and spaces allowed
    return regex.test(teamName);
  };
  
  // Function to validate if a team member has a valid structure
  export const isValidMember = (member) => {
    return member && member.employee_id && member.employee_name && member.team_name;
  }



  