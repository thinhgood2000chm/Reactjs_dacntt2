import React from 'react';
import PersonalInfor from './PersonalInfor'

function PersonalPage(props) {
    const { currUserInfo } = props
    return (
        <div>
          <PersonalInfor currUserInfo={currUserInfo}/>
        </div>
    );
}

export default PersonalPage;
