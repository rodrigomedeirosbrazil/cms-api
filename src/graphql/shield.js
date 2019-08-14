const { rule, shield } = require('graphql-shield');
const jwt = require('jsonwebtoken');

function checkUser(req) {
  let token;
  try {
    const authorization = req.request.headers.authorization.replace(
      'Bearer ',
      ''
    );

    token = jwt.verify(authorization, 'secretKey');
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

    token = jwt.verify(authorization, 'secretKey');
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
});

// Permissions

const permissions = shield({
  User: isAuthenticated,
  Customer: isAuthenticated
});

module.exports = {
  permissions,
  checkUser
};
