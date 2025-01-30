const bcrypt = require('bcrypt');
const { loadUsers, saveUsers } = require('../config/database');

let users = [];

const initializeUsers = () => {
  users = loadUsers();
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for user: ${username}`);
  const user = users.find(u => u.username === username);
  
  if (!user) {
    console.log(`User not found: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    console.log(`Invalid password for user: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
  
  console.log(`Successful login for user: ${username}`);
  res.json({ success: true, color: user.color });
};

const changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  console.log(`Password change attempt for user: ${username}`);
  const user = users.find(u => u.username === username);
  
  if (!user) {
    console.log(`User not found: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid username' });
  }
  
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    console.log(`Invalid current password for user: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid current password' });
  }
  
  const newHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newHash;
  saveUsers(users);
  console.log(`Password changed successfully for user: ${username}`);
  res.json({ success: true, message: 'Password changed successfully' });
};

const setupInitialPasswords = async () => {
  for (let user of users) {
    if (!user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.username + '123', 10);
    }
  }
  saveUsers(users);
};

module.exports = {
  initializeUsers,
  login,
  changePassword,
  setupInitialPasswords,
  getUsers: () => users
}; 