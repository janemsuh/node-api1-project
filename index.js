const express = require('express'); // import the express package
const db = require('./database.js');
const server = express(); // creates the server

server.use(express.json())

// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
  res.json({ message: 'hello, world' });
});

server.get('/users', (req, res) => {
    const users = db.getUsers();
    if (users) {
        res.json(users);
    } else {
        res.status(500).json({
            message: 'The users information could not be retrieved.'
        });
    }
});

server.get('/users/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const user = db.getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                message: 'The user with the specific ID does not exist.'
            });
        }
    } catch {
        res.status(500).json({
            message: 'The user information could not be retrieved.'
        });
    }
});

server.post('/users', (req, res) => {
    const { name, bio } = req.body;
    try {
        if (name && bio) {
            const newUser = db.createUser({
                name: req.body.name,
                bio: req.body.bio
            });
            res.status(201).json(newUser);
        } else {
            return res.status(400).json({
                message: 'Please provide name and bio for the user.'
            });
        }
    } catch {
        res.status(500).json({
            message: 'There was an error while saving the user to the database.'
        });
    }
});

server.delete('/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id);
    try {
        if (user) {
            db.deleteUser(user.id);
            res.status(204).end();
        } else {
            res.status(404).json({
                message: 'The user with the specific ID does not exist.'
            });
        }
    } catch {
        res.status(500).json({
            message: 'The user could not be removed.'
        });
    }
});

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);