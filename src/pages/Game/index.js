import React, {useState} from 'react'
import ChessTable from '../../components/ChessTable'
import Player from '../../components/Player'

export default function Game() {
  const [takenPices, setTakenPieces] = useState({w: [], b: []})
  return (
    <main className='main-game'>
        <Player
            player={'Black'}
            takenPieces={takenPices.b}
        />
        <ChessTable
          playerSide={'w'}
        />
        <Player
            player={'White'}
            takenPieces={takenPices.w}
        />
    </main>
  )
}