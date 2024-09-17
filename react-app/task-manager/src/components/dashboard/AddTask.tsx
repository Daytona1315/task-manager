import '../main.css'
import './addtask.css'
import { useState } from 'react'
import Overlay from './Overlay.tsx'

const AddTask = (getTask) => {
    const token = localStorage.getItem('access_token')
    const createdAt = new Date();
    const isoDateString = createdAt.toISOString();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [creationFields, setCreationFields] = useState({
        name: '',
        description: '',
        created_at: isoDateString,
    })

// Запрос на сервер о создании новой задачи
    const sendRequest = async () => {
        if (creationFields.name === '' || creationFields.description === '') {
            alert('All fields are required!');
        } 
        else {
            try {
                await fetch('http://127.0.0.1:5001/tasks/', {
                    method: 'POST',
                    body: JSON.stringify(creationFields),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                } 
            ); console.log(creationFields)
            } catch (error) {console.error('Error:', error);};
            await getTask()
            setIsOverlayOpen(false)
        }
    }

    return (
        <>

            <Overlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(!isOverlayOpen)}>
                <div className='overlay_children'>
                    <div className='headline'><h1>Create task</h1></div>

                    <div className='forms'>
                        <div className='div_input input_header'>
                            <input type='text' placeholder='Header' maxLength={40}
                            onChange={(e) => setCreationFields(
                                { ...creationFields, name: e.target.value })}
                            value={creationFields.name}
                            />
                        </div>
                        <div className='div_input input_description'>
                        <textarea rows='10' cols='40' placeholder='Description' maxLength={550}
                            onChange={(e) => setCreationFields(
                                { ...creationFields, description: e.target.value })}
                            value={creationFields.description}
                            />
                        </div>
                    </div>

                    <div className='submit_container'>
                        <div className='submit_button' onClick={sendRequest}>
                            <span>Submit</span>
                        </div>
                    </div>
                </div>
            </Overlay>

            <div className='container' id='add_cont'>
                <div className='row' onClick={() => setIsOverlayOpen(!isOverlayOpen)}>
                    <div className='add_button'>
                        <span className='add_span'>
                            Create new task +
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTask