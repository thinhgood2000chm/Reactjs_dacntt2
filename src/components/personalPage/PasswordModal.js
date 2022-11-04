import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

import { getCookieToken } from '../../middlewares/common';
import axios from '../../middlewares/axios';

function PasswordModal(props) {
    const { currUserInfo, setMessage, setCheckShowMess } = props;
    const token = getCookieToken()

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');
    const [err, setErr] = useState('');

    const [isChangePwd, setIsChangePwd] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (currUserInfo?.password)
            setIsChangePwd(true);
    }, [currUserInfo]);

    const closeModal = () => {
        setOpenModal(false);
        resetForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = checkInfo();
        if (isValid === true) {
            // send request
            if (isChangePwd) {
                // Thay đổi mật khẩu
                axios.put('api/account/password/change', { oldPassword, newPassword },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(res => {
                        setMessage('Thay đổi mật khẩu thành công');
                        setCheckShowMess(true);
                        closeModal();
                    })
                    .catch(err => {
                        setErr(err.response?.data?.description);
                    })
            } else {
                // Tạo mật khẩu cho tài khoản
                axios.put('api/account/password/create', { newPassword },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(res => {
                        setMessage('Tạo mật khẩu thành công');
                        setCheckShowMess(true);
                        setIsChangePwd(true);
                        closeModal();
                    })
                    .catch(err => {
                        setErr(err.response?.data?.description);
                    })
            }
        }
        else {
            setErr(isValid);
        }
    }

    const resetForm = () => {
        setOldPassword('');
        setNewPassword('');
        setNewPasswordAgain('');
        setErr('');
    }

    const checkInfo = () => {
        if ((isChangePwd && oldPassword.length === 0) || newPassword.length === 0 || newPasswordAgain.length === 0)
            return 'Vui lòng nhập đầy đủ thông tin!';

        if (newPassword !== newPasswordAgain)
            return 'Xác nhận mật khẩu không chính xác';
        return true;
    }

    return (
        <div>
            <button onClick={() => setOpenModal(o => !o)} type='button' className='btn btn-warning fw-bold mb-2'>
                {isChangePwd ? 'Đổi' : 'Tạo'} mật khẩu
            </button>
            <Popup
                modal
                nested
                open={openModal}
                onClose={closeModal}
            >
                <div className='form-change-password'>
                    <div className='w-100 text-end'>
                        <button onClick={() => setOpenModal(false)} className='border border-1 rounded-circle'>
                            &times;
                        </button>
                    </div>
                    <div className='text-center form-color'><h2>{isChangePwd ? 'ĐỔI' : 'TẠO'} MẬT KHẨU</h2></div>
                    <form className='form' onSubmit={handleSubmit}>
                        {isChangePwd &&
                            <>
                                <b>Mật khẩu hiện tại</b>
                                <input
                                    type='password'
                                    className='w-100 border border-warning rounded py-1 px-3 mb-2'
                                    name='oldPassword'
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}>
                                </input>
                            </>
                        }
                        {!isChangePwd &&
                            <p className='text-center'>Sau khi tạo mật khẩu có thể <i>đăng nhập bằng <b>email</b> và <b>mật khẩu</b></i></p>
                        }
                        <b>Mật khẩu {isChangePwd && 'mới'}</b>
                        <input
                            type='password'
                            className='w-100 border border-warning rounded py-1 px-3 mb-2'
                            name='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}>
                        </input>

                        <b>Xác nhận mật khẩu {isChangePwd && 'mới'}</b>
                        <input
                            type='password'
                            className='w-100 border border-warning rounded py-1 px-3 mb-2'
                            name='newPasswordAgain'
                            value={newPasswordAgain}
                            onChange={(e) => setNewPasswordAgain(e.target.value)}>
                        </input>

                        <div className='text-center mb-1'>
                            <button type='submit' className='btn btn-warning fw-bold rounded py-1 w-50'>Cập nhật</button>
                        </div>
                        {(err) && <div className='text-center text-white fw-bold w-100 bg-danger rounded py-1'>{err}</div>}
                    </form>
                </div>
            </Popup>
        </div>

    )
}

export default PasswordModal;
