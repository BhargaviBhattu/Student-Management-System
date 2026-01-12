const bcrypt = require("bcryptjs");

const hash = "$2a$10$m/AzMLqL6ArOwQSSHXBr0u3eu4SSYd3Vnj5pa46wYwbCCS5JpQ9Li";

console.log("Match result:", bcrypt.compareSync("123456", hash));
