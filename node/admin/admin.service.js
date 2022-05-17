const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");

module.exports = {
  authenticate,
};

async function authenticate(user_name, password ) {

  const user = await db.User.scope("withHash").findOne({ where: { email:user_name } });

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw "Username or password is incorrect";

  // authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: "7d" });
  return {
    ...omitHash(user.get()),
    token
  };
}

// helper functions

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
