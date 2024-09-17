import '../main.css'
import Overlay from './Overlay'
import './overlay.css'

import { useState } from 'react'

const EditTask = (name, description, id) => {
    
    const token = localStorage.getItem('access_token')
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [creationFields, setCreationFields] = useState({
        name: name,
        description: description,
    })

// Запрос на сервер c новым содержимым задачи
    const sendRequest = async () => {
        if (creationFields.name === '' || creationFields.description === '') {
            alert('All fields are required!');
        } 
        else {
            try {
                await fetch(`http://127.0.0.1:5001/tasks/edit/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(creationFields),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                } 
            ); 
            } catch (error) {console.error('Error:', error);};
            window.location.reload()
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
                </div>
            </Overlay>

            <div className='action_button change_button'>
                <p>Edit</p>
            </div>
        </>
    )
}

export default EditTask