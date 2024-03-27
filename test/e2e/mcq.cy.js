describe('Multiple Choice Question', function () {
  beforeEach(function () {
    cy.getData()
    cy.visit('/');
  });

  it('should display the mcq component', function () {
    const mcqComponents = this.data.components.filter((component) => component._component === 'mcq')
    mcqComponents.forEach((mcqComponent) => {
      cy.visit(`/#/preview/${mcqComponent._id}`);
      const bodyWithoutHtml = cy.helpers.stripHtml(mcqComponent.body)
      cy.testContainsOrNotExists('.mcq__body', bodyWithoutHtml)

      cy.testContainsOrNotExists('.mcq__title', mcqComponent.displayTitle)
      cy.testContainsOrNotExists('.mcq__instruction', mcqComponent.instruction)
      cy.get('.mcq-item').should('have.length', mcqComponent._items.length)
      mcqComponent._items.forEach((item) => {
        cy.testContainsOrNotExists('.mcq-item__text', item.text)
      })
      
      // Make sure the current component is tested before moving to the next one
      // Custom cypress tests are async so we need to wait for them to pass first
      cy.wait(1000)
    });
  });
});