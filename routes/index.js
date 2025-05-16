var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send({
    status: 200,
    message: 'Welcome to the API',
    data: null
  });
});

module.exports = router;
