const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;


mongoose.connect('mongodb://localhost:27017/registration-form', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    gender: String,
    acceptTerms: Boolean,
});


const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.post('/register', (req, res) => {
    const { firstName, lastName, email, password, gender, acceptTerms } = req.body;


    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        gender,
        acceptTerms: acceptTerms === 'on', // Convert checkbox value to a boolean
    });

    
    newUser.save((err) => {
        if (err) {
            console.error(err);
            res.send('Error registering user.');
        } else {
            res.send('User registered successfully!');
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
