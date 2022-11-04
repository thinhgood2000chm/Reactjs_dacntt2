import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";

import LoginPage from './components/loginPage/LoginPage';
import HomePage from './components/homePage/HomePage';
import PersonalPage from './components/personalPage/PersonalPage';
import ErrorPage from './components/ErrorPage';
import SettingPage from './components/personalPage/SettingPage';
import FindFriend from './components/friend/FindFriend';
import PublicRoute from './middlewares/PublicRoute';
import PrivateRoute from './middlewares/PrivateRoute';
import ChatPage from './components/chatPage/ChatPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

// import io from "socket.io-client";

// const socket = io.connect(BASE_URL);
import { SocketContext, socket } from './middlewares/socket';

function App() {
  const [currUserInfo, setCurrUserInfo] = useState()

  // useEffect(() => {
  //   console.log("Current user information", currUserInfo)
  // }, [currUserInfo])

  // const socketio = useContext(SocketContext);

  // useEffect(() => {
  //   if (userId) {
  //     socketio.emit("newUser", userId);
  //   }
  // socketio.on("receiveMessageNoti", (data) => {
  //   setSocketData(data)
  //   setNumberNotiRealTime(numberNotiRealTime+1)
  // });

  // socketio.on('receiveMessageLike', data=>{
  //   setSocketData(data)
  //   setNumberNotiRealTime(numberNotiRealTime+1)
  // })

  // socketio.on('receiveMessageShare', data=>{
  //   setSocketData(data)
  //   setNumberNotiRealTime(numberNotiRealTime+1)
  // })

  // }, [socketio, userId, numberNotiRealTime]);

  useEffect(() => {
    // socketRef.current = socketIOClient.connect(host)
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <div className='App'>
        <Helmet>
          <meta charSet='utf-8' />
          <title>MXH TDTU</title>
        </Helmet>
        <BrowserRouter>
          <Fragment>
            <div>
              <div className='content'>
                <Routes>

                  <Route element={<PublicRoute />}>
                    <Route path='/login' element={<LoginPage setCurrUserInfo={setCurrUserInfo} />} />
                  </Route>

                  <Route element={<PrivateRoute currUserInfo={currUserInfo} setCurrUserInfo={setCurrUserInfo} />}>
                    <Route path='/' element={<HomePage currUserInfo={currUserInfo} />} />
                    <Route path='/personal/:id/*' element={<PersonalPage currUserInfo={currUserInfo} />}></Route>
                    <Route path='/account/setting' element={<SettingPage currUserInfo={currUserInfo} setCurrUserInfo={setCurrUserInfo}/>}> </Route>
                    <Route path='/search/' element={<FindFriend />}> </Route>
                    <Route path='/chat' element={<ChatPage currUserInfo={currUserInfo} />}> </Route>
                  </Route>

                  <Route path='*' element={<ErrorPage />} />
                </Routes>
              </div>
            </div>
          </Fragment>
        </BrowserRouter>

      </div>
    </SocketContext.Provider>
  );
}

export default App;
