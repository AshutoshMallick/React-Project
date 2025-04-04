import React from "react";
import { shallow } from "enzyme";
import Login from "../Pages/Login";
import { token } from "./mockData";

describe("Testing Login Page", () => {
  window.alert = jest.fn();
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null),
      },
      writable: true,
    });
    const mockSuccessResponse = [];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise); // 4
  });

  test("On Clicking Login button", async () => {
    const historyMock = { push: jest.fn() };
    const component = shallow(<Login history={historyMock} />);
    expect(component.find(".login h1").text()).toBe("Login");
    expect(component.find(".login button").text()).toBe("Login");
    expect(component.find(".login button").props().disabled).toBe(true);
    component
      .find(".login input")
      .at(0)
      .simulate("change", {
        target: { name: "name", value: "Admin" },
      });
    expect(component.find(".login input").at(0).props().value).toBe("Admin");
    expect(component.find(".login button").props().disabled).toBe(true);
    component
      .find(".login input")
      .at(1)
      .simulate("change", {
        target: { name: "password", value: "Fresco@123" },
      });
    expect(component.find(".login input").at(1).props().value).toBe(
      "Fresco@123"
    );
    expect(component.find(".login button").text()).toBe("Login");
    expect(component.find(".login button").props().disabled).toBe(false);
    component.instance().loginRequest = jest.fn();
    component.instance().loginRequest.mockResolvedValue({
      token: token,
    });
    const spy = await jest.spyOn(component.instance(), "loginRequest");
    component.find(".login button").simulate("click");
    expect(spy).toHaveBeenCalled();
  });

  test("loginRequest", async () => {
    const historyMock = { push: jest.fn() };
    const component = shallow(<Login history={historyMock} />);
    const spy = await jest.spyOn(component.instance(), "loginRequest");
    spy();
    expect(global.fetch).toHaveBeenCalledWith("/api/admin/login", {
      body: "{\"name\":\"\",\"password\":\"\"}",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      "method": "post",
    });
    global.fetch.mockClear();
  });
});
