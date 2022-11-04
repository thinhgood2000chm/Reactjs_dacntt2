import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login';

import axios from '../../middlewares/axios';
import { LOGIN_URL, OAUTH2_URL, TDT_LOGO_NONE_BG_URL } from '../../middlewares/constant';
import { setCookieToken, setLocalUsername, getLocalUsername, removeLocalUsername } from '../../middlewares/common'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faUser as farUser } from '@fortawesome/free-regular-svg-icons'

import '../../css/LoginPage.css';

function LoginPage(props) {
    const [username, setUsername]= useState('');
    const password = useFormInput('');
    const [errMsg, setErrMsg] = useState(null);
    const [checkbox, setCheckbox] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.path || '/';

    // check local storage
    useEffect(() => {
        const localUser = getLocalUsername();
        if (localUser) {
            setUsername(localUser);
            setCheckbox(true);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send request
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username: username, password: password.value }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            let expires = new Date()
            expires.setTime(expires.getTime() + (60 * 60 * 4 * 1000))

            setCookieToken(response?.data?.token, expires);
            if (checkbox) {
                setLocalUsername(username);
            } else {
                removeLocalUsername();
            }
            navigate(redirectPath, { replace: true });

        } catch (err) {
            if (err.response.status === 400 || err.response.status === 401)
                setErrMsg(err.response.data.description);
            else
                setErrMsg('Đã xảy ra lỗi. Thử lại sau!');
        }
    }

    const responseSuccessGoogle = async (response) => {
        try {
            const dataResponseFromNode = await axios.post(OAUTH2_URL, { tokenId: response.tokenId })
            let expires = new Date()
            expires.setTime(expires.getTime() + (60 * 60 * 4 * 1000)) // hết hạn sau 4h 
            setCookieToken(dataResponseFromNode.data.token, expires);
            navigate(redirectPath, { replace: true });
        } catch (err) {
            if (err.response.status === 400 || err.response.status === 401)
                setErrMsg(err.response.data.description);
            else
                setErrMsg('Đã xảy ra lỗi. Thử lại sau!');
        }
    }

    const responseFailGoogle = (response) => {
        console.log(response)
    }

    return (
        <div className='login row justify-content-center mt-5'>
            <div className='col-sm-8 col-md-6 col-xl-3'>
                <div className='login-form login-border1 border rounded'>
                    <div className='login-border2 border rounded bg-light p-3'>
                        <form className='form' onSubmit={handleSubmit}>
                            <div className='logo-network text-center w-100'>
                                <img src={TDT_LOGO_NONE_BG_URL} alt='TDTU LOGO' width='128px' height='64px'></img>
                            </div>
                            <h2 className='text-center my-3 login-header'>Đăng nhập</h2>


                            <div className='form-group d-flex login-input-bar'>
                                <FontAwesomeIcon icon={farUser} className='my-auto me-2' />
                                <input type='text'
                                    name='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete='off'
                                    placeholder='Tài khoản'
                                />
                            </div>
                            <div className='form-group d-flex mt-2 mb-4 login-input-bar'>
                                <FontAwesomeIcon icon={faKey} className='my-auto me-2' />
                                <input type='password'
                                    name='password' {...password}
                                    placeholder='Mật khẩu'
                                />
                            </div>
                            <div className='text-center form-group'>
                                <button type='submit' className='login-button-submit'>ĐĂNG NHẬP</button>
                            </div>


                            <div className='form-group mt-2 me-2 d-flex justify-content-between fs-smaller'>
                                <div className='d-flex flex-row align-items-center text-secondary'>
                                    <input className='login-checkbox me-1' id='rememberCheckbox' type='checkbox' checked={checkbox} onChange={() => setCheckbox(!checkbox)} />
                                    <label htmlFor='rememberCheckbox'>Nhớ tài khoản</label>
                                </div>
                                {/* <Link to='/forgot'>Quên mật khẩu?</Link> */}
                                <div> </div>
                            </div>

                            <div className='form-group mt-4'>
                                <div className='div-class-login-gg border border-dark'>
                                    <GoogleLogin
                                        className='w-100 text-dark'
                                        clientId='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
                                        // clientId='706949691658-91aibid2urfkvl4vetckpgol4b6ina2k.apps.googleusercontent.com'
                                        buttonText='Đăng nhập với Google'
                                        onSuccess={responseSuccessGoogle}
                                        onFailure={responseFailGoogle}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </div>
                            </div>

                            <div className='form-group text-center'>
                                <div className={errMsg ? 'p-2 mt-2 bg-danger text-white rounded' : 'offscreen'} aria-live='assertive'>{errMsg}</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );



}

// example: username.value = 'hello react'; console.log(username.value); 
const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange
    }
}

export default LoginPage;
