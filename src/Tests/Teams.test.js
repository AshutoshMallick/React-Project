import React from "react";
import { shallow } from "enzyme";
import Teams from "../Components/Teams";
import { mockData2 } from "./mockData";

describe("Testing Header Component", () => {
  test("Teams table content", () => {
    const mockfn1 = jest.fn();
    const component = shallow(
      <Teams
        data={mockData2}
        edit={false}
        editId={undefined}
        empId=""
        empName=""
        experience=""
        handleCancel={mockfn1}
        handleDone={mockfn1}
        handleEdit={mockfn1}
        handleDelete={mockfn1}
        handleChange={mockfn1}
      />
    );
    const headRow1 = component.find("table").at(0).find("thead tr");
    expect(headRow1.find("td").text()).toBe("Backend");
    const headRow2 = component.find("table").at(1).find("thead tr");
    expect(headRow2.find("td").text()).toBe("Frontend");
    const Tbody1 = component.find("table").at(0).find("tbody tr");
    expect(Tbody1.at(0).find("td").at(0).text()).toBe("1");
    expect(Tbody1.at(0).find("td").at(1).text()).toBe("100002");
    expect(Tbody1.at(0).find("td").at(2).text()).toBe("Anu");
    expect(Tbody1.at(0).find("td").at(3).text()).toBe("2");
    expect(Tbody1.at(0).find("td").at(4).find("button").text()).toBe("Edit");
    expect(Tbody1.at(0).find("td").at(5).find("button").text()).toBe("Delete");
    expect(Tbody1.at(1).find("td").at(0).text()).toBe("2");
    expect(Tbody1.at(1).find("td").at(1).text()).toBe("100010");
    expect(Tbody1.at(1).find("td").at(2).text()).toBe("Tara");
    expect(Tbody1.at(1).find("td").at(3).text()).toBe("3");
    const Tbody2 = component.find("table").at(1).find("tbody tr");
    expect(Tbody2.at(0).find("td").at(0).text()).toBe("1");
    expect(Tbody2.at(0).find("td").at(1).text()).toBe("100001");
    expect(Tbody2.at(0).find("td").at(2).text()).toBe("Sara");
    expect(Tbody2.at(0).find("td").at(3).text()).toBe("3");
    expect(Tbody2.at(0).find("td").at(4).find("button").text()).toBe("Edit");
    expect(Tbody2.at(0).find("td").at(5).find("button").text()).toBe("Delete");
  });

  test("Teams table Button click", () => {
    const mockfn1 = jest.fn();
    const mockfn2 = jest.fn();

    const component = shallow(
      <Teams
        data={mockData2}
        edit={false}
        editId={undefined}
        empId=""
        empName=""
        experience=""
        handleCancel={mockfn1}
        handleDone={mockfn1}
        handleEdit={mockfn1}
        handleDelete={mockfn2}
        handleChange={mockfn1}
      />
    );
    const Tbody1 = component.find("table").at(0).find("tbody tr");
    Tbody1.at(0).find("td").at(4).find("button").simulate("click");
    expect(mockfn1).toBeCalled();
    Tbody1.at(0).find("td").at(5).find("button").simulate("click");
    expect(mockfn2).toBeCalled();
  });
  test("Teams table Edit mode", () => {
    const mockfn1 = jest.fn();
    const mockfn2 = jest.fn();

    const component = shallow(
      <Teams
        data={mockData2}
        edit={true}
        editId={"5fa8cae02984eb04110ee7de"}
        empId={100010}
        empName="Tara"
        experience="3"
        handleCancel={mockfn2}
        handleDone={mockfn1}
        handleEdit={mockfn1}
        handleDelete={mockfn1}
        handleChange={mockfn1}
      />
    );
    const Tbody1 = component.find("table").at(0).find("tbody tr");
    Tbody1.at(1).find("td").at(4).find("button").simulate("click");
    expect(mockfn1).toBeCalled();
    Tbody1.at(1).find("td").at(5).find("button").simulate("click");
    expect(mockfn2).toBeCalled();
    expect(Tbody1.at(1).find("td").at(1).find("input").props().value).toBe(
      100010
    );
    expect(Tbody1.at(1).find("td").at(2).find("input").props().value).toBe(
      "Tara"
    );
    expect(Tbody1.at(1).find("td").at(3).find("input").props().value).toBe("3");
    expect(Tbody1.at(1).find("td").at(4).find("button").text()).toBe("Done");
    expect(Tbody1.at(1).find("td").at(5).find("button").text()).toBe("Cancel");
  });
});
