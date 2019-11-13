const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

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

  if (!user) res.status(404).json({message: "Email não encontrado"});

  const valid = await bcrypt.compare(password, user.password)

  if (valid) {
    const token = jwt.sign({
      userId: user.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': user.id,
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
    res.status(404).json({message: "Senha inválida"});
  }
}

const signup = async function(req, res, next) {
  const { name, email, password } = req.body;

  const SIGNUP = `
    mutation($id: uuid!, $name: String!, $email: String!, $password: String!) {
      insert_users(objects: { id: $id, name: $name, email: $email, password: $password }) { returning { id }}
    }
  `
  const hashedPassword = await bcrypt.hash(password, 10)
  const id = uuid();

  //TODO: Validation!
  let user = null;
  try {
    user = await graphql.request(SIGNUP, { id, name, email, password: hashedPassword }).then(data => {
      return data.insert_users.returning[0]
    })
  } catch(error) {
    console.log(error);
    return res.status(500).json({ message: "Erro durante a requisição" });
  }

  if (!user) res.status(404).json({message: "Login incorreto."});

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

const recoveryPassword = async function (req, res, next) {
  const { email } = req.body;

  const USER = `
    query($email: String) {
      users(where:{email: {_eq: $email}}) { id }
    }
  `

  const SET_USER_PASSWORD = `
    mutation($id: uuid!, $password: String!) {
      update_users(
        where: {
          id: { _eq: $id }
        },
        _set: {
          password: $password
        }
      ) { affected_rows }
    }
  `
  let user = null;

  try {
    user = await graphql.request(USER, { email }).then(data => {
      return data.users[0];
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro durante a requisição" });
  }

  if (!user) res.status(404).json({ message: "Email não encontrado" });

  const newPassword = uuid();
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await graphql.request(SET_USER_PASSWORD, { id: user.id, password: hashedPassword }).then( () => {
      return true;
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro durante a requisição" });
  }

  const newEmail = {
    from: "CMS MedeirosTEC <contato@medeirostec.com.br>",
    to: email,
    subject: "Recuperação da senha",
    text:
      `Você pediu a recuperação da senha, segue a senha que foi gerada:
      ${newPassword}
      `
  };

  mail.sendMail(newEmail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });

  return res.status(200).json({ message: "Email enviado!" });
}

const changePassword = async function (req, res, next) {
  const { oldPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization;
  let id = null;

  if (!authHeader)
    return res.status(401).send({ error: 'Você precisa estar logado no sistema.' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    return res.status(401).send({ error: 'Token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted' });

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });
    id = decoded.userId;
  });

  const USER = `
    query($id: uuid!) {
      users(where:{id: {_eq: $id}}) { email, password }
    }
  `

  const SET_USER_PASSWORD = `
    mutation($id: uuid!, $password: String!) {
      update_users(
        where: {
          id: { _eq: $id }
        },
        _set: {
          password: $password
        }
      ) { affected_rows }
    }
  `
 let user = null;
  try {
    user = await graphql.request(USER, { id }).then(data => {
      return data.users[0];
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro durante a requisição." });
  }

  if (!user) res.status(404).json({ message: "Usuário não encontrado." });

  const valid = await bcrypt.compare(oldPassword, user.password)

  if (!valid) res.status(404).json({ message: "Senha antiga inválida." });

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await graphql.request(SET_USER_PASSWORD, { id, password: hashedPassword }).then(() => {
      return true;
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro durante a requisição." });
  }

  const newEmail = {
    from: "CMS MedeirosTEC <contato@medeirostec.com.br>",
    to: user.email,
    subject: "Troca da senha",
    text:
      `Sua senha foi trocada, se você efetuou a troca, ignore esse email.`
  };

  mail.sendMail(newEmail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });

  return res.status(200).json({ message: "Senha alterada com sucesso!" });
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
    query($id: String) {
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
    res.status(404).json({ message: "Não logado" });
  }


}

module.exports = { login, signup, me, recoveryPassword, changePassword }
