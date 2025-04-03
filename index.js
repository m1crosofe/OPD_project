import exporess from 'express';



const app = exporess();
const port = 3000;
const options = {
    root: "routes"
}

app.use(exporess.static('routes'))

app.get('/', (req, res) => {
    res.sendFile('main.html', options)
})

app.get('/autorise', (req, res) => {
    res.sendFile('autorise.html', options)
})

app.listen(port, () => {
    console.log(`Сервер запущен, http://localhost:${port}`);
})