require('dotenv/config');

const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');

const authRoute = require('./routes/auth');

const PORT = 5000;

const app = express();

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/auth', authRoute);

app.get('/favicon.ico', function(req, res) {
  res.sendStatus(204);
});

app.get('*', (req, res) => res.redirect('https://cms.medeirostec.com.br'))
// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle errors
app.use(function(err, req, res) {
	console.log(err);

  if(err.status === 404)
  	res.status(404).json({message: 'Not found'});
  else
    res.status(500).json({message: 'Something looks wrong!'});

});

app.listen(PORT, function(){
	console.log('Server listening on port '+PORT);
});
