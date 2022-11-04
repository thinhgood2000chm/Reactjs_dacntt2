import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import ClipLoader from 'react-spinners/ClipLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { POST_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common';
import axios from '../../middlewares/axios';

import PopupYtb from './PopupYtb';

function PostModal(props) {
    const token = getCookieToken()
    const { onCreatePost, onUpdatePost, oldPost, openModal, setOpenModal, currUserInfo } = props

    const isUpdate = oldPost ? true : false;

    const [loading, setLoading] = useState(false);

    // thông tin bài đăng: postContent, postVideo, postImages
    const [postContent, setPostContent] = useState(oldPost?.content ? oldPost.content : '');
    const [postVideo, setPostVideo] = useState(oldPost?.video ? oldPost.video : '');
    const [postImages, setPostImages] = useState();

    //-- post modal --//
    const [idYtb, setIdYtb] = useState(oldPost?.video ? getIdLinkYoutube(oldPost.video) : '');

    const closeModal = () => {
        if (!isUpdate) {
            resetForm();
        }
        setOpenModal(false);
    };

    // display a image selected from file input
    const [img, setImg] = useState(oldPost?.image ? oldPost.image[0] : '');
    const onImageChange = (e) => {
        const [file] = e.target.files;
        setPostImages(e.target.files[0]);
        setImg(URL.createObjectURL(file));
    };

    // submit form
    const handleSubmitPost = (e) => {
        e.preventDefault();
        setLoading(true);
        var formData = new FormData();
        formData.append('postContent', postContent);
        formData.append('postVideo', postVideo);
        formData.append('postImages', postImages);
        // TODO: send multiple image

        if (isUpdate) {
            // update new post
            axios.put(`${POST_URL}/${oldPost._id}`, formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(res => {
                    onUpdatePost(res.data);
                    setLoading(false);
                    setOpenModal(false);
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            // create new post
            axios.post(POST_URL, formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(res => {
                    onCreatePost(res.data);
                    resetForm();
                    setLoading(false);
                    setOpenModal(false);
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }


    // reset form
    const resetForm = () => {
        setPostContent('');
        setPostVideo('');
        setIdYtb('');
        setImg();

        //TODO: rs img
        setOpenModal(false);
    }

    return (
        <div>
            <Popup
                modal
                open={openModal}
                onClose={closeModal}
                nested
            >
                <div className='post-modal'>

                    {/* header */}
                    <div className='header d-flex justify-content-between'>
                        <div> </div>
                        <h4 className='text-center'>{isUpdate ? 'Cập nhật' : 'Tạo'} bài viết</h4>
                        <button className='close-button text-right' onClick={() => setOpenModal(false)}>
                            &times;
                        </button>
                    </div>
                    <hr className='mt-2 mb-3'></hr>

                    {/* user info */}
                    <div className='user d-flex'>
                        <div className='user-avatar mb-3'>
                            <img alt='user avatar' src={currUserInfo?.picture}></img>
                        </div>
                        <b>{currUserInfo?.fullname}</b>
                    </div>

                    {/* content */}

                    {loading ?
                        <div className='w-100 text-center mt-3'><ClipLoader color={'#5239AC'} loading={loading} size={48} /></div>
                        :
                        <div className='content mb-3'>
                            <textarea
                                rows='4'
                                className='w-100'
                                placeholder='Bạn đang nghĩ gì?'
                                name='postContent'
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}>
                            </textarea>

                            {/* Hiển thị hình ảnh/video upload */}
                            {/* TODO: hiển thị 1 lúc nhiều hình ảnh */}
                            <div className='text-center mt-2'>
                                {(img != null && img.length > 0) && <img src={img} width='75%' alt='Blog img' className='rounded'></img>}
                            </div>

                            <div className='text-center mt-2'>
                                {
                                    (idYtb.length > 0) &&
                                    <iframe title='post ytb video' src={'https://www.youtube.com/embed/' + idYtb} frameBorder='0' allowFullScreen className='rounded'></iframe>
                                }
                            </div>

                            {/* button upload img, video */}
                            <div className='d-flex justify-content-between border border-secondary rounded px-3 py-1'>
                                <div className='my-auto'>Thêm vào bài viết</div>
                                <div className='d-flex flex-row'>
                                    {/* img */}
                                    <div>
                                        <label htmlFor='input-img' className='cursor-pointer btn-upload btn-img'><FontAwesomeIcon icon='fa-solid fa-images' className='mx-auto w-100' /></label>
                                        <input hidden onChange={onImageChange} type='file' id='input-img' accept='image/*'></input>
                                    </div>
                                    {/* video youtube */}
                                    <PopupYtb setIdYtb={setIdYtb} setPostVideo={setPostVideo} getIdLinkYoutube={getIdLinkYoutube} />
                                </div>
                            </div>
                            {/* END upload img, video */}

                        </div>
                    }
                    {/* footer */}
                    <div>
                        <button onClick={handleSubmitPost} type='button' className='btn btn-primary w-100 fw-bold'>{isUpdate ? 'Cập nhật' : 'Đăng'}</button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}

const getIdLinkYoutube = (url) => {
    // use regExp to split link id
    let regExp = new RegExp(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/);
    let match = url.match(regExp);
    let id = (match && match[7].length == 11) ? match[7] : false;
    return id
}

export default PostModal;
