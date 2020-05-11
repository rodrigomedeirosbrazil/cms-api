const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const moment = require('moment');

const mail = require('../config/mail');
const graphql = require('../config/graphql');

const login = async function(req, res) {
  const { email, password } = req.body;

  const LOGIN = `
    query($email: String) {
      users(where:{email: {_eq: $email}}) { id, name, password, date_limit }
    }
  `
  const user = await graphql.request(LOGIN, { email }).then(data => {
    return data.users[0];
  })

  if (!user) res.status(404).json({message: 'Email não encontrado'});

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
    res.status(404).json({message: 'Senha inválida'});
  }
}

const signup = async function(req, res) {
  const { name, email, password } = req.body;

  const SIGNUP = `
    mutation($id: uuid!, $name: String!, $email: String!, $password: String!, $date_limit: date!) {
      insert_users(objects: { id: $id, name: $name, email: $email, password: $password }) { returning { id }}
    }
  `
  const hashedPassword = await bcrypt.hash(password, 10)
  const id = uuid();

  //TODO: Validation!
  let user = null;
  try {
    const date_limit = moment().add(1, 'M');
    user = await graphql.request(SIGNUP, { id, name, email, password: hashedPassword, date_limit }).then(data => {
      return data.insert_users.returning[0]
    })
  } catch(error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro durante a requisição' });
  }

  if (!user) res.status(404).json({message: 'Login incorreto.'});

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
    from: 'CMS MedeirosTEC <contato@medeirostec.com.br>',
    to: email,
    subject: 'Seja bem vindo ao CMS da MedeirosTEC!',
    text:
      'Parabéns por começar a utilizar o nosso sistema.\nQualquer dúvida é só entrar em contato.'
  };

  mail.sendMail(newEmail, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
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

const recoveryPassword = async function (req, res) {
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
    return res.status(500).json({ message: 'Erro durante a requisição' });
  }

  if (!user) res.status(404).json({ message: 'Email não encontrado' });

  const newPassword = uuid();
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await graphql.request(SET_USER_PASSWORD, { id: user.id, password: hashedPassword }).then( () => {
      return true;
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro durante a requisição' });
  }

  const newEmail = {
    from: 'CMS MedeirosTEC <contato@medeirostec.com.br>',
    to: email,
    subject: 'Recuperação da senha',
    text:
      `Você pediu a recuperação da senha, segue a senha que foi gerada:
      ${newPassword}
      `
  };

  mail.sendMail(newEmail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });

  return res.status(200).json({ message: 'Email enviado!' });
}

const update = async function (req, res) {
  const UPDATE_USER = `
    mutation($id: uuid!, $name: String!, $social_name: String, $fantasy_name: String, $email: String!, $doc: String, $phone: String, $address: String, $neighborhood: String, $city: String, $state: String, $zip: String, $logo: String) {
      update_users(
        where: {
          id: { _eq: $id }
        },
        _set: {name: $name, social_name: $social_name, fantasy_name: $fantasy_name, email: $email, doc: $doc, phone: $phone, address: $address, neighborhood: $neighborhood, city: $city, state: $state, zip: $zip, logo: $logo}
      ) { affected_rows }
    }
  `

  try {
    const decoded = checkJwt(req)
    const id = decoded.userId
    const data = { ...req.body, id }
    const ret = await graphql.request(UPDATE_USER, data)
    return res.status(201).json(ret);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

const checkJwt = req => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    throw 'Você precisa estar logado no sistema.'

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    throw 'Token error'

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    throw 'Token malformatted'

  let decodedJwt = null;
  try {
    decodedJwt = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    throw 'Token invalid'
  }
  return decodedJwt
}

const changePassword = async function (req, res) {
  const { oldPassword, newPassword } = req.body;

  let decoded;
  try {
    decoded = checkJwt(req)
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  const id = decoded.userId;

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
    return res.status(500).json({ message: 'Erro durante a requisição.' });
  }

  if (!user) res.status(404).json({ message: 'Usuário não encontrado.' });

  const valid = await bcrypt.compare(oldPassword, user.password)

  if (!valid) res.status(404).json({ message: 'Senha antiga inválida.' });

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await graphql.request(SET_USER_PASSWORD, { id, password: hashedPassword }).then(() => {
      return true;
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro durante a requisição.' });
  }

  const newEmail = {
    from: 'CMS MedeirosTEC <contato@medeirostec.com.br>',
    to: user.email,
    subject: 'Troca da senha',
    text:
      'Sua senha foi trocada, se você efetuou a troca, ignore esse email.'
  };

  mail.sendMail(newEmail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });

  return res.status(200).json({ message: 'Senha alterada com sucesso!' });
}

const me = async function(req, res) {
  const ME = `
    query($id: uuid) {
      users( where: {id: {_eq: $id}}) { id, name, social_name, fantasy_name, doc, email, phone, zip, address, neighborhood, city, state, logo }
    }
  `
  let decoded;
  try {
    decoded = checkJwt(req)
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  const id = decoded.userId;
  const user = await graphql.request(ME, { id }).then(data => {
    return data.users[0]
  })

  res.json(user);
}

module.exports = { login, signup, me, recoveryPassword, update, changePassword }
