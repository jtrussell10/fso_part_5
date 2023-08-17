Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes}) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url, likes},
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })

  cy.visit('')
})


Cypress.Commands.add('like', ({title}) => {
  cy.contains(title).parent().contains('like')
  .click()
  .wait(500)
})


describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'russell',
      username: 'jeremy',
      password: 'test2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user) 
    cy.visit('')
  })


  it('front page can be opened', function() {
    cy.contains('Blog list')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('jeremy')
    cy.get('#password').type('test2')
    cy.get('#login-button').click()

    cy.contains('russell logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'jeremy', password: 'test2' })
    })
  

    it('a new blog can be created', function() {
      cy.contains('Create').click()
      cy.get('#title-input').type('a note created by cypress')
      cy.get('#author-input').type('Cyrpus?')
      cy.get('#url-input').type('cyprus.com')
      cy.get('#create-submit').click()
      cy.contains('a note created by cypress')
    })

    describe('a new blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first another note cypress',
          author: 'Cyrpus?',
          url: 'cyprus.com',
          likes: 0
        })
        cy.createBlog({
          title: 'yet another note cypress',
          author: 'Cyrpus?',
          url: 'cyprus.com',
          likes: 0
        })
        cy.createBlog({
          title: 'even another note cypress',
          author: 'Cyrpus?',
          url: 'cyprus.com',
          likes: 0
        })
      })

      it('it can be liked', function () {
        cy.contains('even another')
          .contains('View')
          .click()

          cy.contains('even another').parent().contains('like')
          .click()

        cy.contains('even another').parent()
          .contains('1')


      })

      it('it can be deleted', function () {
        cy.contains('even another')
          .contains('View')
          .click()
          .wait(1000)


          cy.contains('even another').parent().contains('Delete')
          .click()
          cy.visit('')
          
          cy.contains('yet another').parent().parent().should('not.contain', 'even another')

      })
      
      it('delete button cannot be viewed by another user', function() {


        cy.contains('yet another')
          .contains('View')
          .click()

        cy.contains('yet another').parent().should('contain', 'Delete')
        cy.contains('Log out')
         .click()
        
        const user = {
          name: 'steve',
          username: 'stevie',
          password: 'test3'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user) 
        cy.visit('')

        cy.login({username: 'stevie', password: 'test3'})

        cy.contains('yet another')
        .contains('View')
        .click()

        cy.contains('yet another').parent().should('not.contain', 'Delete')

      })

      it('can be sorted by liked', function() {
        cy.contains('first another')
        .contains('View')
        .click()

        cy.contains('even another')
        .contains('View')
        .click()

        cy.contains('yet another')
        .contains('View')
        .click()

        cy.like({title: 'even another'})
        cy.like({title: 'even another'})
        cy.like({title: 'even another'})
        cy.like({title: 'yet another'})
        cy.like({title: 'yet another'})
        cy.like({title: 'first another'})

        cy.visit('')

        cy.get('.blog').eq(0).should('contain', 'even another')
        cy.get('.blog').eq(1).should('contain', 'yet another')
        cy.get('.blog').eq(2).should('contain', 'first another')

      })
      

    })
    
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('jeremy')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.get('.error')
    .should('contain', 'Wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'russell logged in')

  })
}) 



