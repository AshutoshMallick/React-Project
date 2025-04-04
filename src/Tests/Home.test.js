import React from "react";
import { shallow } from "enzyme";
import Home from "../Pages/Home";
import { token, mockData1, mockTeam, mockData2 } from "./mockData";

describe("Testing Header Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  let component;
  const historyMock = { push: jest.fn() };

  beforeEach(() => {
    component = shallow(<Home history={historyMock} />);
    component.instance().getLocalStorage = jest.fn();
    component
      .instance()
      .getLocalStorage.mockReturnValueOnce(
        token
      );
    const mockSuccessResponse = [];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); // 4
  });

  test("on token null route to login", async () => {
    const historyMock = { push: jest.fn() };
    shallow(<Home history={historyMock} />);
    expect(historyMock.push.mock.calls[0]).toEqual(["/login"]);
  });

  test("on component did mount", async (done) => {
    component.instance().handleGetMembers = jest.fn();
    component.instance().handleGetMembers.mockReturnValueOnce(mockData1);
    component.instance().handleGetTech = jest.fn();
    component.instance().handleGetTech.mockReturnValueOnce(mockTeam);
    const spy1 = await jest.spyOn(component.instance(), "handleGetMembers");
    await component.instance().componentDidMount();
    expect(spy1).toHaveBeenCalledWith("/api/tracker/members/display");
    expect(component.state().initialData).toEqual(mockData1);
    expect(component.state().team).toEqual(mockTeam);
    expect(component.state().data).toEqual(mockData2);
    expect(component.find("Teams").length).toBe(1);
    done();
  });

  test("Home filter content content", () => {
    const component = shallow(<Home />);
    expect(component.find("withRouter(Header)").length).toBe(1);
    expect(component.find("section label").at(0).text()).toBe("Filter By");
    expect(component.find("section input").at(0).props().type).toBe("radio");
    expect(component.find("section input").at(0).props().checked).toBe(true);
    expect(component.find("section label").at(1).text()).toBe("Expericence");
    expect(component.find("section input").at(1).props().type).toBe("radio");
    expect(component.find("section input").at(1).props().checked).toBe(false);
    expect(component.find("section label").at(2).text()).toBe("Team");
    expect(component.find("section input").at(2).props().type).toBe("radio");
    expect(component.find("section input").at(2).props().checked).toBe(false);
    expect(component.find("section label").at(3).text()).toBe("Both");
    expect(component.find("section input").at(3).props().type).toBe("number");
    expect(component.find("section button").at(0).props().disabled).toBe(true);
    expect(component.find("section button").at(0).text()).toBe("Go");
    expect(component.find("section button").at(1).text()).toBe("Clear");
    expect(component.find("Teams").length).toBe(0);
    expect(component.find("div").text()).toBe("No Teams Found");
  });

  test("handle get Member", async () => {
    const spy = await jest.spyOn(component.instance(), "handleGetMembers");
    spy("/api/tracker/members/display");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/members/display", {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    });
  });
  test("handle get tech", async () => {
    const spy = await jest.spyOn(component.instance(), "handleGetTech");
    spy();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/technologies/get", {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    });
  });

  test("handleDeleteMembers", async () => {
    const spy = await jest.spyOn(component.instance(), "handleDeleteMembers");
    spy(2);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/members/delete/2", {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
      method: "Delete",
    });
  });

  test("handleEdit", async () => {
    component.instance().setState({ initialData: mockData1 });
    const spy = await jest.spyOn(component.instance(), "handleEdit");
    spy("5fa8cb932984eb04110ee7df");
    expect(component.state().edit).toBe(true);
    expect(component.state().editId).toBe("5fa8cb932984eb04110ee7df");
    expect(component.state().empId).toBe(100001);
    expect(component.state().empName).toBe("Sara");
    expect(component.state().experience).toBe(3);
  });

  test("handleEdit ", async () => {
    component.instance().setState({ initialData: mockData1 });
    const spy = await jest.spyOn(component.instance(), "handleEdit");
    spy("5fa8cb932984eb04110ee7df");
    expect(component.state().edit).toBe(true);
    expect(component.state().editId).toBe("5fa8cb932984eb04110ee7df");
    expect(component.state().empId).toBe(100001);
    expect(component.state().empName).toBe("Sara");
    expect(component.state().experience).toBe(3);
  });

  test("Edit Request", async () => {
    component.instance().setState({ editId: "5fa8cb932984eb04110ee7df", empId: 100001, empName: "Sara", experience: 3 });
    const spy = await jest.spyOn(component.instance(), "handleEditRequest");
    spy();
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/members/update/5fa8cb932984eb04110ee7df", {
      body: "{\"employee_id\":100001,\"employee_name\":\"Sara\",\"experience\":3}",
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      method: "PATCH",
    });
  });

  test("Only Experience", async () => {
    const spy = await jest.spyOn(component.instance(), "handleGo");
    const spy1 = await jest.spyOn(component.instance(), "handleGetMembers");
    expect(component.find("button").at(0).props().disabled).toBe(true)
    component
      .find("input").at(3)
      .simulate("change", { target: { name: "experienceFilter", value: "2" } });
    expect(component.find("button").at(0).props().disabled).toBe(false)
    component.find("button").at(0).simulate("click")
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith("/api/tracker/members/display?experience=2");
  });

  test("Only team", async () => {
    component.instance().setState({ team: mockTeam })
    const spy = await jest.spyOn(component.instance(), "handleGo");
    const spy1 = await jest.spyOn(component.instance(), "handleGetMembers");
    expect(component.find("button").at(0).props().disabled).toBe(true)
    component
      .find("input").at(1)
      .simulate("change", { target: { name: "checked", value: "Team" } });
    expect(component.find("button").at(0).props().disabled).toBe(true)
    component
      .find("select")
      .simulate("change", { target: { name: "teamName", value: "Frontend" } });
    expect(component.find("button").at(0).props().disabled).toBe(false)
    component.find("button").at(0).simulate("click")
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith("/api/tracker/members/display?tech=Frontend");
  });

  test("Both team and experience", async () => {
    component.instance().setState({ team: mockTeam })
    const spy = await jest.spyOn(component.instance(), "handleGo");
    const spy1 = await jest.spyOn(component.instance(), "handleGetMembers");
    expect(component.find("button").at(0).props().disabled).toBe(true)
    component
      .find("input").at(2)
      .simulate("change", { target: { name: "checked", value: "Both" } });
    expect(component.find("button").at(0).props().disabled).toBe(true)
    component
      .find("input").at(3)
      .simulate("change", { target: { name: "experienceFilter", value: "2" } });
    expect(component.find("button").at(0).props().disabled).toBe(true)
    component
      .find("select")
      .simulate("change", { target: { name: "teamName", value: "Frontend" } });
    expect(component.find("button").at(0).props().disabled).toBe(false)
    component.find("button").at(0).simulate("click")
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith("/api/tracker/members/display?experience=2&&tech=Frontend");
  });
});
