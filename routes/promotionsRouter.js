const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const promotionsRouter = express.Router();

promotionsRouter.use(bodyParser.json());

// task 2

promotionsRouter.route('/:promotionId/comments')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion.comments);
        } else {
            err = new Error(`Campsite ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion) {
            promotion.comments.push(req.body);
            promotion.save()
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyAdmin,(req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotion/${req.params.promotionId}/comments`);
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion) {
            for (let i = (promotion.comments.length-1); i >= 0; i--) {
                promotion.comments.id(promotion.comments[i]._id).remove();
            }
            promotion.save()
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Campsite ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

promotionsRouter.route('/:promotionId/comments/:commentId')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion && promotion.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion.comments.id(req.params.commentId));
        } else if (!promotion) {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyAdmin,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotion/${req.params.promotionId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion && promotion.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                promotion.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                promotion.comments.id(req.params.commentId).text = req.body.text;
            }
            promotion.save()
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
        } else if (!promotion) {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion && promotion.comments.id(req.params.commentId)) {
            promotion.comments.id(req.params.commentId).remove();
            promotion.save()
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
        } else if (!promotion) {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = promotionsRouter;