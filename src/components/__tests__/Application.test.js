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
import axios from "axios";

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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    //render
    const {container} = render(<Application />);
    //check if initial render shows all appointments
    await waitForElement(() => getByText(container, `Archie Cohen`));

    expect(getByText(container, `Archie Cohen`)).toBeInTheDocument();
    //select appointment that has SHOW interview as node
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    //click on the trash button and check if node transitioned to confirm delete
    
    fireEvent.click(getByAltText(appointment, "Delete"))
    expect(getByText(appointment, `Delete the appointment?`)).toBeInTheDocument();
    //click on the cancel button and check if node transitioned to SHOW appoinment
    fireEvent.click(getByText(appointment, "Cancel"))
    expect(getByText(appointment, `Archie Cohen`)).toBeInTheDocument();
    //click on the trash button and check if node transitioned to CONFIRM appoinment delete
    fireEvent.click(getByAltText(appointment, "Delete"))
    expect(getByText(appointment, `Delete the appointment?`)).toBeInTheDocument();
    
    //click on confirm delete
    fireEvent.click(getByText(appointment, "Confirm"))

    //Wait until the delete is confirmed
    await waitForElement(() => getByTitle(appointment, `add_button`));
    
    //check if appointment node is now EMPTY
    expect(getByTitle(appointment, `add_button`)).toBeInTheDocument();
    
    //check if monday now has 2 spots remaining
    const dayList = getAllByRole(container, "listitem");
    const monday = dayList[0]

    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument()

  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //render
    const {container} = render(<Application />);
    //check if initial render shows all appointments
    await waitForElement(() => getByText(container, `Archie Cohen`));
    //grab appointment that has interview SHOW
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    //click on the edit button and check if node transitioned to form
    
    fireEvent.click(getByAltText(appointment, "Edit"))
    expect(getByRole(appointment, `form`)).toBeInTheDocument();
    //change name value
    //change name input and check if node contains new name input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Popeye"}})
    expect(getByPlaceholderText(appointment, "Enter Student Name")).toHaveProperty("value", "Popeye");
    
    // click on cancel Button and check if node goes to SHOW and has old values
    fireEvent.click(getByText(appointment, "Cancel"))
    expect(getByText(appointment, `Archie Cohen`)).toBeInTheDocument();
    //click on edit button
    fireEvent.click(getByAltText(appointment, "Edit"))

    //change name value and check if node contains new name input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Popeye"}})
    //click to submit
    fireEvent.click(getByText(appointment, "Save"))
    //check if transition to SAVE 
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    //await change to show with new name or interviewer value
    await waitForElement(() => getByText(appointment, `Popeye`));
    // check if show has new name or interviewer value
    expect(getByText(appointment, `Popeye`)).toBeInTheDocument();

    //check if monday now has 2 spots remaining
    const dayList = getAllByRole(container, "listitem");
    const monday = dayList[0]
    
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument()
  })

  /* test number six */
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce()
    //render
    const {container} = render(<Application />);
    //check if initial render shows all appointments
    await waitForElement(() => getByText(container, `Archie Cohen`));
    //grab appointment that has interview SHOW
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    //click on the edit button and check if node transitioned to form
    
    fireEvent.click(getByAltText(appointment, "Edit"))
    //change name value
    //change name input and check if node contains new name input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Popeye"}})
    
    //fake a failing submission
    fireEvent.click(getByText(appointment, "Save"))
    await waitForElement(() => getByText(appointment, "Whoops. Something went wrong with saving the interview. Try again."));
    console.log(prettyDOM(appointment))

    //check if transition to Error
    expect(getByText(appointment, "Whoops. Something went wrong with saving the interview. Try again.")).toBeInTheDocument();
  });

  it("shows the delete error when failing to save an appointment", async () => {
    axios.delete.mockRejectedValueOnce()
    //render
    const {container} = render(<Application />);
    //check if initial render shows all appointments
    await waitForElement(() => getByText(container, `Archie Cohen`));
    //grab appointment that has interview SHOW
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    //click on the delete button and check if node transitioned to confirm
    
    fireEvent.click(getByAltText(appointment, "Delete"))
    fireEvent.click(getByText(appointment, "Confirm"))
    await waitForElement(() => getByText(appointment, `Whoops. Something went wrong with deleting the interview. Try again.`));
    
    //check if transition to Error
    expect(getByText(appointment, "Whoops. Something went wrong with deleting the interview. Try again.")).toBeInTheDocument();
  });
});

