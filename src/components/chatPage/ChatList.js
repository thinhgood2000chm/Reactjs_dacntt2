/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext, useRef } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons'

import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'
import { SocketContext } from '../../middlewares/socket';

function ChatList(props) {
    const { currUserInfo, conversationId } = props
    const [mess, setMess] = useState() // mess này dùng để chứa các message được gửi lên từ backend
    const [numberMess, setnumberMess] = useState(0)
    const [message, setMessage] = useState('')// message này ở trong ô input type để hiện thị chữ khi nhập  va lấy giá trị nhập vào 
    const [checkHaveNewMessage, setCheckHaveNewMessage] = useState(false)
    const [newMess, setNewMess] = useState()
    
    const messageRef = useRef(null)
    const socket = useContext(SocketContext);
    const [conversationIdState, setConversationIdState] = useState(conversationId?conversationId:"")
    const [loading, setLoading] = useState(true);
    const [loadingSend, setLoadingSend] = useState(false);

    var token = getCookieToken()

    var listMess = []
    useEffect(() => {
        socket.emit("leaveroom", conversationIdState)
        setConversationIdState(conversationId)
        socket.emit("joinRoom", conversationId)

        if (conversationId) {
            setLoading(true)

            fetch(`${BASE_URL}api/conversation/${conversationId}/message`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }

            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    setLoading(false)
                })
                .then(messData => {
                    setMess(messData)
                    setnumberMess(numberMess + messData?.length)
                    setLoading(false)
                })
        }
    }, [conversationId])

    useEffect(() => {
        socket.on('receiveNewMess', data => {
            setCheckHaveNewMessage(true)
            setNewMess(data)
        })
    }, [socket])

    useEffect(() => {
        // đk cuối cùng để tránh việc react tự động nhận dữ liệu 2 lần ( dữ liệu bị lặp lại ) 
        if (checkHaveNewMessage && mess?.length > 0 && newMess?._id !== mess[0]?._id) {
            setMess([...[newMess], ...mess])
        }
        setCheckHaveNewMessage(false)
    }, [checkHaveNewMessage])

    useEffect(() => {
        messageRef.current?.scrollIntoView() // tự động scroll xuống cuối 
    }, [mess])

    const handleInputChange = (e) => {
        setMessage(e.target.value)
    }
    const handleSendMessage = (e) => {
        e.preventDefault();
        setLoadingSend(true)
        if (message?.length > 0) {
            fetch(`${BASE_URL}api/message`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "conversationId": conversationId,
                        "mess": message
                    })
                })
                .then((res) => {
                    setMessage('')
                    if (res.ok) {
                        return res.json()
                    }
                    setLoadingSend(false)
                })
                .then((newMess) => {

                    setLoadingSend(false)
                    setMess([...[newMess], ...mess])
                })
                .catch(err => {
                    console.log(err)
                    setLoadingSend(false)
                })
        }
    }

    for (var i = mess?.length - 1; i >= 0; i--) {
        if (mess[i]?.senderId?._id === currUserInfo._id) {
            listMess.push(
                <div key={mess[i]?._id} className='author-message'>
                    <div className='author-message-content'>{mess[i]?.text}</div>
                </div>)
        }
        else {
            listMess.push(

                <div key={mess[i]?._id} className='client-message'>
                    <img className='user-img rounded-circle'
                        src={mess[i]?.senderId?.picture}
                        alt='Avatar user'>
                    </img>
                    <div className='client-message-content'>{mess[i]?.text}</div>
                </div>

            )
        }
    }
    //   <div  ref = {messageRef}/>  để tự động sroll xuống cuối
    return (
        <>
            <div className='flex-grow-1 over-y-auto'>
                {loading ?
                    <div className='w-100 text-center mt-3'><ClipLoader color={'#5239AC'} loading={loading} size={48} /></div>
                    :
                    listMess
                }
                <div ref={messageRef} />
            </div>

            <form className='border border-secondary rounded-pill px-3 d-flex send-message bg-light my-3 me-3' onSubmit={handleSendMessage}>
                <FontAwesomeIcon icon={faComment} className='mx-2 my-auto' />
                <input onChange={handleInputChange} value={message} type='text' className='message-input py-2 pe-3' placeholder='Nhập tin nhắn...'></input>
                {loadingSend ?
                    <div className='w-100 text-center mt-3'><ClipLoader color={'#5239AC'} loading={loading} size={24} /></div>
                    :
                    <button type='submit' className='btn'><FontAwesomeIcon icon={faPaperPlane} className='my-auto' /></button>
                }
                
            </form>

        </>
    );
}

export default ChatList;
