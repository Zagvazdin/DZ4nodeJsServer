const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());

// Функция для чтения пользователей из файла
const readUsersFromFile = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Функция для записи пользователей в файл
const writeUsersToFile = (users) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// Получение всех пользователей
app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// Получение пользователя по ID
app.get('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('Пользователь не найден');
    }
    res.json(user);
});

// Создание нового пользователя
app.post('/users', (req, res) => {
    const users = readUsersFromFile();
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        ...req.body
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json(newUser);
});

// Обновление пользователя
app.put('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).send('Пользователь не найден');
    }
    users[userIndex] = { id: parseInt(req.params.id), ...req.body };
    writeUsersToFile(users);
    res.json(users[userIndex]);
});

// Удаление пользователя
app.delete('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).send('Пользователь не найден');
    }
    users.splice(userIndex, 1);
    writeUsersToFile(users);
    res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
