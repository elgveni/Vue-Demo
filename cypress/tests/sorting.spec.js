describe('Sorting interface', () => {
    it('Visits the site and sorting by ASC on click at Organ', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('.el-table__header-wrapper table.el-table__header tr th.el-table_1_column_1 .ascending').click();

        cy.get('table.el-table__body tbody tr td div').contains('Bladder');
    });

    it('Visits the site and sorting by DESC on click at Organ', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('.el-table__header-wrapper table.el-table__header tr th.el-table_1_column_1 .descending').click();

        cy.get('table.el-table__body tbody').contains('Whole body');
    });

    it('Visits the site and sorting by ASC on click at Species', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('.el-table__header-wrapper table.el-table__header tr th.el-table_1_column_2 .ascending').click();

        cy.get('table.el-table__body tbody tr td div').contains('Rat');
    });

    it('Visits the site and sorting by DESC on click at Species', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('.el-table__header-wrapper table.el-table__header tr th.el-table_1_column_2 .descending').click();

        cy.get('table.el-table__body tbody').contains('Rat');
    });

    it('Visits the site and sorting by ASC on click at Last Modified', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('.el-table__header-wrapper table.el-table__header tr th.el-table_1_column_4 .ascending').click({ force: true });

        cy.get('table.el-table__body tbody tr td div').contains('Jun 2, 2020');
    });

    it('Visits the site and sorting by DESC on click at Last Modified', () => {
        cy.visit('/');

        cy.get('#button-models').contains('Models').click();

        cy.get('.el-table__header-wrapper table.el-table__header tr th.el-table_1_column_4 .descending').click({ force: true });

        cy.get('table.el-table__body tbody').contains('Sep 20, 2021');
    });
});