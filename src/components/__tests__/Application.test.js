import React from "react";

import { 
  render, 
  cleanup, 
  waitForElement, 
  getByText, 
  prettyDOM, 
  getAllByTestId,
  getByTitle,
  getByPlaceholderText,
  getByAltText,
  getByRole,
  getAllByRole
  } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe("Application", ()=> {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container,"Monday"))
    fireEvent.click(getByText(container, "Tuesday"));
    expect(getByText(container, "Leopold Silvers")).toBeInTheDocument();  
  });

  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const {container} = render(<Application />);
    //check if initial render shows all appointments
    await waitForElement(() => getByText(container, `Archie Cohen`));

    expect(getByText(container, `Archie Cohen`)).toBeInTheDocument();

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    //click on appointment that does not  have interview booked
    fireEvent.click(getByTitle(appointment, "add_button"))
    expect(getByText(appointment, `Interviewer`)).toBeInTheDocument();

    //change name input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Popeye"}})

    //click on interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //click on save button and check if saving action occurs
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, `Saving...`)).toBeInTheDocument();

    //check if saving action completes
    await waitForElement(() => getByText(appointment, "Popeye"));
    expect(getByText(appointment, `Popeye`)).toBeInTheDocument();

    //check if fully booked day has the message no spots remaining
    const dayList = getAllByRole(container, "listitem");
    const monday = dayList[0]

    expect(getByText(monday, "no spots remaining")).toBeInTheDocument()
  })
})

