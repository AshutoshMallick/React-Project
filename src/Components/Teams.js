import React from "react";
import { mockData2 } from "../Tests/mockData";
export function Teams({ data, edit, editId, empId, empName, experience,
  handleCancel,
  handleDone,
  handleEdit,
  handleDelete,
  handleChange }) {
 
  // Group employees by technology name
  // const groupedData = data?.reduce((acc, team) => {
  //   team?.map(member => {
  //     if (!acc[member.technology_name]) {
  //       acc[member.technology_name] = [];
  //     }
  //     acc[member.technology_name].push(member);
  //   });
  //   return acc;
  // }, {});
  // data = mockData2;
  // const groupedData = data?.reduce((acc, team) => {
  //   if(!acc[team.technology_name]){
  //     acc[team.technology_name] = [];
  //   }
  //   acc[team.technology_name].push(team);
  //   return acc;
  // },{});
  // Flatten the data if it's an array of arrays
const flattenedData = Array.isArray(data[0]) ? [].concat(...data) : data;

const groupedData = flattenedData.reduce((acc, member) => {
  if (!acc[member.technology_name]) {
    acc[member.technology_name] = [];
  }
  acc[member.technology_name].push(member);
  return acc;
}, {});

// console.log(groupedData);

  return (
    <>
      {/*code goes here to teams*/}
      {
        Object.entries(groupedData).map(
          ([tech, members], key) => (
            <table key={key} border="1" style={{ marginBottom: "20px" }}>
              <thead>
                <tr>
                  <td colSpan={6}>{tech}</td>
                </tr>
              </thead>
              <tbody>
                {
                  members.map((member, index) => (
                    <tr key={member._id}>
                      <td>{index + 1}</td>
                      <td>
                        {
                          edit && editId === member._id ? (
                            <input type="text" name="empId" value={empId} onChange={handleChange} />
                          ) : (
                            member.employee_id
                          )
                        }
                      </td>
                      <td>
                        {
                          edit && editId === member._id ? (
                            <input type="text" name="empName" value={empName} onChange={handleChange} />
                          ) : (
                            member.employee_name
                          )
                        }
                      </td>
                      <td>
                        {edit && editId === member._id ? (
                          <input type="number" name="experience" value={experience} onChange={handleChange} />
                        ) : (
                          member.experience
                        )}
                      </td>
                      <td>
                        {edit && editId === member._id ? (
                          <>
                            <button onClick={handleDone}>Done</button>
                          </>
                        ) : (
                          <button onClick={() => handleEdit(member._id)}>Edit</button>
                        )}
                      </td>
                      <td>
                        {edit && editId === member._id ? (
                          <button onClick={handleCancel}>Cancel</button>) :
                          <button onClick={() => handleDelete(member._id)}>Delete</button>
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )
        )
      }
    </>
  );
}

export default Teams;
