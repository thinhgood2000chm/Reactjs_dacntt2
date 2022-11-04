import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';
import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'

import '../../css/findFriend.css'

function FindFriend(props) {
    const [users, setUser] = useState()
    const { state } = useLocation();
    const token = getCookieToken()
    const search = useLocation().search;
    const [isChangeTypeAfterClickRequestFriend, setisChangeTypeAfterClickRequestFriend] = useState(false)
    const currentUserId = state['currentUserId']

    const name = new URLSearchParams(search).get('name');

    useEffect(() => {
        fetch(`${BASE_URL}api/account/${name}`, {
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
            }).then(dataUser => {
                setUser(dataUser)
                setisChangeTypeAfterClickRequestFriend(false)

            })
            .catch(err => {
                console.error(err)
            })
    }, [isChangeTypeAfterClickRequestFriend, search])


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
            .then(() => {
                setisChangeTypeAfterClickRequestFriend(true)
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
            }

        )
            .then((res) => {
                if (res.ok) {
                    setisChangeTypeAfterClickRequestFriend(true)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
    const listUserFind = []
    var buttonType = ''
    for (var i = 0; i < users?.length; i++) {
        if (users[i]._id === currentUserId) {
            continue
        }
        if (users[i].friendStatus === true) {
            buttonType = <Button disabled variant='success'>Bạn bè</Button>
        }
        else if (users[i].friendStatus === false) {
            buttonType = <Button disabled variant='light'>Đã gửi lời mời</Button>

        }
        else if (users[i].friendStatus == null) {
            buttonType = <Button iduser={users[i]._id} onClick={SendFriendRequest}>Kết bạn</Button>

        }
        else if (users[i].friendStatus == 'other') {
            buttonType = <Button iduser={users[i]._id} onClick={onAcceptRequest}>Xác nhận</Button>
        }
        listUserFind.push(
            <div key={users[i]?._id} className='card mb-3 d-flex flex-row justify-content-between'>
                <div className='my-auto'>
                    <img src={users[i]?.picture} className='rounded-circle card-img' alt='avatar'></img>
                </div>
                <div className='my-auto flex-grow-1'>
                    <h5><Link className='text-dark fw-bold text-decoration-none' to={`/personal/${users[i]?._id}/post/`} state={{ 'id': users[i]?._id }}>{users[i]?.fullname}</Link></h5>
                </div>
                <div className='my-auto me-2'>{buttonType}</div>
            </div>
        )
    }
    return (
        <div className='container find-friend'>
            <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6'>

                    {listUserFind}

                </div>
                <div className='col-md-3'></div>
            </div>
        </div>

    );
}

export default FindFriend;