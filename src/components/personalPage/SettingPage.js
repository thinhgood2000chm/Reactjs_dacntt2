
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common'
import { Form } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import axios from '../../middlewares/axios';

import PasswordModal from './PasswordModal';

function SettingPage(props) {
    const { currUserInfo, setCurrUserInfo } = props;

    const [id, setId] = useState(currUserInfo?._id);
    const token = getCookieToken()

    const [loading, setLoading] = useState(false);

    const [familyName, setFamilyName] = useState(currUserInfo?.familyName)
    const [givenName, setGivenName] = useState(currUserInfo?.givenName)
    const [className, setClassName] = useState(currUserInfo?.className)
    const [username, setUsername] = useState(currUserInfo?.username)
    const [phone, setPhone] = useState(currUserInfo?.phone)
    const [gender, setGender] = useState(currUserInfo?.gender)
    const [picture, setPicture] = useState(currUserInfo?.picture)
    const [faculty, setFaculty] = useState(currUserInfo?.faculty)
    const [biography, setBiography] = useState(currUserInfo?.biography)
    const [backgroundPicture, setBackgroundPicture] = useState(currUserInfo?.backgroundPicture)
    const [birthday, setBirthday] = useState(currUserInfo?.birthday)

    const [imageChoosen, setImageChoosen] = useState(currUserInfo?.picture)
    const [backgroundImageChoosen, setBackgroundImageChoosen] = useState(currUserInfo?.backgroundPicture)

    const [message, setMessage] = useState('')
    const [checkShowMess, setCheckShowMess] = useState(false)

    // formData.append('image', picture)
    // function handleChange(e) {
    //     // console.log(e.target.value)
    //     setGender(e.target.value)
    // }
    useEffect(() => {
        setFamilyName(currUserInfo?.familyName)
        setGivenName(currUserInfo?.givenName)
        setClassName(currUserInfo?.className)
        setUsername(currUserInfo?.username)
        setPhone(currUserInfo?.phone)
        setGender(currUserInfo?.gender)
        setPicture(currUserInfo?.picture)
        setFaculty(currUserInfo?.faculty)
        setBiography(currUserInfo?.biography)
        setBackgroundPicture(currUserInfo?.backgroundPicture)
        setBirthday(currUserInfo?.birthday)
        setImageChoosen(currUserInfo?.picture)
        setBackgroundImageChoosen(currUserInfo?.backgroundPicture)
        setId(currUserInfo?._id)
    },[currUserInfo])


    function onchanePhone(e) {
        setPhone(e.target.value)
    }
    const onchangeClassName = (e) => {
        setClassName(e.target.value)
    }
    const onchangeGivenName = (e) => {
        setGivenName(e.target.value)
    }
    const onchangeFamalyName = (e) => {
        setFamilyName(e.target.value)
    }
    const onchaneGender = (e) => {
        setGender(e.target.value)
    }
    const onchaneFaculty = (e) => {
        setFaculty(e.target.value)
    }
    const onchangePicture = (e) => {
        setPicture(e.target.files[0])
        setImageChoosen(URL.createObjectURL(e.target.files[0]))
    }
    const onchangeBackgroundPicture = (e) => {
        setBackgroundPicture(e.target.files[0])
        setBackgroundImageChoosen(URL.createObjectURL(e.target.files[0]))
    }
    const onchaneBirthday = (e) => {
        setBirthday(e.target.value)
    }
    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()

        formData.append('image', picture)
        formData.append('backgroundPicture', backgroundPicture)
        if (familyName)
            formData.append('familyName', familyName)
        if (givenName)
            formData.append('givenName', givenName)
        if(biography)
            formData.append('biography', biography)
        if(className)
            formData.append('className', className)
        if(phone)
            formData.append('phone', phone)
        if(gender)
            formData.append('gender', gender)
        if(faculty)
            formData.append('faculty', faculty)
        if(birthday)
            formData.append('birthday', birthday)

        axios.put(`${BASE_URL}api/account/${id}`, formData,
            {

                headers: {
                    'Content-type': 'multipart/form-date',
                    // 'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // body:formData
                // body: JSON.stringify(yourNewData)
            }

        )
            .then(res => {
                if (res.status === 200) {
                    setCurrUserInfo(res.data)
                    setMessage('Cập nhật thông tin thành công')
                    setCheckShowMess(true)
                }
                else {
                    setMessage('Có lỗi xảy ra')
                    setCheckShowMess(true)
                }
                setLoading(false)
            })
            .catch(err => {
                setMessage('Có lỗi xảy ra')
                setCheckShowMess(true)
                console.error(err)
                setLoading(false)
            })


    }
    useEffect(() => {
        if (checkShowMess) {
            setTimeout(() => {
                setCheckShowMess(false);
            }, 3000);
        }
    }, [checkShowMess]);

    return (
        <main className='container p-0'>

            <div className='container-fluid p-0'>
                {/* <!--icon bar--> */}

                <div className='row mt-3'>
                    <div className='col-md-2'></div>
                    <div className='col-md-8'>

                        <div className='tab-pane' id='account'>
                            {/* <!--Phần setting tài khoàn public info--> */}
                            <div className='card my-box-shadow'>
                                <div className='card-header d-flex justify-content-between'>
                                    <h5 className='card-titl my-auto'>Thông tin cá nhân</h5>
                                    <div>
                                        <PasswordModal currUserInfo={currUserInfo} setMessage={setMessage} setCheckShowMess={setCheckShowMess} />
                                    </div>
                                </div>
                                <div className='card-body'>
                                    <div className='w-50'><Alert show={checkShowMess} variant='primary'>{message}</Alert></div>
                                    {/* <Form action='/changeProfile1' method='post' encType='multipart/form-data'> */}
                                    <Form onSubmit={handleSubmit}>
                                        <div className='row'>
                                            <div className='col-md-8'>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Họ</Form.Label>
                                                    <Form.Control type='text' value={familyName} onChange={onchangeFamalyName} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Tên</Form.Label>
                                                    <Form.Control type='text' value={givenName} onChange={onchangeGivenName} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Email/ Tài khoản</Form.Label>
                                                    <Form.Control type='text' value={username} disabled />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Lớp</Form.Label>
                                                    <Form.Control type='text' value={className} onChange={onchangeClassName} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Số điện thoại</Form.Label>
                                                    <Form.Control type='text' value={phone} onChange={onchanePhone} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Ngày sinh</Form.Label>
                                                    <Form.Control type='text' value={birthday} onChange={onchaneBirthday} />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Giới tính</Form.Label>
                                                    <select className='mt-1 ms-1' value={gender} onChange={onchaneGender}>
                                                        <option name='Nam'> Nam</option>
                                                        <option name='Nữ'>Nữ</option>
                                                    </select>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Khoa </Form.Label>
                                                    <select className='mt-1 ms-1' value={faculty} onChange={onchaneFaculty}>
                                                        <option name='Công nghệ thông tin'>Công nghệ thông tin</option>
                                                        <option name='Lao động công đoàn'>Lao động công đoàn</option>
                                                        <option name='Luật'>Luật</option>
                                                        <option name=' Mỹ thuật công nghiệp'>Mỹ thuật công nghiệp</option>
                                                        <option name='Điện-điện tử'>Điện-điện tử</option>
                                                        <option name='Công nghệ thông tin'>Công nghệ thông tin</option>
                                                        <option name='Quản trị kinh doanh'>Quản trị kinh doanh</option>
                                                        <option name='Tài chính ngân hàng'> Tài chính ngân hàng</option>
                                                        <option name='Lao động công đoàn'> Lao động công đoàn</option>
                                                        <option name='Môi trường và bảo hộ lao động'>  Môi trường và bảo hộ lao động</option>
                                                        <option name='Lao động công đoàn'> Lao động công đoàn</option>
                                                        <option name='Ngoại ngữ'>Ngoại ngữ</option>
                                                        <option name='Toán - thống kê'>Toán - thống kê</option>
                                                        <option name='Dược'>Dược</option>
                                                        <option name='Kế toán'>Kế toán</option>
                                                        <option name='Khoa học xã hội nhân văn'>Khoa học xã hội nhân văn</option>
                                                    </select>
                                                </Form.Group>

                                                <Form.Group>
                                                    <Form.Label className='fw-bold'>Tiểu sử</Form.Label>
                                                    <Form.Control as='textarea' value={biography} rows={3} onChange={(e) => { setBiography(e.target.value) }} />
                                                </Form.Group>

                                            </div>
                                            <div className='col-md-4'>
                                                <h4>Thay đổi ảnh đại diện </h4>
                                                <div className='text-center'>
                                                    <img alt='avatar' src={imageChoosen} width='128' height='128'></img>
                                                    <div className='mt-2'>
                                                        {/* <!-- lồng 2 button thành 1 --> */}
                                                        {/* <!--<input type='button' className=' btn btn-primary' id='my-button' value='Upload image'>className='d-none'  --> */}
                                                        <div className='w-100'>
                                                            <label htmlFor='input-avt' className='w-100'><div className='btn btn-success w-75'>Chọn hình ảnh</div></label>
                                                            <input hidden onChange={onchangePicture} id='input-avt' type='file' accept='image/*'></input>
                                                        </div>
                                                        {/* <input type='file' name='image' id='my-file' accept='.jpg, .jpeg, .png' onChange={onchangePicture} ></input> */}
                                                    </div>
                                                </div>

                                                <h4>Thay đổi ảnh bìa</h4>
                                                <div className='text-center'>
                                                    <img alt='background' src={backgroundImageChoosen} width='160' height='80'></img>
                                                    <div className='mt-2'>
                                                        {/* <!-- lồng 2 button thành 1 --> */}
                                                        {/* <!--<input type='button' className=' btn btn-primary' id='my-button' value='Upload image'>className='d-none'  --> */}
                                                        <div className='w-100'>
                                                            <label htmlFor='input-bg' className='w-100'><div className='btn btn-success w-75'>Chọn hình ảnh</div></label>
                                                            <input hidden onChange={onchangeBackgroundPicture} id='input-bg' type='file' accept='image/*'></input>
                                                        </div>
                                                        {/* <input type='file' name='image' id='my-file' accept='.jpg, .jpeg, .png' onChange={onchangeBackgroundPicture}></input> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {loading ?
                                            <div className='mt-3'><ClipLoader color={'#5239AC'} loading={loading} size={48} /></div>
                                            :
                                            <button type='Submit' className='btn btn-primary mt-2 px-3'>Cập nhật</button>
                                        }
                                    </Form>

                                </div>
                            </div>

                        </div>



                    </div>
                    <div className='col-md-2'></div>
                </div>

            </div>
        </main>
    )
}
export default SettingPage