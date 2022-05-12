Cypress.Commands.add('login', () => {
    cy.visit({ url: 'http://uat.arcossocial.com/#/login', failOnStatusCode: false })
    cy.get('#userCode').parent().click()
    cy.get('#userCode')
        .type('SSO018')
        .tab()
        .type('1234')
    cy.get('.btn').click()
    cy.url().should('contain', 'helps')
})

Cypress.Commands.add('logout', () => {
    //cy.get('.btn-small').contains('SALIR').click()
})