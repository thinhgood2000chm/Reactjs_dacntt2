/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { BASE_URL } from '../../middlewares/constant';
import { getCookieToken } from '../../middlewares/common';
import InfiniteScroll from 'react-infinite-scroll-component';

import PostCard from '../postCard/PostCard';
import ChatBox from '../message/ChatBox';
import FriendRequestBox from '../friend/FriendRequestBox';
import PostBox from '../post/PostBox';
import { Alert } from 'react-bootstrap';
import { SocketContext } from '../../middlewares/socket';
import '../../css/alert.css';

function UserPostList(props) {
    const { userID, currUserInfo } = props;
    const token = getCookieToken();

    const [loading, setLoading] = useState(true);

    const [postInfo, setPostInfo] = useState();
    const [checkShowMess, setCheckShowMess] = useState(false);
    const [message, setMessage] = useState('');
    const [checkHaveNewComment, setCheckHaveNewComment] = useState(false);
    const [newCommentRealTime, setNewCommentRealtime] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMorePost, setHasMorePost] = useState(true);

    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on("receiveMessageNoti", (data) => {
            setMessage(data);
            setCheckShowMess(true);

        });

        socket.on('receiveMessageLike', data => {
            setMessage(data);
            setCheckShowMess(true);
        })

        socket.on('receiveMessageShare', data => {
            setMessage(data);
            setCheckShowMess(true);
        })
        socket.on('receiveCommentInfo', data => {
            setCheckHaveNewComment(true);
            setNewCommentRealtime(data);
            // for(var i = 0 ; i< postInfo?.length; i++){
            //     if(postInfo[i]?._id.toString() === data.postId){
            //         console.log( "beforre",  postInfo[i]?.dataComment)
            //         postInfo[i] = postInfo[i].toJSON()
            //         postInfo[i].dataComment = [...[data],...postInfo[i]?.dataComment]
            //     }
            //     break
            // }


        })
    }, [socket]);

    const fetchDataOnScroll = () => {
        fetch(`${BASE_URL}api/post/user/${userID}/${page}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // body: JSON.stringify(page)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            }).then(dataPost => {
                if (dataPost?.length < 5) {
                    setHasMorePost(false);
                } else {
                    setPage(page + 1);
                    setPostInfo([...postInfo, ...dataPost]);
                }

            }).catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        fetch(`${BASE_URL}api/post/user/${userID}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            // body: JSON.stringify(yourNewData)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            }).then(dataPost => {
                if (dataPost?.length < 5)
                    setHasMorePost(false)
                setPostInfo(dataPost);
                setLoading(false);

            }).catch(err => {
                console.error(err);
            })
    }, [userID])

    const onDeletePost = (idPost) => {
        setPostInfo(oldList => oldList.filter(item => item._id !== idPost));
    }

    const onCreatePost = (newPost) => {
        // *note: thêm vào đầu danh sách để hiển thị
        setPostInfo([newPost, ...postInfo]);
    }

    const onUpdatePost = (newPost) => {
        const newItems = postInfo.map(post => {
            if (newPost._id === post._id) {
                return { ...post, content: newPost.content, image: newPost.image, video: newPost.video };
            }
            return post;
        });
        setPostInfo(newItems);
    }

    useEffect(() => {
        if (checkHaveNewComment) {
            for (var i = 0; i < postInfo?.length; i++) {
                if (postInfo[i]?._id === newCommentRealTime?.postId) {
                    // postInfo[i].commentPost.pop()
                    postInfo[i].commentPost = [...[newCommentRealTime], ...postInfo[i]?.commentPost];
                    setPostInfo(postInfo);
                    break;
                }
            }
        }


    }, [checkHaveNewComment])

    useEffect(() => {

        if (checkShowMess) {
            setTimeout(() => {
                setCheckShowMess(false);
            }, 3000);
        }

    }, [checkShowMess]);

    var listPost = []
    for (let i = 0; i < postInfo?.length; i++) {
        socket.emit('joinRoom', postInfo[i]?._id)
        listPost.push(
            // <div className='mb-3 mx-2'><PostCard dataPostInfo={postInfo[i]} /></div>
            <div className='mb-3 mx-2'>
                <PostCard
                    key={postInfo[i]?._id}
                    currUserInfo={currUserInfo}
                    setMess={setMessage}
                    setCheckShowMessage={setCheckShowMess}
                    dataPostInfo={postInfo[i]}
                    onDeletePost={onDeletePost}
                    onUpdatePost={onUpdatePost}
                    checkHaveNewComment={checkHaveNewComment}
                    setCheckHaveNewComment={setCheckHaveNewComment} />
            </div>
        )
    }
    return (
        <div className='container'>
            <div className='row mt-3'>
                <div className='col-md-2'>
                    <div className='notification'><Alert show={checkShowMess} variant='primary'>{message}</Alert></div>
                </div>
                {(currUserInfo?._id !== userID) && <div className='col-md-1'></div>}

                <div className='col-md-6'>
                    {(currUserInfo?._id === userID) &&
                        (<>
                            <div className='mb-3'><PostBox onCreatePost={onCreatePost} currUserInfo={currUserInfo} /></div>
                        </>)
                    }
                    {loading ?
                        <div className='w-100 text-center mt-3'><ClipLoader color={'#5239AC'} loading={loading} size={96} /></div>
                        :
                        <InfiniteScroll
                            dataLength={postInfo?.length || 0} //This is important field to render the next data
                            next={fetchDataOnScroll}
                            hasMore={hasMorePost}
                            loader={<p className='text-info'>Đang tải...</p>}
                            endMessage={
                                <p className='text-center text-info'>
                                    <b>...Hết bài viết...</b>
                                </p>
                            }
                        >
                            {listPost}
                            {/* {postInfo && postInfo.map((item) => (
                            <div className='mb-3 mx-2'>
                                <PostCard
                                    indexId={item._id}
                                    dataPostInfo={item}
                                    onDeletePost={onDeletePost}
                                    onUpdatePost={onUpdatePost}
                                />
                            </div>
                        ))} */}
                        </InfiniteScroll>
                    }

                </div>
                {(currUserInfo?._id === userID) &&
                    <div className='col-md-4'>
                        <ChatBox currUserInfo={currUserInfo} />
                        <FriendRequestBox />
                    </div>
                }
            </div>
        </div>
    );
}

export default UserPostList;
