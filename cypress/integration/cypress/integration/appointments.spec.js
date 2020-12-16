describe("Appointment", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
  
    cy.visit("/");
  
    cy.contains("Monday");
   });

  it("should book an interview", () => {
    cy.get(':nth-child(2) > .appointment__add > .appointment__add-button')
      .first()
      .click();

    cy.get('input').should('have.class', 'appointment__create-input')
    .type("Lydia Miller-Jones")
    

    cy.get(':nth-child(1) > .interviewers__item-image').click()

    cy.get('.button--confirm').click()

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  })

  it("should edit an interview", () => {
    cy.get("[alt=Edit]").click({ force: true });

    cy.get('input').should('have.class', 'appointment__create-input')
    .clear()
    .type("Popeye");

    cy.get(':nth-child(2) > .interviewers__item-image').click()

    cy.get('.button--confirm').click()

    cy.contains(".appointment__card--show", "Popeye");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  })
  
  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").click({ force: true });

    cy.contains("Confirm").click();
    cy.contains("Deleting...")
    cy.contains(".appointment__card--show", "Popeye").should("not.exist")
  })



});