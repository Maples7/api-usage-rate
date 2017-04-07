'use strict';

module.exports = {
  '/1': (req, res, next) => {
    res.sendStatus(200);
  },
  '/2': {
    post: (req, res, next) => {
      res.sendStatus(200);
    },
  },
  '/:id': (req, res, next) => {
    res.sendStatus(200);
  }
};
