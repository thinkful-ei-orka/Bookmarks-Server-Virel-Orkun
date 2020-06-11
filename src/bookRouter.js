const { v4: uuid } = require('uuid');
const bookmarksRouter = require('express').Router();
const BookmarksService = require('./bookmark-service')
const logger = require('./logger')


bookmarksRouter
    .route('/bookmarks')
    .get((req,res,next)=>{
        
        BookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks=>{
                res.json(bookmarks);
            })
            .catch(next)
        
    })
    .post((req,res)=>{
        const { title, url, desc, rating } = req.body;
        console.log(req.body);
        

        if (!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!url) {
            logger.error('Url is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!desc) {
            logger.error('Description is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!rating) {
            logger.error('Rating is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        const id = uuid();

        //const bookmark = 

        bookmarks.push({
            "id": id,
            "title": title,
            "url": url,
            "desc": desc,
            "rating": rating
        });

        logger.info(`Bookmark with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks`)
            .json({id});
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        const { id } = req.params;
        BookmarksService.getById(req.app.get('db'), id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark with id ${id} not found.`);
                    return res
                        .status(404)
                        .send('Bookmark not found');
                }
                res.json(bookmark);
            })
            .catch(next)
    })



    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === id);

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not Found');
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} deleted.`);
        res
            .status(204)
            .end();
    });

module.exports = bookmarksRouter;
