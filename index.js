import express from 'express';



const app = express();
const port = 3000;
const options = {
    root: "routes"
}

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

app.get('/service', (req, res) => {
    res.sendFile('service.html', options)
})
app.listen(port, () => {
    console.log(`Сервер запущен, http://localhost:${port}`);
})