const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mail = require("../config/mail");
const graphql = require('../config/graphql');

const login = async function(req, res, next) {
  const { email, password } = req.body;

  const LOGIN = `
    query($email: String) {
      users(where:{email: {_eq: $email}}) { id, name, password }
    }
  `
  const user = await graphql.request(LOGIN, { email }).then(data => {
    return data.users[0];
  })

  if (!user) res.status(404).json({message: "User not found"});

  const valid = await bcrypt.compare(password, user.password)

  if (valid) {
    const token = jwt.sign({
      userId: user.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': user.id.toString(),
        'x-hasura-default-role': 'user',
        'x-hasura-allowed-roles': ['user']
      }
    }, process.env.JWT_KEY)

    // remove password from object
    delete user.password;

    res.json(
      {
        data:{
          user: user,
          token:token
        }
      }
    );
  } else {
    res.status(404).json({message: "Invalid password"});
  }
}

const signup = async function(req, res, next) {
  const { name, email, password } = req.body;

  const SIGNUP = `
    mutation($name: String, $email: String, $password: String) {
      insert_users(objects: { name: $name, email: $email, password: $password }) { returning { id }}
    }
  `

  const hashedPassword = await bcrypt.hash(password, 10)

  //TODO: Validation!
  const user = await graphql.request(SIGNUP, { name, email, password: hashedPassword }).then(data => {
    return data.insert_users.returning[0]
  })

  if (!user) res.status(404).json({message: "Signup fail!"});

  const token = jwt.sign({
    userId: user.id,
    'https://hasura.io/jwt/claims': {
      'x-hasura-user-id': user.id.toString(),
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': ['user']
    }
  }, process.env.JWT_KEY)

  // remove password from object
  delete user.password;

  const newEmail = {
    from: "CMS MedeirosTEC <contato@medeirostec.com.br>",
    to: email,
    subject: "Seja bem vindo ao CMS da MedeirosTEC!",
    text:
      "Parabéns por começar a utilizar o nosso sistema.\nQualquer dúvida é só entrar em contato."
  };

  mail.sendMail(newEmail, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });

  res.json(
    {
      data:{
        user: user,
        token:token
      }
    }
  );
}

const getUserId = (req) => {
  const Authorization = req.get('Authorization') || ''
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = jwt.verify(token, process.env.JWT_KEY)
    return verifiedToken.userId
  }
}

const me = async function(req, res, next) {
  const ME = `
    query($id: Int) {
      users(where:{id: {_eq: $id}}) { id, name, email }
    }
  `
  userId = getUserId(req);

  if (userId) {
    const user = await graphql.request(ME, { id: userId }).then(data => {
      return data.users[0]
    })

    res.json(
      {
        data:{
          user: user
        }
      }
    );

  } else {
    res.status(404).json({ message: "Not logged in" });
  }


}

module.exports = { login, signup, me }
