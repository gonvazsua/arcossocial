describe('example to-do app', () => {

    before(() => {
        cy.login();
        cy.visit('http://uat.arcossocial.com/#/main/helps');
        cy.get('app-loading').should('not.be.visible');
    });

    after(() => {
        cy.logout();
    });

    it('Should search helps and select first help details', () => {
        cy.get('button').contains(' BUSCAR ').click();
        cy.get('app-loading').should('be.visible');
        cy.get('app-loading').should('not.be.visible');
        cy.get('table > tbody').children().should('have.length.gt', 0);
        cy.get('table > tbody > tr:first').click();
        cy.contains('Nombre');
        cy.contains('DNI');
        cy.contains('Carta de valoración');
        cy.contains('Dirección');
        cy.contains('DNI Pareja');
        cy.contains('Pareja');
        cy.contains('Emitida por');
    });

    it('Should create a new help', () => {
        cy.get('a').contains('NUEVA AYUDA').click();
        cy.contains('Alta de ayudas').should('be.visible');
        cy.get('#newHelpModal .select-wrapper').click();
        cy.get('#newHelpModal ul > li:nth-child(2)').click();
        cy.get('#newBeneficiaryId').parent().click();
        cy.get('#newHelpModal #newBeneficiaryId').type('Antonio ');
        cy.get('#newBeneficiaryId').parent().click();
        cy.get('#newBeneficiaryId').type('{downarrow}{enter}');
        cy.get('#helpDate').parent().click()
        cy.get('#helpDate').type('01012022');
        cy.get('textarea').parent().click();
        cy.get('textarea').type('Test de integración automático');
        cy.get('button').contains(' GUARDAR ').click();
        cy.get('.card').contains('Se ha guardado la ayuda correctamente').should('be.visible');
    });

});