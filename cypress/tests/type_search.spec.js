describe('Type to search', () => {
    it('Visits the site and type to search', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('#search-input').should('exist');

        cy.get('table.el-table__body tbody').contains('Rat');
    });
});