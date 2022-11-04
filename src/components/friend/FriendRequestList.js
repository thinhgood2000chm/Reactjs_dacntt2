import React, { useEffect, useState } from 'react';
import '../../css/FriendRequest.css';

import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'


function FriendRequestList(props) {
    const [friendRequest, setFriendRequest] = useState()
    const [message, setMessage] = useState()
    const token = getCookieToken()
    useEffect(() => {
        fetch(`${BASE_URL}api/requestFriend/`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            
            }

        )
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(data => {
                setFriendRequest(data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    const onAcceptRequest = (e) =>{
        var idUserInQueue = e.target.attributes.getNamedItem('iduser').value;
        fetch(`${BASE_URL}api/requestFriend/reply/${idUserInQueue}`,
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({'start':friendRequest?.length})
        }

    )
        .then((res) => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(data => {
            setFriendRequest(data)
        })
        .catch(err => {
            console.error(err)
        })
    }

    const onDeleteRequest = (e) =>{
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
        .then(mess => {
            setMessage(mess)
        })
        .catch(err => {
            console.error(err)
        })
    }
    var listFriendRequest = []
    for (var i = 0; i < friendRequest?.length; i++) {

        listFriendRequest.push(
            <div key={friendRequest[i]?._id} className="col-3 mt-3 card text-dark bg-light mb-3" iduser={friendRequest[i]?._id}>
                <img src={friendRequest[i]?.userRequest?.picture} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{friendRequest[i]?.userRequest?.fullname}</h5>

                </div>
                <div className="card-body">
                    <div className='row'>
                        <button  iduser={friendRequest[i]?.userRequest?._id} type="button" className="button btn btn-primary" onClick={onAcceptRequest}>Xác nhận</button>
                    </div>

                    <div className='row'>
                        <button type="button" className="button btn btn-secondary" onClick={onDeleteRequest} >Xóa</button>
                    </div>

                </div>
            </div>)
    }
    var listRow = []
    for (var index = 0; index < listFriendRequest?.length; index++) {
        if(index%4===0) {
            var startColumInRow = listFriendRequest[index]
            listRow.push(<div className="row">

                <div className="d-flex justify-content-center">

                    {startColumInRow}

                </div>

            </div>)

        }
        else if (index+1 % 4 === 1) {
            startColumInRow = listFriendRequest[index]

            if (index === listFriendRequest.length - 1) {
                listRow.push(<div className="row">

                    <div className="d-flex justify-content-center">

                        {startColumInRow}

                    </div>

                </div>)
            }
            }
     
        
        }
        return (
            <div className="container">

                <div className="row">
                    <div className="col-3">

                    </div>
                    <div className="col-9">
                        <h4 className="friendrequesttext">Lời mời kết bạn</h4>
                        {listRow}
                        {/* <div className="d-flex justify-content-center" >

              


                        </div> */}
                    </div>


                </div>
            </div>
        );
    }

    export default FriendRequestList;
