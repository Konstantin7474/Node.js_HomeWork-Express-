const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const counter_file = path.join(__dirname, 'counter.json');

//Функция для чтения счетчика из файла
function readCounter() {
    if (fs.existsSync(counter_file)) {
        const data = fs.readFileSync(counter_file, 'utf-8');
        return JSON.parse(data);
    }
    return { '/': 0, '/about': 0};
}

//Функция для записи счетчика в файл
function writeCounter(counter){
    fs.writeFileSync(counter_file, JSON.stringify(counter, null, 2));
}

//Иницилизация счетчика
let counter = readCounter();

//Middleware для обновления счетчика
app.use((req, res, next) => {
    if (counter[req.path] !== undefined) {
        counter[req.path]++;
        writeCounter(counter);
    }
    next();
});


//Оброботчик для корневой страницы
app.get('/', (req, res) => {
    res.send(`<h1>Добро пожаловать на мой сайт!</h1>
    <p>Просмотров: ${counter['/']}</p>
    <a href="/about">About</a>`);
});

//Оброботчик для страницы About
app.get('/about', (req, res) => {
    res.send(`<h1>Страница обо мне!</h1>
    <p>Просмотров: ${counter['/about']}</p>
    <a href="/">Root</a>`);
});


//Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});