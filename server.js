
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from users.json
const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
};

// Helper function to write users to users.json
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    const users = readUsers();
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUser = { id: Date.now().toString(), username, email, password };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User created successfully.' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readUsers();
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful.', user });
});

// Users endpoint (for admin)
app.get('/users', (req, res) => {
    const users = readUsers().map(({ password, ...user }) => user);
    res.status(200).json(users);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
