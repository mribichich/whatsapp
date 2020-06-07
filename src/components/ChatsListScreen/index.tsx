import React from 'react';
import ChatsList from './ChatsList';
import ChatsNavbar from './ChatsNavbar';

const ChatsListScreen: React.FC = () => (
  <div>
    <ChatsNavbar />
    <ChatsList />
  </div>
);

export default ChatsListScreen;