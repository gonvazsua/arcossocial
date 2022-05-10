describe('example to-do app', () => {

    before(() => {
        cy.login();
    });

    after(() => {
        cy.logout();
    });

    it('Should search helps', () => {
        cy.visit('http://uat.arcossocial.com/#/main/helps');
        cy.get('button').contains(' BUSCAR ').click();
    });

});