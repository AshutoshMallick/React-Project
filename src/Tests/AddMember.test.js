import React from "react";
import { shallow } from "enzyme";
import AddMember from "../Pages/AddMember";
import { token, mockTeam } from "./mockData";

describe("Testing Header Component", () => {
  let component;
  beforeEach(() => {
    component = shallow(<AddMember />);
    component.instance().getLocalStorage = jest.fn();
    component.instance().getLocalStorage.mockReturnValueOnce(token);
    const mockSuccessResponse = [];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); // 4
  });

  test("OnMount", async () => {
    const historyMock = { push: jest.fn() };
    const component = shallow(<AddMember history={historyMock} />);
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(token);
    component.instance().handleGetTeam = jest.fn();
    component.instance().handleGetTeam.mockReturnValueOnce(mockTeam);
    await component.instance().componentDidMount();
    expect(component.state().teams).toEqual(mockTeam);
  });

  test("AddMember Page Content", () => {
    const component = shallow(<AddMember />);
    expect(component.find("withRouter(Header)").length).toBe(1);
    expect(component.find("form h1").text()).toBe("Add Team Member");
    expect(component.find("form div input").length).toBe(3);
    expect(component.find("form div select").length).toBe(1);
    expect(component.find("form div button").at(0).text()).toBe("+");
    expect(component.find("form div button").at(1).text()).toBe("Delete");
    expect(component.find("form div button").at(2).text()).toBe("Add");
    expect(component.find("form div button").at(3).text()).toBe("Clear");
  });

  test("AddMember Initial Error", () => {
    const component = shallow(<AddMember />);
    expect(component.find("form div span").at(0).text()).toBe("");
    expect(component.find("form div span").at(1).text()).toBe("");
    expect(component.find("form div span").at(2).text()).toBe("");
  });

  test("error message content", async () => {
    const mockfn1 = jest.fn();
    const component = shallow(<AddMember />);
    component.setState({ teams: mockTeam });
    expect(component.find("form div button").at(2).props().disabled).toBe(true);

    // error msg for emp id
    component
      .find("form div input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "10000" },
      });
    expect(component.find("form div span").at(0).text()).toBe("*Employee ID is expected between 100000 and 3000000");
    component
      .find("form div input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "" },
      });
    expect(component.find("form div span").at(0).text()).toBe("*Please enter a value");
    component
      .find("form div input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "100002" },
      });
    expect(component.find("form div span").at(0).text()).toBe("");

    // error msg for emp name
    component
      .find("form div input")
      .at(1)
      .simulate("change", {
        target: { name: "empName", value: "A" },
      });
    expect(component.find("form div span").at(1).text()).toBe("Employee Name should have atleast 3 letters");
    component
      .find("form div input")
      .at(1)
      .simulate("change", {
        target: { name: "empName", value: "A@" },
      });
    expect(component.find("form div span").at(1).text()).toBe("Employee name can have only alphabets and spaces");
    component
      .find("form div input")
      .at(1)
      .simulate("change", {
        target: { name: "empName", value: "" },
      });
    expect(component.find("form div span").at(1).text()).toBe("*Please enter a value");
    component
      .find("form div input")
      .at(1)
      .simulate("change", {
        target: { name: "empName", value: "Anu" },
      });
    expect(component.find("form div span").at(1).text()).toBe("");

    // error msg for experience
    component
      .find("form div input")
      .at(2)
      .simulate("change", {
        target: { name: "experience", value: "" },
      });
    expect(component.find("form div span").at(2).text()).toBe("*Please enter a value");
    component
      .find("form div input")
      .at(2)
      .simulate("change", {
        target: { name: "experience", value: "2" },
      });
    expect(component.find("form div span").at(2).text()).toBe("");
    expect(component.find("form div button").at(2).props().disabled).toBe(true);

    // selecting team
    expect(component.find("select option").at(1).text()).toBe("Backend");
    expect(component.find("select option").at(2).text()).toBe("Frontend");
    component
      .find("select")
      .simulate("change", { target: { name: "teamName", value: "Frontend" } });

    //button enabled
    expect(component.find("form div button").at(2).props().disabled).toBe(false);
    expect(component.find("form div input").at(0).props().value).toBe("100002");
    expect(component.find("form div input").at(1).props().value).toBe("Anu");
    expect(component.find("form div input").at(2).props().value).toBe("2");
    expect(component.find("form div select").props().value).toBe("Frontend");
    component.instance().AddRequest = jest.fn();
    component.instance().AddRequest.mockReturnValueOnce(201);
    const spy = await jest.spyOn(component.instance(), "handleAddMember");
    const spy1 = await jest.spyOn(component.instance(), "AddRequest");
    component
      .find("form div button")
      .at(2)
      .simulate("click", {
        preventDefault: () => { },
      });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  test("Reset in add member", async () => {
    const component = shallow(<AddMember />);

    component.setState({
      teams: mockTeam,
    });
    expect(component.find("form div button").at(2).props().disabled).toBe(true);
    component
      .find("form div input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "100002" },
      });
    expect(component.find("form div span").at(0).text()).toBe("");
    component
      .find("form div input")
      .at(1)
      .simulate("change", {
        target: { name: "empName", value: "Anu" },
      });
    expect(component.find("form div span").at(1).text()).toBe("");
    component
      .find("form div input")
      .at(2)
      .simulate("change", {
        target: { name: "experience", value: "2" },
      });
    expect(component.find("form div span").at(2).text()).toBe("");
    component
      .find("form div input")
      .at(2)
      .simulate("change", {
        target: { name: "experience", value: "2" },
      });
    expect(component.find("form div span").at(2).text()).toBe("");
    expect(component.find("form div button").at(2).props().disabled).toBe(true);
    expect(component.find("select option").at(1).text()).toBe("Backend");
    expect(component.find("select option").at(2).text()).toBe("Frontend");
    component
      .find("select")
      .simulate("change", { target: { name: "teamName", value: "Frontend" } });
    expect(component.find("form div button").at(2).props().disabled).toBe(false);
    expect(component.find("form div input").at(0).props().value).toBe("100002");
    expect(component.find("form div input").at(1).props().value).toBe("Anu");
    expect(component.find("form div input").at(2).props().value).toBe("2");
    expect(component.find("form div select").props().value).toBe("Frontend");
    const spy = await jest.spyOn(component.instance(), "handleClear");
    component
      .find("form div .button")
      .at(1)
      .simulate("click");
    expect(spy).toHaveBeenCalled();
    expect(component.find("form div input").at(0).props().value).toBe("");
    expect(component.find("form div input").at(1).props().value).toBe("");
    expect(component.find("form div input").at(2).props().value).toBe("");
  });


  test("create new team", async () => {
    const component = shallow(<AddMember />);
    const spy = await jest.spyOn(component.instance(), "handleAddOrDeleteTeam");
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(
        token
      );
    component
      .find("form div button")
      .at(0)
      .simulate("click", {
        preventDefault: () => { },
      });
    expect(spy).toHaveBeenCalled()
    expect(component.find(".addList p").text()).toBe("Create New Label");
    expect(component.find(".addList input").props().value).toBe("");
    expect(component.find(".addList button").at(0).text()).toBe("Save");
    expect(component.find(".addList button").at(1).text()).toBe("Cancel");
    component
      .find("form div input")
      .at(2)
      .simulate("change", {
        target: { name: "newTeam", value: "Cyber" },
      });
    component.find(".addList button").at(0).simulate("click", {
      preventDefault: () => { },
    })
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/technologies/add", {
      body:
        "{\"technology_name\":\"Cyber\"}",
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      method: "post",
    });
    global.fetch.mockClear();
  });

  test("AddRequest", async () => {
    const historyMock = { push: jest.fn() };
    const component = shallow(<AddMember history={historyMock} />);
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(token);
    component.instance().handleGetTeam = jest.fn();
    component.instance().handleGetTeam.mockReturnValueOnce(mockTeam);
    const spy = await jest.spyOn(component.instance(), "AddRequest");
    spy();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/members/add", {
      body:
        '{"employee_id":"","employee_name":"","technology_name":"","experience":""}',
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      method: "post",
    });
    global.fetch.mockClear();
  });


  test("handle get tech", async () => {
    const component = shallow(<AddMember />);
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(
        token
      );
    const spy = await jest.spyOn(component.instance(), "handleGetTeam");
    spy();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/technologies/get", {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    });
    global.fetch.mockClear();
  });


  test("handle Action", async () => {
    const historyMock = { push: jest.fn() };
    const component = shallow(<AddMember history={historyMock} />);
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(
        token
      );
    component.instance().handleGetTeam = jest.fn();
    component.instance().handleGetTeam.mockReturnValueOnce(mockTeam);
    await component.instance().componentDidMount();
    const spy = await jest.spyOn(component.instance(), "handleAddOrDeleteTeam");
    component
      .find("form div button")
      .at(0)
      .simulate("click", {
        preventDefault: () => { },
      });
    component
      .find("form div button")
      .at(1)
      .simulate("click", {
        preventDefault: () => { },
      });
    expect(component.find(".addList p").text()).toBe("Delete Team")
    expect(spy).toHaveBeenCalled()
    expect(component.find("table tbody tr").at(0).find("td").at(0).text()).toBe("Backend")
    expect(component.find("table tbody tr").at(0).find("td").at(1).find("img").length).toBe(1)
    expect(component.find("table tbody tr").at(1).find("td").at(0).text()).toBe("Frontend")
    expect(component.find("table tbody tr").at(1).find("td").at(1).find("img").length).toBe(1)
    expect(component.find("table tbody tr").at(2).find("td").find("button").text()).toBe("Cancel")
    const spy1 = await jest.spyOn(component.instance(), "handleRemoveTeam");
    const spy2 = await jest.spyOn(component.instance(), "removeTeamRequest");
    component.find("table tbody tr").at(1).find("td").at(1).find("img").simulate("click", {
      preventDefault: () => { },
    }, "Frontend")
    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalledWith("Frontend")
    global.fetch.mockClear();
  });

  test("handle Delete team", async () => {
    const component = shallow(<AddMember />);
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjkyNjc2YmY0Nzg4MzA1MjMwM2YzZDAiLCJpYXQiOjE2MDQ5MTYwMTR9.oJL24_l0eUWo9PYtM - uFvDNlA_W8HKghy1vwPZmB_Ew"
      );
    const spy = await jest.spyOn(component.instance(), "removeTeamRequest");
    spy("Frontend");
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/technologies/remove/Frontend", {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
      "method": "Delete",
    });
    global.fetch.mockClear();
  });

});
