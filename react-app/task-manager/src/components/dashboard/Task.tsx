import './task.css'
import '../main.css'
import { useState, useEffect } from 'react'
import Overlay from './Overlay';

interface TaskProps {
    taskData: { [key: string]: any };
    token: string;
    getTask: () => Promise<void>
  }

const Task: React.FC<TaskProps> = ({ taskData, token, getTask }) => {
    const id = taskData.id
    const [status, setStatus] = useState('')
    const [statusStyle, setStatusStyle] = useState('')
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [creationFields, setCreationFields] = useState({
        name: taskData.name,
        description: taskData.description,
    })

// Получение текущего значения "status"    
    useEffect(() => {  
        function getTaskStatus() {
            setStatus(taskData.status)
        } getTaskStatus()
    }, [])

// Обновление стиля кнопки "status" после нажатия
    const updateStatusStyle = () => {
        if (status === 'inactive') {
          setStatusStyle('task_status task_status_inactive');
        } else {
          setStatusStyle('task_status task_status_active');
        }
      };
      
      useEffect(() => {
        updateStatusStyle();
      }, [status]);

// Обработчик нажатия на кнопку "status"
    const handleStatusClick = async () => {
        const newStatusValue = status === 'active' ? 'inactive' : 'active';
        try {
            const response = await fetch(
                `http://127.0.0.1:5001/tasks/${taskData.id}?task_status=${newStatusValue}`, {
                method: "PUT",
                body: `id:${taskData.id}, status:${newStatusValue}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (status === 'inactive') {
                    setStatusStyle('task_status task_status_active')
                } else {
                    setStatusStyle('task_status task_status_inactive')
                };
            if (response.status === 200) {
                setStatus(newStatusValue);  
            }
        } catch (error) {
            console.error(error);
        }
    };
    
// Форматирование даты и время
    const [date, setDate] =useState('')
    const [time, setTime] =useState('')

    useEffect(() => {
        function parseDate() {
            const rawString = taskData.created_at
            const [date, rawTime] = rawString.split('T')
            const time = rawTime.slice(0, 5)
            setTime(time)
            setDate(date)
        } parseDate()
    })

// Удаление задачи
    const deleteTask = async () => {
        try {
            await fetch(
                `http://127.0.0.1:5001/tasks/${taskData.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }},
            ); 
            await getTask()
            setIsOverlayOpen(false)
        } catch (error) {console.error(error)}; 
        
    }

// Запрос на сервер c обновлёнными данными задачи
    const editTask = async () => {
        try {
            await fetch(`http://127.0.0.1:5001/tasks/edit/${id}`, {
                method: 'PUT',
                body: JSON.stringify(creationFields),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            }, 
            
        ); 
        await getTask()
        setIsOverlayOpen(false)
        } catch (error) {console.error('Error:', error);};
        
    }

    return (
        <>

            <Overlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(!isOverlayOpen)}>
                <div className='overlay_children'>
                    <div className='headline'><h1>Edit task</h1></div>

                    <div className='forms'>
                        <div className='div_input input_header' id='header_input'>
                            <input type='text' placeholder='Header' maxLength={40}
                            onChange={(e) => setCreationFields(
                                { ...creationFields, name: e.target.value })}
                            value={creationFields.name}
                            />
                        </div>
                        <div className='div_input input_description'>
                            <textarea rows='10' cols='40' placeholder='Description' maxLength={150}
                            onChange={(e) => setCreationFields(
                                { ...creationFields, description: e.target.value })}
                            value={creationFields.description}
                            />
                        </div>
                    </div>

                    <div className='submit_container'>
                        <div className='submit_button' onClick={editTask}>
                            <span>Submit</span>
                        </div>
                    </div>
                </div>
            </Overlay>

            <div className='cont'>
                <div className='task_container'>

                    <div className='task_row'>
                        <div className='task_name'>
                            <span style={{whiteSpace: "pre-wrap"}}>{taskData.name}</span>
                        </div>
                        <div className='task_date'>
                            <p>{date}</p>
                            <p>{time}</p>
                        </div>
                    </div>

                    <div className='task_row'>
                        <div className='task_desc'>
                            <span style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                                {taskData.description}
                            </span>
                        </div>
                    </div>

                    <div className='task_row status_row'>
                        <div className={statusStyle} onClick={handleStatusClick}>
                            {status}
                        </div>
                    </div>
                    
                    <div className='task_row actions_row'>
                        <div className='action_button delete_button' onClick={deleteTask}>
                            <p>Delete</p>
                        </div>
                        <div className='action_button change_button'
                        onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
                            <p>Edit</p>
                        </div>
                    </div>

                </div>
            </div>
        </>

    )

}

export default Task