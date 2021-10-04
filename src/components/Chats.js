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

  const handleLogout = async () => {
    await auth.signOut();

    history.push('/');
  };

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], 'userPhoto.jpg', { type: 'image/jpeg' });
  };

  useEffect(() => {
    if (!user) {
      history.push('/');
      return;
    }
    axios
      .get('https://api.chatengine.io/users/me', {
        headers: {
          'project-id': 'your project-id',
          'user-name': user.email,
          'user-secret': user.uid,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        let formData = new FormData();
        formData.append('email', user.email);
        formData.append('username', user.email);
        formData.append('secret', user.uid);

        getFile(user.photoURL).then((avatar) => {
          formData.append('avatar', avatar, avatar.name);
          axios
            .post('https://api.chatengine.io/users/', formData, {
              headers: {
                'private-key': 'your-private-key',
              },
            })
            .then(() => setLoading(false))
            .catch((error) => console.log(error));
        });
      });
  }, [user, history]);
  if (!user || loading) return 'Loading... ';
  return (
    <div className="chat-page">
      <div className="nav-bar">
        <div className="logo-tab">Unichat</div>
        <div className="logout-tab" onClick={handleLogout}>
          Logout
        </div>
      </div>
      <ChatEngine
        height="calc(100vh - 66px)"
        projectID="your-project-id"
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;