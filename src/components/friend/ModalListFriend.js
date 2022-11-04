import React from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'


function ModalListFriend(props) {
    const { currUserInfo, popupPosition, setChatWithUser } = props;

    const navigate = useNavigate();

    const chatWithOther = (otherUser) => {
        navigate('/chat', { replace: true, state: { otherUser: otherUser } });
    }
    
    const handleClickItem = (otherUser) => {
        if (setChatWithUser)
            return setChatWithUser(otherUser)
        chatWithOther(otherUser)
    }

    return (
        <div>
            <Popup
                trigger={
                    <div className='cursor-pointer svg-20'><FontAwesomeIcon className='p-2' icon={faPenToSquare} /></div>
                }
                position={popupPosition || 'bottom center'}
            >
                <div className='list-friend my-box-shadow'>                
                    <div className='text-center text-primary'><h4>Danh sách bạn bè</h4></div>
                    {currUserInfo?.friends?.map(friend => (
                        <div 
                            onClick={() => handleClickItem(friend)} 
                            className='item'>
                            <img src={friend.picture} className='rounded-circle avatar' alt='avatar'></img>
                            <b className='ms-2'>{friend.fullname}</b>
                        </div>
                    ))}
                </div>
            </Popup>
        </div>
    );
}

export default ModalListFriend;
