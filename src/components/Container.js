import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { rootReducer } from '../reducers/rootReducer'
import Game from './game/Game'
import Header from './Header'
import Setup from './setup/Setup'
import Lobby from './setup/Lobby';

const store = createStore(rootReducer)

const Container = () => {
  return (
    <Provider store={store}>
      <div id="container">
        <Header />
        <Router basename="/Anagramageddon">
          <Routes>
            <Route exact path="/" element={<Setup />} />
            <Route path="/game/:gameId/lobby" element={<Lobby />} />
            <Route path="/game/:gameId/play" element={<Game />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  )
}

export default Container