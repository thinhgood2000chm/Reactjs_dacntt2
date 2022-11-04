
import React, { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASE_URL } from '../../middlewares/constant';
import { faPhone, faBirthdayCake, faEnvelope, faTransgender, faUser } from '@fortawesome/fontawesome-free-solid';
import { getCookieToken } from '../../middlewares/common'
import Friend from "./Friend";
function Infor() {
    var { id } = useParams()
    const token = getCookieToken()
    const [info, setInfo] = useState("")
    useEffect(() => {
        fetch(`${BASE_URL}api/profile/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }

            })
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
    }, [])
    return (

        <div className='container'>
            <div className='row'>



                <div className="card mb-3">
                    <div className="row no-gutters">
                        <div className="col-4 md-4  d-flex align-items-center">
                            <h4>THÔNG TIN CÁ NHÂN</h4>
                        </div>
                        <div className="col-6 md-6  d-flex align-items-center">
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><FontAwesomeIcon icon={faUser} />{info?.fullname}</li>
                                    <li className="list-group-item"><FontAwesomeIcon icon={faTransgender} />{info?.gender}</li>
                                    <li className="list-group-item"><FontAwesomeIcon icon={faPhone} />{info?.phone}</li>
                                    <li className="list-group-item"><FontAwesomeIcon icon={faBirthdayCake} />{info?.birthday}</li>
                                    <li className="list-group-item"><FontAwesomeIcon icon={faEnvelope} /> {info?.username}</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

            </div>


            {/* phần bạn bè  */}
            <div className='row'>
                <Friend />
            </div>


        </div>

    );
}

export default Infor;