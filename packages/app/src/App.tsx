import React from 'react';
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import AnimatedSwitch from './components/AnimatedSwitch';
import ChatRoomScreen from './components/ChatRoomScreen';
import ChatsListScreen from './components/ChatsListScreen';
import { useCacheService } from './services/cache.service';

function App() {
  useCacheService();

  return (
    <BrowserRouter>
      <AnimatedSwitch>
        <Route exact path="/chats" component={ChatsListScreen} />

        <Route
          exact
          path="/chats/:chatId"
          component={({
            match,
            history,
          }: RouteComponentProps<{ chatId: string }>) => (
            <ChatRoomScreen chatId={match.params.chatId} history={history} />
          )}
        />
      </AnimatedSwitch>

      <Route exact path="/" render={redirectToChats} />
    </BrowserRouter>
  );
}

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
