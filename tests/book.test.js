const request = require("supertest");
const db = require("../db");
const Book = require("../models/book")
const app = require("../app");


process.env.NODE_ENV = "test";

describe("Test PUT /books route", function() {
    beforeEach(async function() {
        await db.query(
            `INSERT INTO 
            books(
                isbn,
                amazon_url,
                author,
                language, 
                pages,
                publisher,
                title, 
                year)
            VALUES(
                '0691161519',
                'http://a.co/eobPtX2',
                'Matthew Lane',
                'english',
                 264,
                'Princeton University Press',
                'Power-Up: Unlocking the Hidden Mathematics in Video Games',
                2017
            )`)
    });

    test("Can Update a book (PUT)", async function() {
        let res = await request(app)
            .put("/books/0691161519")
            .send({
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Penguin Books",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2018
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "book": {
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Penguin Books",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2018
            }
        })
        
    });

    test("Updating a book so that the 'language' property is removed causes errors",
     async function() {
        let res = await request(app)
            .put("/books/0691161519")
            .send({
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "pages": 264,
                "publisher": "Penguin Books",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2018
            })
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            "error": {
                "message": [
                "instance requires property \"language\""
                ],
                "status": 400
            },
            "message": [
                "instance requires property \"language\""
            ]  
        })
        
    })

    test("Updating a book so that the 'pages' property is a string causes errors",
    async function() {
       let res = await request(app)
           .put("/books/0691161519")
           .send({
               "isbn": "0691161519",
               "amazon_url": "http://a.co/eobPtX2",
               "author": "Matthew Lane",
               "language": "english",
               "pages": "264",
               "publisher": "Penguin Books",
               "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
               "year": 2018
           })
       expect(res.statusCode).toEqual(400);
       expect(res.body).toEqual({
           "error": {
               "message": [
                "instance.pages is not of a type(s) integer"
               ],
               "status": 400
           },
           "message": [
            "instance.pages is not of a type(s) integer"
           ]  
       })
       
   })

    afterEach(async function() {
        await db.query("DELETE FROM books");
      });


})


describe("Test POST /books route", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books");
    })

    test("Can POST a valid book", async function() {
        let res = await request(app)
            .post("/books")
            .send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
          "book": {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
          } 
        })

    });

    test("POSTing a book that is missing a property (pages) causes errors", async function() {
        let res = await request(app)
            .post("/books")
            .send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            "error": {
                "message": [
                "instance requires property \"pages\""
                ],
                "status": 400
            },
            "message": [
                "instance requires property \"pages\""
            ]  
        })

    });

    test("POSTing a book with an invalid year (2030) causes errors", async function() {
        let res = await request(app)
            .post("/books")
            .send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2030
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            "error": {
                "message": [
                  "instance.year must be less than or equal to 2023"
                ],
                "status": 400
              },
              "message": [
                "instance.year must be less than or equal to 2023"
              ]
        })
    });

    afterAll(async function() {
        await db.end();
      });
})