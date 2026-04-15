const prisma = require('../../core/db');
const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken.' });
    }

    const hashedPassword = await authService.hashPassword(password);
    
    // Safety check for role - can only be user or admin
    const userRole = (role === 'admin') ? 'admin' : 'user';

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: userRole
      }
    });

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
