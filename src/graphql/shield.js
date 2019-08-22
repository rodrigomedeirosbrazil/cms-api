require('dotenv/config');
const { rule, shield } = require('graphql-shield');
const jwt = require('jsonwebtoken');

function checkUser(req) {
  let token;
  try {
    const authorization = req.request.headers.authorization.replace(
      'Bearer ',
      ''
    );

    token = jwt.verify(authorization, process.env.JWT_KEY || 'secretKey');
  } catch (e) {
    return null;
  }
  return token.id;
}

// Rules

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  try {
    const authorization = ctx.request.headers.authorization.replace(
      'Bearer ',
      ''
    );

    token = jwt.verify(authorization, process.env.JWT_KEY || 'secretKey');
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
});

// Permissions

const permissions = shield({
  User: isAuthenticated,
  Customer: isAuthenticated,
  Order: isAuthenticated,
  Item: isAuthenticated
});

module.exports = {
  permissions,
  checkUser
};