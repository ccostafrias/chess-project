import React from 'react'
import ChessTable from '../../components/ChessTable'
import Player from '../../components/Player'

export default function Game() {
  return (
    <main className='main-game'>
        <Player
            player={'Black'}
        />
        <ChessTable/>
        <Player
            player={'White'}
        />
    </main>
  )
}