const bcrypt = require("bcryptjs");

const hash = bcrypt.hashSync("bharu", 10);
console.log(hash);
