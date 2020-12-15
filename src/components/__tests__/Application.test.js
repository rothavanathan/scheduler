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
  getByAltText
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

    await waitForElement(() => getByText(container, `Archie Cohen`));

    expect(getByText(container, `Archie Cohen`)).toBeInTheDocument();

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    console.log(prettyDOM(container))

    //click on appointment that does not have interview booked
    fireEvent.click(getByTitle(appointment, "add_button"))
    expect(getByText(appointment, `Interviewer`)).toBeInTheDocument();
    //change name input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Popeye"}})
    //click on interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    //click on save button
    fireEvent.click(getByText(appointment, "Save"))
    

    
    waitForElement(() => getByText(appointment, "Saving..."));
    expect(getByText(appointment, `Saving...`)).toBeInTheDocument();

    // fireEvent.click()
  })
})

