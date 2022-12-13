import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { rootReducer } from '../reducers/rootReducer'
import Game from './game/Game'
import Setup from './setup/Setup'
import Lobby from './setup/Lobby'
import WebSocketContainer from './WebSocketContainer';

const store = createStore(rootReducer)

const Container = () => {
  return (
    <Provider store={store}>
      <Router basename="/Anagramageddon">
        <Routes>
          <Route exact path="/" element={<Setup />} />
          <Route path="/game/:gameId/lobby" element={<WebSocketContainer phase={Lobby} />} />
          <Route path="/game/:gameId/play" element={<WebSocketContainer phase={Game} />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default Container