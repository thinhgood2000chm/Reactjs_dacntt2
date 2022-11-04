import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

import { BASE_URL, CHAT_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'
import axios from '../../middlewares/axios';

import Friend from './Friend'
import Infor from './Infor'
import UserPostList from './UserPostList';

import '../../css/PersonalInfor.css';

function PersonalInfor(props) {
    const { currUserInfo } = props
    const navigate = useNavigate()
    const token = getCookieToken()
    const { id } = useParams()

    const [activeMenu, setActiveMenu] = useState('post')
    const [info, setInfo] = useState()
    const [buttonTextSendRequestFriend, setButtonTextSendRequestFriend] = useState()

    // const [idUser, setIdUser] =  useState(id ? id : ''); 
    // const location = useLocation();
    // const [idUser, setIdUser] = useState(location.state ? location.state.id : null);
    // const location = useLocation();
    // setIdUser(location.state)
    // const data = location.state

    useEffect(() => {
        fetch(`${BASE_URL}api/profile/${id}`,
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
                setInfo(data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [id]) // [id] để useEffect load lại mỗi khi id có sự thay đổi

    function SendFriendRequest(e) {
        var idUserWantoSendRequest = e.target.attributes.getNamedItem('iduser').value;

        fetch(`${BASE_URL}api/requestFriend/${idUserWantoSendRequest}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {

                if (res.ok) {
                    return res.json()
                }
            })
            .then(textOfButton => {
                setButtonTextSendRequestFriend(<div className='btn btn-light disabled d-block d-md-inline-block lift send-friend-request'>Đã gửi lời mời </div>)
            })
            .catch(err => {
                console.error(err)
            })
    }


    const onAcceptRequest = (e) => {
        var idUserInQueue = e.target.attributes.getNamedItem('iduser').value;
        fetch(`${BASE_URL}api/requestFriend/reply/${idUserInQueue}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // body: JSON.stringify({'start':friendRequest?.length})
            }

        )
            .then((res) => {
                if (res.ok) {
                    setButtonTextSendRequestFriend(<div className='btn btn-success disabled d-block d-md-inline-block lift send-friend-request'>Bạn bè </div>)

                }
            })
            // .then(data => {

            // })
            .catch(err => {
                console.error(err)
            })
    }

    const onDeleteRequest = (e) => {
        var idUserInQueue = e.target.attributes.getNamedItem('iduser').value
        fetch(`${BASE_URL}api/requestFriend/deny/${idUserInQueue}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                if (res.ok) {
                    setButtonTextSendRequestFriend(<div iduser={idUserInQueue} className='btn btn-primary d-block d-md-inline-block lift send-friend-request' onClick={SendFriendRequest}>Gửi lời mời</div>)
                }
            })
            // .then(mess => {
            //     setMessage(mess)
            // })
            .catch(err => {
                console.error(err)
            })
    }
    const sendRequestFriendAndChat = []

    useEffect(() => {
        if (!info?.isCurrentUserLoginPage) {
            if (info?.friendStatus === null) {
                setButtonTextSendRequestFriend(<div iduser={info?._id} className='btn btn-primary d-block d-md-inline-block lift send-friend-request' onClick={SendFriendRequest}>Gửi lời mời</div>)
            }
            if (info?.friendStatus === true) {
                setButtonTextSendRequestFriend(<div className='btn btn-success disabled d-block d-md-inline-block lift send-friend-request'>Bạn bè </div>)

            }
            else if (info?.friendStatus === false) {
                setButtonTextSendRequestFriend(<div className='btn btn-light disabled d-block d-md-inline-block lift send-friend-request'>Đã gửi lời mời </div>)
            }
            else if (info?.friendStatus === 'other') { // TODO: làm xác nhận
                setButtonTextSendRequestFriend(<><div iduser={info?._id} className='btn btn-primary d-block d-md-inline-block lift send-friend-request' onClick={onAcceptRequest} >Xác nhận</div><div onClick={onDeleteRequest} iduser={info?._id} className='btn btn-secondary d-block d-md-inline-block lift send-friend-request'>Xóa</div></>)
            }
        }

    }, [info])


    const handleBtnChat = async (e) => {
        e.preventDefault();
        if (id === currUserInfo?._id)
            return navigate('/chat', { replace: true });

        try {
            const response = await axios.post(CHAT_URL, JSON.stringify({ receiverId: id }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
            response?.data?.members.map(other => {
                if (currUserInfo?._id !== other._id)
                    return navigate('/chat', { state: { otherUser: other }, replace: true });
            });

        } catch (err) {
            console.log(err);
        }

    }

    sendRequestFriendAndChat.push(
        <div className='col-12 col-md-auto mt-2 mt-md-0 mb-md-3'>

            {buttonTextSendRequestFriend}

            <button type='button' onClick={handleBtnChat} className='btn btn-primary d-block d-md-inline-block lift'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-chat-square-dots-fill' viewBox='0 0 16 16'>
                    <path d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' />
                </svg> {id === currUserInfo?._id ? 'Xem tin nhắn' : 'Nhắn tin'}
            </button>

        </div>)



    return (
        <div className='container'>

            <div className='card bg-light listcard'>
                <div className='card-body h-100'>
                    <div className='header'>
                        <img src={info?.backgroundPicture} alt='Blog img' className='header-img-top' width='100%' height='256px'></img>

                        <div className='container-fluid'>
                            <div className='header-body mt-n5 mt-md-n6'>
                                <div className='row align-items-end'>

                                    <div className='col-auto'>
                                        <div className='avatar avatar-xxl header-avatar-top'>
                                            <img alt='user logo' src={info?.picture} width='128px' hight='128px' className='avatar-img rounded-circle border border-4 border-body'></img>
                                        </div>

                                    </div>

                                    <div className='col mb-3 ml-n3 ml-md-n2'>
                                        <h1 className='header-title'>
                                            {info?.fullname}
                                        </h1>
                                        <h6 className='header-pretitle'>
                                            Class: {info?.className}
                                        </h6>

                                    </div>
                                    {sendRequestFriendAndChat}

                                </div>
                                <div className='row align-items-center'>
                                    <ul className='nav nav-tabs nav-overflow header-tabs'>
                                        <li className='nav-item'>
                                            <Link id='post' to={`/personal/${id}/post`} className={activeMenu === 'post' ? 'active nav-link' : 'nav-link'} onClick={() => { setActiveMenu('post') }}>Bài đăng</Link>
                                        </li>
                                        <li className='nav-item'>
                                            <Link id='friend' to={`/personal/${id}/friend`} className={activeMenu === 'friend' ? 'active nav-link' : 'nav-link'} onClick={() => { setActiveMenu('friend') }}>Bạn bè</Link>
                                        </li>
                                        <li className='nav-item'>
                                            <Link id='infomation' to={`/personal/${id}/infomation`} className={activeMenu === 'infomation' ? 'active nav-link' : 'nav-link'} onClick={() => { setActiveMenu('infomation') }}>Thông tin</Link>
                                        </li>

                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <Routes>
                    <Route path='/post' element={<UserPostList userID={id} currUserInfo={currUserInfo} />}></Route>

                    {/* <Route path='/post'     component={() =><PostCard id={idUser} />}></Route> */}
                    <Route path='/friend' element={<Friend />}></Route>
                    <Route path='/infomation' element={<Infor />}></Route>
                </Routes>
            </div>
        </div>


    )
}

export default PersonalInfor;