import express from 'express';



const app = express();
const port = 3000;
const options = {
    root: "routes"
}
app.use(express.urlencoded({ extended: true }));
const users = [
    {id: 1, login: 'admin@ex.ru', password: 'admin', date: '01.01.2025'},
    {id: 2, login: 'user@ex.ru', password: 'user', date: '02.02.2025'}
]
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
        const id = users.length + 1;
        var today = new Date();
        var day = today.getDate().toString()
        var month = today.getMonth()+1
        var year = today.getFullYear().toString()
        var date = day+'.'+month+'.'+year
        users.push({ id: id, login: email, password: password, date: date })
        return res.redirect('/profile')
        
    }
    catch (e) {
        return res.statusCode(400)
    }
    
  
});

app.get('/service', (req, res) => {
    res.sendFile('service.html', options)
})
app.get('/profile', (req, res) => {
    res.sendFile('profile.html', options)
    console.log(users);
})
app.listen(port, () => {
    console.log(`Сервер запущен, http://localhost:${port}`);
})