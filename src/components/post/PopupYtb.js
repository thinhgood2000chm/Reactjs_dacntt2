import React, { useState } from 'react';
import Popup from 'reactjs-popup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-regular-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';


function PopupYtb(props) {
    const {setIdYtb, setPostVideo, getIdLinkYoutube} = props;
    const [addPostVideo, setAddPostVideo] = useState('');
    const [linkIsValid, setLinkIsValid] = useState(true);
    const [openYtb, setOpenYtb] = useState(false);

    const closeModalYtb = () => {
        setAddPostVideo('');
        setLinkIsValid(true);
        setOpenYtb(false);
    };

    const handleSubmitVideo = (e) => {
        e.preventDefault();
        const id = getIdLinkYoutube(addPostVideo);
        if (id) {
            setLinkIsValid(true);
            setIdYtb(id);
            setPostVideo(addPostVideo);
            setAddPostVideo('');

            setOpenYtb(false);
        } else {
            setLinkIsValid(false);
        }
    }
    return (
        <div>
            <div onClick={() => setOpenYtb(o => !o)} className='btn-upload btn-ytb'><FontAwesomeIcon icon={faYoutube} className='mx-auto w-100' /></div>
            <Popup
                modal
                nested
                open={openYtb}
                onClose={closeModalYtb}
            >
                <div className='form-upload-ytb'>
                    <div className='w-100 text-end'>
                        <button onClick={() => setOpenYtb(false)} className='border border-1 rounded-circle'>
                            &times;
                        </button>
                    </div>

                    <div className='text-center mx-auto w-100 text-danger'><h1 className='mb-0'><FontAwesomeIcon icon={faYoutube} /></h1></div>
                    <div className='text-center text-danger'><h2>YouTube</h2></div>
                    <form className='form' onSubmit={handleSubmitVideo}>
                        <input
                            type='text'
                            placeholder='Nhập đường dẫn video YouTube'
                            className='w-100 border border-danger rounded-pill py-1 px-3 mb-2'
                            name='addPostVideo'
                            value={addPostVideo}
                            onChange={(e) => setAddPostVideo(e.target.value)}>
                        </input>

                        <div className='text-center mb-1'>
                            <button type='submit' className='btn btn-danger rounded-pill py-1 w-50'>Thêm</button>
                        </div>
                        {(!linkIsValid) && <div className='text-center fw-bold w-100 bg-warning rounded-pill py-1'>Đường dẫn không hợp lệ!</div>}
                    </form>
                </div>
            </Popup>
        </div>

    )
}

export default PopupYtb;
