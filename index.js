const path = require('path');
const Redis = require('ioredis');
const _ = require('lodash');
const serverStatic = require('serve-static');
const debug = require('debug')('api-usage-rate');

const key = 'api-usage-rate';
const counter = 'api-hits-counter';

module.exports = class ApiUsageRate {
  /**
   * constructor of Class ApiUsageRate
   *
   * @param {Object} [options]
   * @param {Object|String} [options.connectRedis] - Info about connecting to redis
   * @param {Object} [logger=console] - logger
   */
  constructor({
    connectRedis,
    ignorePathes = [/^\/api-data*/, /^\/api-usage-rate*/, /js$/, /css$/],
    flushdb = false
  } = {}) {
    this.client = new Redis(connectRedis);
    if (flushdb) this.client.flushdb();
    this.ignorePathes = ignorePathes;
  }

  /**
   * return an Express middleware who records data of api usage rate
   */
  record() {
    return (req, res, next) => {
      if (!_.some(this.ignorePathes, tester => tester.test(req.path))) {
        const member = `${req.method}:${req.path}`;

        debug(`zincr ${member}...`);
        this.client.multi().zincrby(key, 1, member).incr(counter).exec((err, result) => {
          if (err) debug(`Fail to zincr ${member} or incr counter(${counter}): ${err.message}`);
          else {
            debug(`score of ${member}: ${result[0][1]}`);
            debug(`counter of hits: ${result[1][1]}`);
          }
        });
      }

      next();
    };
  }

  /**
   * get api hits data for analysis of api usage rate
   */
  getData() {
    return this.client.multi()
      .get(counter)
      .zrangebyscore(key, '-inf', '+inf', 'WITHSCORES')
      .exec();
  }

  /**
   * moute routes for Express:
   * /api-usage-rate: a static page to visualize api usage rate
   * /api-data: JSON data about hits number of APIs
   *
   * @param {Object} app - instance of Express
   */
  mouteRoutes(app) {
    const self = this;
    app.use('/api-usage-rate', serverStatic(path.join(__dirname, 'assets')));
    app.get('/api-data', (req, res, next) =>
      self.getData().then((data) => {
        res.json({
          count: data[0][1],
          rank: _.reverse(_.chunk(data[1][1], 2))
        });
      })
    );
  }
};
