import React from 'react'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import thunk from 'redux-thunk'

import { rootReducer } from '../reducers/rootReducer'
import Game from './game/Game'
import Setup from './setup/Setup'
import Lobby from './setup/Lobby'
import WebSocketContainer from './WebSocketContainer';
import Home from './setup/Home';
import Help from './setup/Help';
import EndGame from './EndGame';

const store = createStore(rootReducer, applyMiddleware(thunk))

// Wrapper that adds key={gameId} to force remount when navigating between games
const WebSocketContainerWithKey = ({phase}) => {
  const {gameId} = useParams()
  return <WebSocketContainer key={gameId} phase={phase} />
}

const Container = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/setup" element={<Setup />} />
          <Route exact path="/help" element={<Help />} />
          <Route exact path="/end" element={<EndGame />} />
          <Route path="/:gameId/lobby" element={<WebSocketContainerWithKey phase={Lobby} />} />
          <Route path="/:gameId/play" element={<WebSocketContainerWithKey phase={Game} />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default Container