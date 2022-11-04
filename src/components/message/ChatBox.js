import React from 'react';
import { useNavigate } from 'react-router-dom'

import MessageList from './MessageList';
import ModalListFriend from '../friend/ModalListFriend';

import '../../css/ChatBox.css'

function ChatBox(props) {
    const { currUserInfo } = props;

    const navigate = useNavigate();

    return (
        <div className='message-box p-3 my-box-shadow'>
            <div className='d-flex justify-content-between mb-1'>
                <b className='title'>Trò chuyện</b>
                <ModalListFriend currUserInfo={currUserInfo} popupPosition={'bottom right'}/>
            </div>

            {/* <div className='mb-2'>
                <form className='d-flex rounded-pill search-bar px-1'>
                    <FontAwesomeIcon icon={faSearch} className='mx-2 my-auto' />
                    <input type='text' className='search-input py-2 pe-3' placeholder='Tìm tin nhắn...'></input>
                </form>
            </div> */}

            {/* lựa chọn */}
            <div className='options d-flex justify-content-around border'>
                <div className='cursor-pointer active'>Tin nhắn</div>
                <div>|</div>
                <div className='cursor-pointer' onClick={() => { navigate('/chat', { replace: true }); }}>Xem tất cả</div>
            </div>

            {/* danh sách tin nhắn gần đât */}
            <div>
                <MessageList currUserInfo={currUserInfo} />
            </div>


        </div>
    );
}

export default ChatBox;
