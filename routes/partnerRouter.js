// task 3

const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const partnerRouter = express.Router();

partnerRouter.use(bodyParser.json());

partnerRouter.route('/:partnerId/comments')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner.comments);
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyAdmin,(req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            partner.comments.push(req.body);
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Campsite ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyAdmin,(req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.partnerId}/comments`);
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
            for (let i = (partner.comments.length-1); i >= 0; i--) {
                partner.comments.id(partner.comments[i]._id).remove();
            }
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

partnerRouter.route('/:partnerId/comments/:commentId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner.comments.id(req.params.commentId));
        } else if (!partner) {
            err = new Error(`Partner ${req.params.partnerId} not found`);
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
    res.end(`POST operation not supported on /partner/${req.params.partnerId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyAdmin,(req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                partner.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                partner.comments.id(req.params.commentId).text = req.body.text;
            }
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if (!partner) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
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
    Partner.findById(req.params.partnerId)
    .then(campsite => {
        if (partner && partner.comments.id(req.params.commentId)) {
            partner.comments.id(req.params.commentId).remove();
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else if (!partner) {
            err = new Error(`Campsite ${req.params.partnerId} not found`);
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

module.exports = partnerRouter;