import React from 'react'
import pawn from '../../assets/pawn.png'

export default function Player(props) {
    const {player, pieces, timer} = props
    const piecesElements = pieces?.map((p, i) => {
        return (
            <div
                key={i}
            >

            </div>
        )
    })

    const style = {
        backgroundImage: `url(${pawn})`
    }

    return (
        <div className='player'>
            <div className='player-avatar' style={style}>

            </div>
            <div className='player-content'>
                <h2 className='player-name'>{player}</h2>
                {piecesElements}
            </div>
            {timer && (
                <div></div>
            )}
        </div>
    )
}
