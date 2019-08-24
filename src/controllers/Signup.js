const { User } = require("../config/database");
const mail = require("../config/mail");

const signup = async function(params) {
  const user = await User.findOne({ where: { email: params.email } });
  if (user) throw Error("Email already exists.");
  const createdUser = User.create(params);
  if (!createdUser) return false;

  const email = {
    from: "CMS MedeirosTEC <contato@medeirostec.com.br>",
    to: params.email,
    subject: "Seja bem vindo ao CMS da MedeirosTEC!",
    text:
      "Parabéns por começar a utilizar o nosso sistema.\nQualquer dúvida é só entrar em contato."
  };

  mail.sendMail(email, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado: " + info.response);
    }
  });

  return true;
};

module.exports = {
  signup
};
