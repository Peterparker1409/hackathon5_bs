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
});

// Middleware để xử lý JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

// Route POST để tạo công việc mới
// Route GET để lấy danh sách tất cả công việc
app.get('/todo', (req, res) => {
    const query = 'SELECT * FROM todos';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching todos' });
        } else {
            res.status(200).json(result);
        }
    });
});

app.post('/todo', (req, res) => {
    const { name, status } = req.body;
    const query = 'INSERT INTO todos (name, status) VALUES (?, ?)';
    db.query(query, [name, status], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error creating todo' });
        } else {
            res.status(201).json({ message: 'Todo created successfully' });
        }
    });
});

// Route PUT để cập nhật công việc thành completed
app.put('/todo/:id', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE todos SET status = "1" WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error updating todo' });
        } else {
            res.status(200).json({ message: 'Todo updated successfully' });
        }
    });
});

// Route DELETE để xóa công việc
app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error deleting todo' });
        } else {
            res.status(200).json({ message: 'Todo deleted successfully' });
        }
    });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
