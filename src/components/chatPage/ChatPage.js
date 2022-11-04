import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { BASE_URL, CHAT_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common';
import axios from '../../middlewares/axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import ConversationList from './ConversationList';
import ChatList from './ChatList';
import ModalListFriend from '../friend/ModalListFriend';

import '../../css/ChatPage.css';

function ChatPage(props) {
    const { currUserInfo } = props
    const token = getCookieToken()
    // get data from navigate
    const { state } = useLocation();
    const otherUser = state?.otherUser;

    const [conversationId, setConversationId] = useState('')
    // mỗi lần click vào 1 cuộc trò chuyện nào đó thì sẽ set conversationId click qua cuộc trò chuyện khác thì sẽ thay đổi conversatioID ứng với từng cái 
    const [chatWithUser, setChatWithUser] = useState(otherUser ? otherUser : '') // người đang nhắn tin cùng
    
    useEffect(() => {
        if (chatWithUser) {
            const id = chatWithUser._id
            fetch(`${BASE_URL}api/conversation/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json()
                    }
                })
                .then(data => {
                    if(data?.length>0)
                        return setConversationId(data._id)
                    return createConversation(id)
                    
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [chatWithUser])

    const handleChatWithOther = (user, conversationId) => {
        setChatWithUser(user);
        setConversationId(conversationId)
    }

    const createConversation = async (receiverId) => {
        try {
            const response = await axios.post(CHAT_URL, JSON.stringify({ receiverId: receiverId }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
            setConversationId(response?.data?._id);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='chat-page mt-3'>
            {/* Title */}
            <div className='title-row'>
                {/* Box1 thông tin currUser */}
                <div className='first-box d-flex justify-content-between'>
                    <div></div>
                    <div className='title-item'>{currUserInfo?.fullname}</div>
                    <div className='my-auto'><ModalListFriend currUserInfo={currUserInfo}  setChatWithUser={setChatWithUser}/></div>
                    
                </div>

                {/* Box2 thông tin other user */}
                <div className='second-box d-flex justify-content-between'>
                    {/* Other user info */}
                    {chatWithUser &&
                        <>
                            <div className='d-flex d-row'>
                                <img className='title-item user-img rounded-circle'
                                    src={chatWithUser.picture}
                                    alt='Avatar user'>
                                </img>
                                <div className='title-item flex-column ms-2 text-start'>
                                    <Link to={`/personal/${chatWithUser._id}/post/`} className='user-name'>
                                        {chatWithUser.fullname}
                                    </Link>
                                    {/* TODO: online?success:secondary */}
                                    <div className='text-secondary fs-small'>
                                        {/* <div className='text-success'>Đang hoạt động</div> */}
                                        {chatWithUser.isOnline ?
                                            <div className='text-success'>Đang hoạt động</div>
                                            :
                                            <div className='text-secondary'>Đang ngoại tuyến</div>}
                                    </div>
                                </div>
                            </div>
                            {/* <div className='title-item cursor-pointer text-secondary'><FontAwesomeIcon icon={faCircleInfo} /></div> */}
                        </>
                    }

                </div>
            </div>
            {/* Content */}
            <div className='content-row d-flex'>
                {/* Box3 danh sách bạn bè */}
                <div className='third-box over-y-auto'>
                    <ConversationList currUserInfo={currUserInfo} handleChatWithOther={handleChatWithOther} chatWithUser={chatWithUser} />
                </div>

                {/* Box4 hiển thị tin nhắn */}
                <div className='fourth-box d-flex flex-column'>
                    {conversationId?.length > 0 &&
                        <ChatList conversationId={conversationId} currUserInfo={currUserInfo} chatWithUser={chatWithUser} />
                    }
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
