const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// Kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'khoa',
    database: 'todos',
}).promise();

// Middleware để xử lý JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

// Route POST để tạo công việc mới
// Route GET để lấy danh sách tất cả công việc
app.get('/todo', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM todos');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching todos' });
    }
});

app.post('/todo', async (req, res) => {
    const { name, status } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO todos (name, status) VALUES (?, ?)', [name, status]);
        res.status(201).json({ message: 'Todo created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating todo' });
    }
});

// Route PUT để cập nhật công việc thành completed
app.put('/todo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('UPDATE todos SET status = "1" WHERE id = ?', [id]);
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating todo' });
    }
});

// Route DELETE để xóa công việc
app.delete('/todo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM todos WHERE id = ?', [id]);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting todo' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
