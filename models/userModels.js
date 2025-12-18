const fs = require("fs").promises;
const path = require("path");
const usersPath = path.join(__dirname, "../users.json");
let users = require("../users.json");

const User = {
  findByUsername: (username) => users.find((u) => u.username === username),

  create: async (userData) => {
    const newUser = { id: Date.now(), ...userData };
    users.push(newUser);
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    return newUser;
  },
};

module.exports = User;
