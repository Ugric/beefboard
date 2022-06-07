describe('recommended page', () => {
  it('opens', () => {
    cy.visit('http://localhost:3000/')
  })
  it('has posts', () => {
    cy.get(".posts_post__InXeP").first();
  })
})