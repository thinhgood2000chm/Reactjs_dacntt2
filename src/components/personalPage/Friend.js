/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
import { getCookieToken } from '../../middlewares/common'
import { BASE_URL } from '../../middlewares/constant';
import Popup from 'reactjs-popup';

import '../../css/Friend.css';

function Friend(props) {
    let { id } = useParams();

    const [friendInfo, setFriendInfo] = useState('')
    const token = getCookieToken()
    var listFriend = []
    var listRow = []

    const onLoadAllFriend = () => {
        fetch(`${BASE_URL}api/friend/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                // body: JSON.stringify(yourNewData)
            }

        )
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then((data) => {

                setFriendInfo(data)
            })
            .catch(err => {
                console.error(err)
            })
    }
    useEffect(() => {
        onLoadAllFriend()
    }, [])
    const deleteFriend = (e) => {
        var friendId = e.target.attributes.getNamedItem('friendid').value;
        fetch(`${BASE_URL}api/deleteFriend/${friendId}`,
            {
                method: 'DELETE',
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
            .then((data) => {
                onLoadAllFriend()
            })
            .catch(err => {
                console.error(err)
            })

    }
    if (friendInfo?.length === 0) {
        listRow.push(<div className='text-secondary fs-4'>Bạn chưa có người bạn nào, hãy kết bạn thêm nhé</div>)
    }
    else {
        for (var i = 0; i < friendInfo?.length; i++) {
            listFriend.push(
                <div id={friendInfo[i]?._id} className='col-5 mt-3 card-info'>

                    <div className='card mb-3'>
                        <div className='row no-gutters'>
                            <div className='col-4 md-4'>
                                <img src={friendInfo[i]?.picture} className='card-img ms-2' alt='...'></img>
                            </div>
                            <div className='col-6 md-6 d-flex align-items-center'>
                                <div className='card-body'>
                                    <h5 className='card-text'><Link to={`/personal/${friendInfo[i]?._id}/post`} className='text-name-friend' state={{ 'id': friendInfo[i]?._id }}>{friendInfo[i].fullname}</Link></h5>
                                    {/* <h5 className='card-title'>{friendInfo[i].fullname}</h5> */}
                                </div>
                            </div>
                            <div className='col-2 md-2'>
                                <div>
                                    <Popup
                                        trigger={<div className='three-dot-icon position-absolute top-50 end-0 translate-middle-y'><FontAwesomeIcon icon={faEllipsisH} /> </div>}
                                        position='right top'
                                        on='hover'
                                        closeOnDocumentClick
                                        mouseLeaveDelay={300}
                                        mouseEnterDelay={0}
                                        contentStyle={{ padding: '0px', border: 'none' }}
                                        arrow={false}
                                    >
                                        <div type='button' className='btn btn-warning' friendid={friendInfo[i]._id} onClick={deleteFriend}>Hủy kết bạn</div>
                                    </Popup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
        for (var index = 0; index < listFriend?.length; index++) {
            if (index % 2 === 0) {
                var firstColumn = listFriend[index]
                if (index === listFriend?.length - 1) {
                    listRow.push(
                        <div className='row'>
                            <div className='d-flex justify-content-center'>
                                {firstColumn}
                            </div>
                        </div>
                    )
                }
            }
            else {
                var secondColumn = listFriend[index]
                listRow.push(
                    <div className='row'>
                        <div className='d-flex justify-content-center'>
                            {firstColumn}
                            {secondColumn}
                        </div>
                    </div>
                )
            }
        }
    }

    return (

        <div className='card personal-friend'>

            <div className='container'>
                <div className='row'>
                    <h4 className='tag-name text-info'>Bạn bè</h4>
                </div>
                {listRow}
            </div>

        </div>
    )
}

export default Friend;