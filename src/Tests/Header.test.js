import React from "react";
import { shallow } from "enzyme";
import { Header } from "../Components/Header";

describe("Testing Header Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null),
      },
      writable: true,
    });
  });
  test("Header Links", () => {
    const mockfn1 = jest.fn();
    const component = shallow(
      <Header handleLogout={mockfn1} handleHome={mockfn1} />
    );
    const nav = component.find("nav");
    expect(nav.find("Link").at(0).props().children).toBe("Add Member");
    expect(nav.find("Link").at(1).props().children).toBe("Move Member");
    expect(nav.find("Link").at(0).props().to).toBe("/addMember");
    expect(nav.find("Link").at(1).props().to).toBe("/moveMember");
  });

  test("Header img clicks", () => {
    const historyMock = { push: jest.fn() };
    const handleHome = jest.fn();
    const component = shallow(<Header history={historyMock} />);
    component.handleOnChange = handleHome;
    const header = component.find("header").find("h1");
    expect(header.text()).toBe("Team Tracker");
    header.find("img").at(1).simulate("click");
    expect(historyMock.push.mock.calls[0]).toEqual(["/"]);
    jest.clearAllMocks();
    header.find("img").at(0).simulate("click");
    expect(historyMock.push.mock.calls[0]).toEqual(["/login"]);
  });
});
