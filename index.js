import express from 'express';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const app = express();
const port = 3000;
const options = {
    root: "routes"
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
let users = [];
try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
} catch (err) {
    users = [
        { id: 1, login: 'admin@ex.ru', password: 'admin', date: '01.01.2025' },
        { id: 2, login: 'user@ex.ru', password: 'user', date: '02.02.2025' }
    ];
}
const upload = multer({ storage });
app.set('view engine', 'ejs');
app.set('views', options.root);
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true }));
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('main.html', options)
})

app.get('/autorise', (req, res) => {
    res.sendFile('autorise.html', options)
})

app.get('/registration', (req, res) => {
    res.sendFile('registration.html', options)
})
app.post('/registration', (req, res) => {
    try {

        const { email, password } = req.body;
        const existingUser = users.find(user => user.login === email);
        if (existingUser) {
            req.session.user = existingUser;
            return res.redirect('/profile');
        } else {
            const id = users.length + 1;
            var today = new Date();
            var day = today.getDate().toString()
            var month = today.getMonth() + 1
            var year = today.getFullYear().toString()
            var date = day + '.' + month + '.' + year
            const newUser = { id, login: email, password, date,  status: 'Неактивен' };

            users.push(newUser);
            req.session.user = newUser;
            return res.redirect('/profile')
        }
    }
    catch (e) {
        return res.statusCode(400)
    }

});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.login === email && u.password === password);

    if (user) {
        req.session.user = user;
        return res.redirect('/profile');
    } else {
        return res.status(401).send('Неверный email или пароль');
    }
});

app.get('/service', (req, res) => {
    res.sendFile('service.html', options)
})
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/registration');
    }
    const user = req.session.user;
    res.render('profile', { user });
    console.log(users);
})
app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.user });
});
app.post('/update-profile', upload.single('photo'), (req, res) => {
    const { email, name } = req.body;
    const user = req.session.user;

    if (user) {
        user.login = email;
        user.name = name;
        if (req.file) {
            user.photo = '/uploads/' + req.file.filename;
        }
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...user };
        }
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
        req.session.user = user;
        res.redirect('/profile');
    } else {
        res.redirect('/autorise');
    }
});

app.post('/purchase', (req, res) => {
    const user = req.session.user;
    if (user) {
        user.status = 'Активен';
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...user };
        }
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
        req.session.user = user;
        res.redirect('/profile');
    } else {
        res.redirect('/');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Ошибка при выходе из сессии:', err);
            return res.status(500).send('Ошибка выхода');
        }
        res.clearCookie('connect.sid');
        res.sendStatus(200);
    });
});
app.listen(port, () => {
    console.log(`Сервер запущен, http://localhost:${port}`);
})