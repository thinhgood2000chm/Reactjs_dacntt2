/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'
import '../../css/FriendRequestBox.css'

function FriendRequestBox(props) {
    const { setMess, setCheckShowMessage } = props

    const token = getCookieToken()
    const navigate = useNavigate()

    const [friendRequest, setFriendRequest] = useState()

    const navigateToOther = (id) => {
        navigate(`/personal/${id}/post/`, { replace: true, state: { 'id': id } });
    }
    useEffect(() => {
        fetch(`${BASE_URL}api/requestFriend/`,
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
                if (data?.length > 0)
                    setFriendRequest(data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    const onAcceptRequest = (e) => {
        var idUserInQueue = e.target.attributes.getNamedItem('iduser')?.value;
        fetch(`${BASE_URL}api/requestFriend/reply/${idUserInQueue}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "start": friendRequest?.length })
            }

        )
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(data => {
                setFriendRequest(data)
                setMess('Đã thêm bạn bè')
                setCheckShowMessage(true)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const onDeleteRequest = (e) => {
        var idUserInQueue = e.target.attributes.getNamedItem('iduser').value;
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
                    return res.json()
                }
            })
            .then(data => {
                setFriendRequest(oldList => oldList.filter(item => item._id !== data._id));
                setMess('Đã từ chối kết bạn')
                setCheckShowMessage(true)
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <div className='friend-request mt-3'>
            <div className='text-secondary'>
                <b>Lời mời kết bạn</b>
            </div>
            {friendRequest?.length > 0 ?

                friendRequest.map(item => (
                    <div key={item._id} className='request-card py-2 mt-2 my-box-shadow' >
                        {/* <div  className='request-card py-2 mt-2' > */}
                        <div className='d-flex mb-2 cursor-pointer' onClick={() => navigateToOther(item.userRequest?._id)}>
                            <div className='user-avatar'>
                                <img alt='user avatar' src={item.userRequest?.picture}></img>
                            </div>
                            <div>
                                <div><b>{item.userRequest?.fullname}</b></div>
                                {/* <div className='text-secondary'>2 bạn chung</div> */}
                            </div>
                        </div>

                        <div className='text-center'>
                            <button iduser={item.userRequest?._id} type='button' className='btn btn-primary rounded-pill me-2 mt-1' onClick={onAcceptRequest}>Chấp nhận</button>
                            <button iduser={item.userRequest?._id} type='button' className='btn btn-refuse rounded-pill ms-0 me-2 mt-1' onClick={onDeleteRequest}>Xóa</button>
                        </div>
                    </div>
                ))
                :
                <div className='request-card py-2 mt-2 my-box-shadow'>
                    <div className='d-flex mb-2'>
                        <div>
                            <div><b>Chưa có lời mời kết bạn nào</b></div>
                        </div>
                    </div>
                </div>

            }
        </div>
    );
}

export default FriendRequestBox;
