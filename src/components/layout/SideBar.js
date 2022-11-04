/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import Popup from 'reactjs-popup';
import ClipLoader from 'react-spinners/ClipLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faEnvelope, faHouse, faGear, faCirclePlus } from '@fortawesome/free-solid-svg-icons'

import { BASE_URL } from '../../middlewares/constant';
import NotificationList from '../notification/NotificationList';
import { getCookieToken, removeCookieToken } from '../../middlewares/common'

import PostModal from '../post/PostModal';

import '../../css/SideBar.css'
import io from "socket.io-client";
const socket = io.connect(BASE_URL);

function SideBar(props) {
    const { numberNotification, currUserInfo, onCreatePost } = props

    const token = getCookieToken()
    const navigate = useNavigate();

    const [loadingNoti, setLoadingNoti] = useState(true);
    const [loadingNotiList, setLoadingNotiList] = useState(true);
    const [activeItem, setActiveItem] = useState('')
    const [openModal, setOpenModal] = useState(false);

    const [numberNotiNotChecked, setNumberNotiNotChecked] = useState(0)
    const [notificationInfos, setNotificationInfo] = useState()
    const [lenNotification, setlenNotification] = useState(0)

    const resetActive = () => {
        setActiveItem('');
    }

    const setActive = (item) => {
        setActiveItem(item);
    }

    const navigateToOther = (id) => {
        navigate(`/personal/${id}/post/`, { replace: true, state: { 'id': id } });
    }

    useEffect(() => {
        if (numberNotification !== 0) {
            setNumberNotiNotChecked(numberNotiNotChecked + 1)
        }



    }, [numberNotification]);


    useEffect(() => { // chỗ này để mới vào nó fetch để lấy ra dữ liệu cho số lượng noti

        fetch(`${BASE_URL}api/notification/?skip=${lenNotification}`, {
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
            }).then(notification => {
                setNotificationInfo(notification)
                setlenNotification(notification?.length)
                var numberNotCheck = 0
                for (var i = 0; i <= notification?.length; i++) {
                    if (notification[i]?.isChecked === false) {
                        numberNotCheck = numberNotCheck + 1
                    }
                }
                setNumberNotiNotChecked(numberNotCheck)
                setLoadingNoti(false)

            })
            .catch(err => {
                console.error(err)
            })

    }, [])

    const showNoti = () => {
        // bấm vào hình chuông luôn fetch lại để lấy cái mới nhất
        fetch(`${BASE_URL}api/notification/?skip=0`, {
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
            }).then(notification => {
                if (notification.length>0){
                    setNotificationInfo(notification)
                    setlenNotification(lenNotification + notification.length)// length này dùng để fetch lấy thêm dữ liệu 
                    var numberNotCheck = 0
                    for (var i = 0; i <= notification?.length; i++) {
                        if (notification[i]?.isChecked === false) {
                            numberNotCheck = numberNotCheck + 1
                        }
                    }
                    // setNumberNotiNotChecked(numberNotCheck)
                }
                setLoadingNotiList(false)

            })
            .catch(err => {
                console.error(err)
            })
    }

    const logout = () => {
        removeCookieToken();
        socket.emit("disconnect_session", currUserInfo._id);
        navigate('/login', { replace: true });
    }


    return (
        <div className='sidebar cursor-pointer'>
            <div className='d-flex flex-row mb-3 c-border px-3 py-2 user-info my-box-shadow' onClick={() => navigateToOther(currUserInfo?._id)}>
                <img src={currUserInfo?.picture} className='rounded-circle sidebar-avatar' alt='avatar'></img>
                <div className='fw-bold my-auto md-hide ms-3'> {currUserInfo?.familyName.split(' ').slice(-1)}</div>
            </div>

            <div className='c-border menu my-box-shadow'>
                {/* trang chủ */}
                <div className={activeItem ? 'menu-item' : 'menu-item active'}>
                    <FontAwesomeIcon icon={faHouse} /><div className='md-hide sidebar-title'>Trang chủ</div>
                </div>

                {/* thông báo */}

                {loadingNoti ?
                    <div className='w-100 text-center mt-3'><ClipLoader color={'#5239AC'} loadingNoti={loadingNoti} size={32} /></div>
                    :
                    <Popup
                        trigger={
                            <div className={activeItem === 'noti' ? 'menu-item active' : 'menu-item'} id='notifications'>
                                <FontAwesomeIcon onClick={showNoti} icon={faBell} /> <small className='notification-count'>{numberNotiNotChecked}</small><div className='md-hide sidebar-title' onClick={showNoti}>Thông báo</div>
                            </div>
                        }
                        onOpen={() => setActive('noti')}
                        onClose={resetActive}
                        position='right center'
                    >
                        <NotificationList
                            loadingNotiList={loadingNotiList}

                            setNotificationInfo={setNotificationInfo}
                            lenNotification={lenNotification}
                            noifiInfos={notificationInfos}
                            numberNotiNotChecked={numberNotiNotChecked}
                            setNumberNotiNotChecked={setNumberNotiNotChecked}
                        />

                    </Popup>
                }

                {/* tin nhắn */}
                <div className='menu-item' id='message-notifications' onClick={() => { navigate('/chat', { replace: true }); }}>
                    {/* <FontAwesomeIcon icon={faEnvelope} /> <small className='notification-count'></small><div className='md-hide sidebar-title'>Tin nhắn</div> */}
                    <FontAwesomeIcon icon={faEnvelope} /><div className='md-hide sidebar-title'>Tin nhắn</div>
                </div>

                {/* cài đặt */}
                <Popup
                    trigger={
                        <div className={activeItem === 'setting' ? 'menu-item active' : 'menu-item'}>
                            <FontAwesomeIcon icon={faGear} /><div className='md-hide sidebar-title'>Cài đặt</div>
                        </div>
                    }
                    onOpen={() => setActive('setting')}
                    onClose={resetActive}
                    position='right center'
                    nested
                >
                    <div className='menu-popup d-flex flex-column'>
                        <button type='button' className='btn btn-success mb-2'><Link className='btn-link-text' to={`/account/setting`}>Sửa thông tin cá nhân</Link></button>
                        <button type='button' className='btn btn-danger' onClick={logout}>Đăng xuất</button>
                    </div>
                </Popup>
                {/*  */}
            </div>


            {/* Tạo bài viết */}
            <div className='mt-3 c-border btn-post' onClick={() => setOpenModal(o => !o)}>
                <FontAwesomeIcon icon={faCirclePlus} />
                <div className='md-hide sidebar-title'>Đăng bài</div>
                <PostModal
                    onCreatePost={onCreatePost}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    currUserInfo={currUserInfo} />
            </div>

        </div>
    );
}

export default SideBar;