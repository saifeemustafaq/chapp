const path = require('path');
const fs = require('fs-extra');

const USERS_FILE = path.join(__dirname, '../../users.json');

const loadUsers = () => {
  console.log('Loading users from file');
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data).users;
};

const saveUsers = (users) => {
  console.log('Saving users to file');
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
  console.log('Users saved');
};

module.exports = {
  loadUsers,
  saveUsers,
  USERS_FILE
}; 