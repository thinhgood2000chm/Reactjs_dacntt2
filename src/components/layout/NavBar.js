import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { BASE_URL, TDT_LOGO_NONE_BG_URL } from '../../middlewares/constant';
import { SocketContext } from '../../middlewares/socket';
import { getCookieToken, removeCookieToken } from '../../middlewares/common';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../../css/NavBar.css';

function NavBar(props) {
    const { currUserInfo, setCurrUserInfo } = props
    const navigate = useNavigate();
    // const [removeCookie] = useCookies(['access_token'])
    const imageClick = () => {
        navigate('/personal/post', { replace: true });
    }
    const [nameUserFind, setNameUserFind] = useState();

    const socket = useContext(SocketContext);
    const token = getCookieToken()

    useEffect(() => {
        fetch(`${BASE_URL}api/account`,
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
                socket.emit("newUser", data?._id);
                setCurrUserInfo(data)

            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    const logout = () =>{
        removeCookieToken();
        socket.emit("disconnect_session", currUserInfo._id)
        navigate('/login', { replace: true });
    }

    const findFriend = (e) => {
        e.preventDefault();
        if (nameUserFind?.length > 0)
            navigate(`/search/?name=${nameUserFind}`, { state: { "currentUserId": currUserInfo?._id } }, { replace: true });
    }

    return (
        <>
            <div className='bg-top-color'></div>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <div className='d-flex justify-content-between w-100 mx-5'>
                    <NavLink to='/' className='navbar-brand'>
                        <img src={TDT_LOGO_NONE_BG_URL} alt='TDTU logo' width='52px' height='26px'></img>
                    </NavLink>

                    <form className='d-flex rounded-pill px-3 search-bar' onSubmit={findFriend}>
                        {/* <FontAwesomeIcon icon={faSearch} className='mx-3 my-auto'/> */}
                        <input type='text' className='search-input py-2' placeholder='Tìm kiếm bạn bè...' onChange={(e) => { setNameUserFind(e.target.value) }}></input>
                        <button type="submit" className="btn"><FontAwesomeIcon icon={faSearch} className='my-auto' /></button>
                    </form>

                    <div className='d-flex flex-row my-auto'>
                        {/* <img src='http://via.placeholder.com/32x32' className='rounded-circle nav-avatar' alt='avatar' onClick={() => imageClick()}></img> */}
                        <Popup
                            trigger={
                                <div>
                                    <img src={currUserInfo?.picture} className='rounded-circle nav-avatar' alt='avatar'></img>
                                </div>
                            }
                            position='bottom center'
                        >
                            <div className='menu-popup d-flex flex-column'>
                                <button type='button' className='btn btn-success mb-2'><Link className='btn-link-text' to={`/account/setting`}>Sửa thông tin cá nhân</Link></button>
                                <button type='button' className='btn btn-danger' onClick={logout}>Đăng xuất</button>
                            </div>
                        </Popup>
                        <Link className='ms-2 text-dark fw-bold text-decoration-none' to={`/personal/${currUserInfo?._id}/post/`} state={{ "id": currUserInfo?._id }}> {currUserInfo?.fullname}</Link>
                    </div>
                </div>


            </nav>
        </>
    );
}

export default NavBar;
