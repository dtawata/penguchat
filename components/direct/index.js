import styles from '@/styles/Direct.module.css';
import { Fragment, useState } from 'react';
import Chat from '@/components/Chat';
import Bar from './direct_default/Bar';
import Default from './direct_default/Default';
import Online from './direct_default/Online';
import Requests from './direct_default/Requests';
import DirectDefault from './direct_default';
import DirectChat from './direct_chat';

const Direct = (props) => {
  const { friends, friend, messages, content, requests, invites } = props;
  const { changeFriend, sendMessage, updateContent, sendFriendRequest, respondFriendRequest, respondRoomInvite, updateModal, openSidebar } = props;

  const [directView, setDirectView] = useState('all');
  const [addFriend, setAddFriend] = useState(false);

  const updateDirectView = (view) => {
    setDirectView(view);
  };

  const updateAddFriend = () => {
    setAddFriend(!addFriend);
  };

  return (
    <Fragment>
      {friend.id === 'default' ?
      <DirectDefault
      directView={directView}
      updateDirectView={updateDirectView}
      updateAddFriend={updateAddFriend}
      friends={friends}
      changeFriend={changeFriend}
      addFriend={addFriend}
      sendFriendRequest={sendFriendRequest}
      requests={requests}
      invites={invites}
      respondRoomInvite={respondRoomInvite}
      respondFriendRequest={respondFriendRequest}
      updateModal={updateModal} /> :
      <DirectChat
        friend={friend}
        openSidebar={openSidebar}
        messages={messages}
        sendMessage={sendMessage}
        content={content}
        updateContent={updateContent} /> }
    </Fragment>
  );
};

export default Direct;