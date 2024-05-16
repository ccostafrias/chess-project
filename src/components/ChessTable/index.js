import React, { useEffect, useState } from 'react'

export default function ChessTable() {
    const [pieceActive, setPieceActive] = useState(null)

    // const fen = "8/pp2k3/4p3/P3p3/1P4p1/N1p3Pp/3r1P1P/4K3 w - - 0 34"
    const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const fen = startFen
    const fenSplited = fen.split(" ")
    const [table] = fenSplited
    const tableSplited = table.split('/')
    const tableElements = tableSplited.map((r, i) => {
        return (
            <Row
                row={r}
                key={i}
                rowIndex={i}
                pieceActive={pieceActive}
            />
        )
    })
    const piecesElements = numberToItem(tableSplited.join('')).map((piece, i) => ({p: piece, i})).filter(piece => piece.p != '0').map(piece => {
        const {p, i} = piece
        return (
            <Piece
                key={i}
                piece={p}
                index={i}
                pieceActive={pieceActive}
                setPieceActive={setPieceActive}
            />
        )
    })

    return (
        <>
            <div className='pieces'>
                {piecesElements}
            </div>
            <div className='chess-table'>
                {tableElements}
            </div>
        </>
    )
}

function numberToItem(arr) {
    const array = Array.isArray(arr) ? arr : Array.from(arr)
    return array.reduce((acc, curr) => {
        const num = Number(curr)
        if (!num) return [...acc, curr]
        else {
            const empties = Array.from(Array(num), (_) => '0')
            return acc.concat(empties)
        }
    }, [])
}


function Row(props) {
    const {row, pieceActive, rowIndex} = props
    const rowsFull = numberToItem(row)
    
    const rowElements = rowsFull.map((c, i) => {
        return (
            <Cell
                key={i}
                piece={c}
                pieceActive={pieceActive}
                rowIndex={rowIndex}
                columnIndex={i}
            />
        )
    })
    
    return (
        <div className='row'>
            {rowElements}
        </div>
    )
}

function Cell(props) {
    const {pieceActive, rowIndex, columnIndex} = props
    const color = 'punk'
    const index = rowIndex*8 + columnIndex
    const isThisActive = pieceActive?.index === index
    const isThisFocus = isThisActive && pieceActive?.isFocus

    const styles = {
        // backgroundImage: `url("/chess-project/assets/pieces/${theme}/${piece}${side}.png")`,
        "--light-color": `var(--${color}-lc)`,
        "--dark-color": `var(--${color}-dc)`,
    }

    return (
        <div className={`cell ${isThisFocus ? 'Focus' : ''}`} style={styles} data-row={rowIndex} data-column={columnIndex}/>
    )
}

function Piece(props) {
    const {piece, index, pieceActive, setPieceActive} = props

    const cellSize = Number(getComputedStyle(document.body).getPropertyValue('--piece-width').slice(0, -2))
    const theme = 'default_02'
    const side = isCapitalize(piece) ? 'w' : 'b'

    const column = index % 8
    const row = Math.floor(index / 8)

    const distanceX = pieceActive?.moving_x - pieceActive?.start_x
    const distanceY = pieceActive?.moving_y - pieceActive?.start_y
    const transX = distanceX/cellSize*100
    const transY = distanceY/cellSize*100
    const minMax_x = Math.min(Math.max(transX, -50), 750)
    const minMax_y = Math.min(Math.max(transY, -50), 750)

    const isThisActive = pieceActive?.index === index
    const isThisMoving = isThisActive && pieceActive?.isMoving
    const isThisFocus = isThisActive && pieceActive?.isFocus

    const styles = {
        backgroundImage: `url("/chess-project/assets/pieces/${theme}/${piece.toLowerCase()}${side}.png")`,
        left: isThisMoving ? '0px' : `calc(${column}*var(--piece-width))`,
        top: isThisMoving  ? '0px' : `calc(${row}*var(--piece-width))`,
        transform: isThisMoving  ? `translate(${minMax_x}%, ${minMax_y}%)` : 'none',
        zIndex: isThisMoving ? '99' : '1'
    }
    if (isThisActive) {
        console.log(isThisFocus)
    }

    function handleMouseDown(e) {
        console.log(isThisFocus)
        const {x, y} = e.target.closest('.main-game').getBoundingClientRect()
        setPieceActive(
            {
                index, 
                start_x: x + cellSize/2, 
                start_y: y + cellSize/2, 
                moving_x: e.clientX, 
                moving_y: e.clientY, 
                isFocus: true,
                isMoving: true,
            })
    }

    function handleMouseUp(e) {
        console.log(e.target.clientX)
        // if (isThisMoving) return
        if (!isThisFocus) return

        setPieceActive(prev => ({...prev, isFocus: false}))
    }

    function handleStopMoving(e) {
        if (!isThisMoving) return
        setPieceActive(prev => ({...prev, isMoving: false}))
        // return
    }

    function handleMouseMove(e) {
        if (!isThisMoving) return
        // const distance  = e.clientX - pieceActive.start_x
        setPieceActive(prev => ({...prev, moving_x: e.clientX, moving_y: e.clientY, isMoving: true}))
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleStopMoving)
        window.addEventListener('blur', handleStopMoving)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleStopMoving)
            window.removeEventListener('blur', handleStopMoving)
        }
    }, [pieceActive])

    return (
        <div className='piece' style={styles} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}></div>
    )
}

function isCapitalize(str) {
    return str.toUpperCase() === str ? true : false
}