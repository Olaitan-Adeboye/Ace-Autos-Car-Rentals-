const User = require('../userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { fullName, email, phoneNumber, password, } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 15);

        // Create new user
        const user = new User({ fullName, email, phoneNumber,  password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Cannot register user', error: err.message });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign(
  { id: user._id, email: user.email, role: user.identity || 'user' }, 
  process.env.JWT_SECRET,
  { expiresIn: '30m' }
);


        res.status(200).json({
            message: 'Welcome',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                identity: user.identity
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

module.exports = { register, login };
