import React, { useState, Component, useEffect } from 'react';

const Forum = (props) => {
    const [messages, setMessages] = useState([]);

    const [user, setUser] = useState('');

    const [newMessage, setNewMessage] = useState({
        message: '',
        user: user,
    });

    useEffect(() => {
        fetch('/community/messages/')
            .then(res => res.json())
            .then(retrievedMessages => setMessages(retrievedMessages));
    }, []);

    useEffect(() => {
        fetch('/feed/')
            .then(res => res.json())
            .then(user => setUser(user.username))
            .then(setNewMessage({
                ...newMessage,
                user
            }))
    }, []);

    const handleSubmitMessage = (event) => {
        event.preventDefault();
        const data = {
            message: newMessage.message,
            user: user
        };
        fetch(`/community/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => setMessages(data))
            .then(setNewMessage({
                ...newMessage,
                message: ''
            }))
            .catch((err) => console.log('Forum: add message: ERROR: ', err))
    }

    const messageElems = () => {
        const dateTimeOptions = {
            timeZone: 'America/New_York',
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };

        return messages.slice().reverse().map((msg, index) => (
            <div class="message-container" key={index}>
                <div>Posted by <b>{msg.user}</b> at {new Date(msg.createdAt).toLocaleString('en-US', dateTimeOptions)} ET.</div>
                <div>"{msg.message}"</div>
                <div>{msg.comments}</div>
                <div>{msg.likes} likes</div>
            </div>
        ));
    }

    const newMessageForm = () => {
        if (user) {
            return (
                <div className='new-message'>
                    <div>Currently logged in as <b>{user}</b>. Not {user}? <a href="/signout">Sign out</a></div>
                    <input
                        name="message"
                        id="message"
                        type="text"
                        placeholder="Type your post here"
                        value={newMessage.message}
                        onChange={(e) => {
                            setNewMessage({
                                ...newMessage,
                                [e.target.name]: e.target.value
                            })
                        }} />
                    <button onClick={handleSubmitMessage}>Submit new post</button>
                </div>
            )
        }
    }

    if (messages.length === 0) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            {newMessageForm()}
            {messageElems()}
        </div>

    )
}

export default Forum;
