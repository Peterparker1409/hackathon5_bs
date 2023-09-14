import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
    const [tasks, setTasks] = useState([]); 

    const getTasks = async () => {
        await axios.get('http://localhost:3000/todo') 
            .then((response) => {
                setTasks(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getTasks();
    }, []); 
    const [userData, setUserData] = useState({
        name: '',
        status: 0, 
    });

    const handleAddTask = () => {
        
        axios.post('http://localhost:3000/todo', userData)
            .then((response) => {
                // Xử lý phản hồi từ máy chủ (nếu cần)
                getTasks();
                console.log('Công việc đã được thêm thành công:', response.data);
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.error('Lỗi khi thêm công việc:', error);
            });
    };
    const handleDeleteTask = (taskId) => {
        // Sử dụng Axios để gửi yêu cầu DELETE đến máy chủ để xóa công việc
        axios.delete(`http://localhost:3000/todo/${taskId}`)
            .then(() => {
              
                getTasks(); 
                console.log('Công việc đã được xóa thành công.');
            })
            .catch((error) => {
               
                console.error('Lỗi khi xóa công việc:', error);
            });
    };


    const handleToggleTask = (taskId, currentStatus) => {
        // Tạo một đối tượng dữ liệu để gửi yêu cầu cập nhật
        const updatedTaskData = {
            status: currentStatus === 0 ? 1 : 0,
        };

        
        axios.put(`http://localhost:3000/todo/${taskId}`, updatedTaskData)
            .then(() => {
               
                getTasks(); 
                console.log('Công việc đã được cập nhật thành công.');
            })
            .catch((error) => {
                // Xử lý lỗi nếu có
                console.error('Lỗi khi cập nhật công việc:', error);
            });
    };

    return (
        <div>
            <div className="input-group mb-3 w-25 mx-auto my-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Task"
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={handleAddTask}
                >
                    +
                </button>
            </div>
            <div className="container text-center fw-bold ">
                <div className="row">
                    <div className="col">
                        <h3>Uncompleted Tasks</h3>
                        <ul className="list-group">
                            {tasks.filter((task) => task.status == 0).map((task) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={task.id}>
                                    {task.name}
                                    <div className="task-actions">
                                        <i
                                            className="bx bxs-trash mx-2"
                                            onClick={() => handleDeleteTask(task.id)}
                                        ></i>
                                        <input
                                            type='checkbox'
                                            checked={task.status === 1}
                                            onChange={() => handleToggleTask(task.id, task.status)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col">
                        <h3>Completed Tasks</h3>
                        <ul className="list-group">
                            {tasks.filter((task) => task.status == 1).map((task) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={task.id}>
                                    {task.name}
                                    <div className="task-actions">
                                        <i
                                            className="bx bxs-trash mx-2"
                                            onClick={() => handleDeleteTask(task.id)}
                                        ></i>
                                        <input
                                            type='checkbox'
                                            checked={task.status === 1}
                                            onChange={() => handleToggleTask(task.id, task.status)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodoList;
