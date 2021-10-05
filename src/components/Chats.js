import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Chats = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  console.log(user);

  //function to handle logout 
  const handleLogout = async () => {
    await auth.signOut();
    //redirect page to login 
    history.push('/');
  };

  //function to upload and get picture form computer
  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], 'userPhoto.jpg', { type: 'image/jpeg' });
  };

  useEffect(() => {
    //redirect user to login page if not login
    if (!user) {
      history.push('/');
      return;
    }
    axios
      //connect the system into chatengine API
      .get('https://api.chatengine.io/users/me', {
        headers: {
          'project-id': 'Your-Project-ID',
          'user-name': user.email,
          'user-secret': user.uid,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        //fetch all new data or new user registered
        let formData = new FormData();
        formData.append('email', user.email);
        formData.append('username', user.email);
        formData.append('secret', user.uid);

        getFile(user.photoURL).then((avatar) => {
          formData.append('avatar', avatar, avatar.name);
          axios
            .post('https://api.chatengine.io/users/', formData, {
              headers: {
                'private-key': 'Your-Project-Secret-Key',
              },
            })
            .then(() => setLoading(false))
            .catch((error) => console.log(error));
        });
      });
  }, [user, history]);

  //once user login their google account
  if (!user || loading) return 'Please wait... ';



  return (
    <div className="chat-page">
      <div className="nav-bar">
        <div className="logo-tab">Chat Messenger</div>
        <div className="logout-tab" onClick={handleLogout}>
          Logout
        </div>
      </div>
      <ChatEngine
        height="calc(100vh - 66px)"
        projectID="Your-Project-ID"
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;