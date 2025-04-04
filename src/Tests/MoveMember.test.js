import React from "react";
import { shallow } from "enzyme";
import MoveMember from "../Pages/MoveMember";
import { token, mockTeam, mockData1 } from "./mockData";

describe("Testing Header Component", () => {
  let component
  let historyMock
  afterEach(() => {
    global.fetch.mockClear();
  })
  beforeEach(() => {
    historyMock = { push: jest.fn() };
    component = shallow(<MoveMember history={historyMock} />);
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

  test("Route to login", () => {
    expect(historyMock.push.mock.calls[0]).toEqual(["/login"]);
  });

  test("OnMount", async () => {
    component.instance().handleGetTeam = jest.fn();
    component.instance().handleGetTeam.mockReturnValueOnce(mockTeam);
    component.instance().handleGetMembers = jest.fn();
    component.instance().handleGetMembers.mockReturnValueOnce(mockData1);
    await component.instance().componentDidMount();
    expect(component.state().teams).toEqual(mockTeam);
    expect(component.state().data).toEqual(mockData1);
  });

  test("Modal content", () => {
    component.instance().setState({ teams: mockTeam })
    expect(component.find("withRouter(Header)").length).toBe(1);
    expect(component.find("form h1").text()).toBe("Move Team Member");
    expect(component.find("form input").length).toBe(1);
    expect(component.find("form select").length).toBe(2);
    expect(component.find("select option").at(1).text()).toBe("Backend");
    expect(component.find("select option").at(2).text()).toBe("Frontend");
    expect(component.find("form div button").at(0).text()).toBe("Move")
    expect(component.find("form div button").at(1).text()).toBe("Clear")
  });

  test("Error Msg", async () => {
    component.instance().setState({ teams: mockTeam, data: mockData1 })
    expect(component.find("form div button").at(0).props().disabled).toBe(true)
    component
      .find(".MoveMember input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "10000" },
      });
    expect(component.find("form span").text()).toBe("*Employee ID is expected between 100000 and 3000000");
    component
      .find("form input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "" },
      });
    expect(component.find("form span").at(0).text()).toBe("*Please enter a value");
    component
      .find("form input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "100002" },
      });
    expect(component.find("form span").at(0).text()).toBe("");
    expect(component.find("form div button").at(0).props().disabled).toBe(true)
    component
      .find("select").at(0)
      .simulate("change", { target: { name: "from", value: "Backend" } });
    expect(component.find("form div button").at(0).props().disabled).toBe(true)
    component
      .find("select").at(1)
      .simulate("change", { target: { name: "to", value: "Frontend" } });
    expect(component.find("form div button").at(0).props().disabled).toBe(false)
    const spy = await jest.spyOn(component.instance(), "MoveRequest");
    component.find("form div button").at(0).simulate("click", {
      preventDefault: () => { },
    });
    expect(spy).toHaveBeenCalledWith("5fa8cacb2984eb04110ee7dd")
  });

  test("Clear", () => {
    component.instance().setState({ teams: mockTeam })
    expect(component.find("form div button").at(0).props().disabled).toBe(true)
    component
      .find(".MoveMember input")
      .at(0)
      .simulate("change", {
        target: { name: "empId", value: "100002" },
      });
    component
      .find("select").at(0)
      .simulate("change", { target: { name: "from", value: "Backend" } });
    component
      .find("select").at(1)
      .simulate("change", { target: { name: "to", value: "Frontend" } });
    expect(component.find(".MoveMember input").at(0).props().value).toBe("100002")
    expect(component.find("select").at(0).props().value).toBe("Backend")
    expect(component.find("select").at(1).props().value).toBe("Frontend")
    expect(component.find("form div button").at(0).props().disabled).toBe(false)
    component.find("form div button").at(1).simulate("click")
    expect(component.find("form div button").at(0).props().disabled).toBe(true)
    expect(component.find(".MoveMember input").at(0).props().value).toBe("")
    expect(component.find("select").at(0).props().value).toBe("")
    expect(component.find("select").at(1).props().value).toBe("")
  });

  test("handle Move Request", async () => {
    component.instance().setState({ to: "Backend" })
    const spy = await jest.spyOn(component.instance(), "MoveRequest");
    spy("5fa8cacb2984eb04110ee7dd");
    expect(global.fetch).toHaveBeenCalledWith("/api/tracker/members/update/5fa8cacb2984eb04110ee7dd", {
      body: "{\"technology_name\":\"Backend\"}",
      headers: {
        Authorization:
          `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      "method": "PATCH",
    });
  });

});
