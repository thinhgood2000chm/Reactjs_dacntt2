/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import InfiniteScroll from 'react-infinite-scroll-component';

import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'

function NotificationList(props) {
    const { noifiInfos, loadingNotiList, lenNotification, setNotificationInfo, setNumberNotiNotChecked, numberNotiNotChecked } = props
    const [isChangeStatusNoti, setIsChangeStatusNoti] = useState(false)
    const [hasMorePost, setHasMorePost] = useState(lenNotification>0);
    const now = new Date();

    const token = getCookieToken()
    var listNoti = []

    if (lenNotification===0)
        listNoti.push(<p className='text-info'>Không có thông báo</p>)

    const fetchMoreData = () => {
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
                setHasMorePost(false);
            }).then(notification => {
                if (notification?.length < 5) {
                    setHasMorePost(false);
                    return;
                }

                setNotificationInfo([...noifiInfos, ...notification])
                var numberNotCheck = 0
                for (var i = 0; i <= notification?.length; i++) {
                    if (!notification[i]?.isChecked) {
                        numberNotCheck = numberNotCheck + 1
                    }
                }
                // setNumberNotiNotChecked(numberNotCheck)

            })
            .catch(err => {
                console.error(err)
            })
    }
    const handleChangeStatus = (e) => {
        const notiId = e.target.attributes.getNamedItem('notiid').value;
        const token = getCookieToken()
        const data = {
            "notificationId": notiId
        }
        fetch(`${BASE_URL}api/notification/status`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)

        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
            }).then(notification => {

                for (var i = 0; i <= noifiInfos?.length; i++) {
                    if (noifiInfos[i]?._id === notification?._id) {
                        noifiInfos[i] = notification
                        setIsChangeStatusNoti(true)
                        setNumberNotiNotChecked(numberNotiNotChecked - 1)
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
    // sử dụng useEffect và state isChangeStatusNoti để kiểm tra nếu có thay đổi trong list noti thì tiến hành cập nhật lại mà ko càn fetch lại dữ liệu 
    // vì dữ liệu đã được thay thế ở hàm handleChangeStatus
    useEffect(() => {
        if (isChangeStatusNoti) {
            for (var i = 0; i < noifiInfos?.length; i++) {
                listNoti.push(
                    <>
                        <div key={noifiInfos[i]?._id} className={noifiInfos[i]?.isChecked ? 'd-flex mb-2' : 'd-flex mb-2 background-noti'}>
                            <div className='notification-user-avatar'>
                                <img alt='user avatar' src={noifiInfos[i]?.userIdGuest?.picture}></img>
                            </div>
                            <div className='notification-content'>
                                <div><b>{noifiInfos[i]?.userIdGuest?.fullname}</b> {noifiInfos[i]?.content}</div>
                                <div className='fs-smaller text-secondary'>{noifiInfos[i]?.createdAt ? formatTime(noifiInfos[i]?.createdAt):''} giờ trước</div>
                            </div>
                            <div className='notification-button'>
                                {noifiInfos[i]?.isChecked ? <></> : <div><FontAwesomeIcon notiid={noifiInfos[i]?._id} icon={faCheck} color='green' onClick={handleChangeStatus} /></div>}
                                <div><FontAwesomeIcon icon={faX} color='red' /></div>
                            </div>


                        </div>
                        <hr></hr>
                    </>
                )
            }
            setIsChangeStatusNoti(false)
        }

    }, [isChangeStatusNoti])

    for (var i = 0; i < noifiInfos?.length; i++) {
        listNoti.push(
            <>
                <div key={noifiInfos[i]?._id} className={noifiInfos[i]?.isChecked ? 'd-flex mb-2' : 'd-flex mb-2 background-noti'}>
                    <div className='notification-user-avatar'>
                        <img alt='user avatar' src={noifiInfos[i]?.userIdGuest?.picture}></img>
                    </div>
                    <div className='notification-content'>
                        <div><b>{noifiInfos[i]?.userIdGuest?.fullname}</b> {noifiInfos[i]?.content}</div>
                        <div className='fs-smaller text-secondary'>{noifiInfos[i]?.createdAt ? formatTime(noifiInfos[i]?.createdAt):''}</div>
                    </div>
                    <div className='notification-button'>
                        {noifiInfos[i]?.isChecked ? <></> : <div><FontAwesomeIcon notiid={noifiInfos[i]?._id} icon={faCheck} color='green' onClick={handleChangeStatus} className='p-2 cursor-pointer'/></div>}
                        {/* <div><FontAwesomeIcon icon={faX} color='red' /></div> */}
                    </div>


                </div>
                <hr></hr>
            </>
        )
    }

    return (
        <div
            id='scrollableDiv'
            className='menu-popup notifications-popup'
        >
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
                dataLength={lenNotification || 0}
                next={fetchMoreData}
                hasMore={hasMorePost}
                loader={<p className='text-info'>Đang tải thông báo...</p>}
                scrollableTarget='scrollableDiv'
            >
                {loadingNotiList ?
                    <div className='w-100 text-center mt-3'><ClipLoader color={'#5239AC'} loading={loadingNotiList} size={48} /></div>
                    :
                    listNoti
                }

                {/* {notificationInfos && notificationInfos.map((item) => (
                    <div className='d-flex mb-2'>
                        <div className='notification-user-avatar'>
                            <img alt='user avatar' src={item?.userIdGuest.picture}></img>
                        </div>
                        <div className='notification-content'>
                            <div><b>{item?.userIdGuest?.fullname}</b> {item?.content}</div>
                            <div className='fs-smaller text-secondary'>{now - item?.createdAt} giờ trước</div>
                        </div>
                    </div>
                ))} */}
            </InfiniteScroll>
        </div>
    );
}

const formatTime = (time) => {
    let date = time.slice(0,10)
    let dateArr = date.split("-")
    return dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0]
}

export default NotificationList;