const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const {makeBookmarksArray} = require('./bookmarks.fixtures')


describe('bookmarks endpoints', () => {

    let db;

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
    
    // afterEach('clean the table', () => db('bookmarks').truncate());
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('bookmarks').truncate())
    afterEach('cleanup', () => db('bookmarks').truncate())
    

  describe('GET /bookmarks', () => {
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()
      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('GET /bookmarks',()=>{
        return supertest(app)
            .get('/bookmarks')
            .expect(200, testBookmarks)
      })
      })
    })
    
  
      describe('GET /bookmarks/:id', () => {
        context('Given there are bookmarks in the database', () => {
          const testBookmarks = makeBookmarksArray()
      
          beforeEach('insert bookmarks', () => {
            return db 
              .into('bookmarks')
              .insert(testBookmarks)
          })
      
          it('responds with 200 and the specified bookmark', () => {
            const bookmarkId = 1
            const expectedBookmark = testBookmarks[bookmarkId - 1]
            return supertest(app)
              .get(`/bookmarks/${bookmarkId}`)
              .expect(200, expectedBookmark)
          })
        })
      })
  
  describe('GET /bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, [])
          })
        })
  })
  
  describe(`GET /bookmarks/:id`, () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        const bookmarkId = 12345
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(404, 'Bookmark not found')
      })
    })
  })
})

