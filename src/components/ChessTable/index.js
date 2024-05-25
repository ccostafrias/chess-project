import React, { useEffect, useState } from 'react'

const movements = {
    n: [
        {c: -2, r: -1, isAttack: true},
        {c: -1, r: -2, isAttack: true},
        {c: 2, r: -1, isAttack: true},
        {c: 1, r: -2, isAttack: true},
        {c: -2, r: 1, isAttack: true},
        {c: -1, r: 2, isAttack: true},
        {c: 2, r: 1, isAttack: true},
        {c: 1, r: 2, isAttack: true},
    ],
    k: [
        {c: -1, r: -1, isAttack: true},
        {c: 0, r: -1, isAttack: true},
        {c: 1, r: -1, isAttack: true},
        {c: -1, r: 0, isAttack: true},
        {c: 1, r: 0, isAttack: true},
        {c: -1, r: 1, isAttack: true},
        {c: 0, r: 1, isAttack: true},
        {c: 1, r: 1, isAttack: true},
        {c: 2, r: 0, isAttack: true, sideNeeded: 'w', condition: (props) => props.castles.includes('K'), castle: 'K'},
        {c: -2, r: 0, isAttack: true, sideNeeded: 'w', condition: (props) => props.castles.includes('Q'), castle: 'Q'},
        {c: 2, r: 0, isAttack: true, sideNeeded: 'b', condition: (props) => props.castles.includes('k'), castle: 'k'},
        {c: -2, r: 0, isAttack: true, sideNeeded: 'b', condition: (props) => props.castles.includes('q'), castle: 'q'},

    ],
    r: [
        {c: 0, r: -1, isLoop: true, isAttack: true},
        {c: 0, r: 1, isLoop: true, isAttack: true},
        {c: 1, r: 0, isLoop: true, isAttack: true},
        {c: -1, r: 0, isLoop: true, isAttack: true},
    ],
    b: [
        {c: -1, r: -1, isLoop: true, isAttack: true},
        {c: 1, r: -1, isLoop: true, isAttack: true},
        {c: -1, r: 1, isLoop: true, isAttack: true},
        {c: 1, r: 1, isLoop: true, isAttack: true},
    ],
    q: [
        {c: -1, r: -1, isLoop: true, isAttack: true},
        {c: 1, r: -1, isLoop: true, isAttack: true},
        {c: -1, r: 1, isLoop: true, isAttack: true},
        {c: 1, r: 1, isLoop: true, isAttack: true},
        {c: 0, r: -1, isLoop: true, isAttack: true},
        {c: -1, r: 0, isLoop: true, isAttack: true},
        {c: 1, r: 0, isLoop: true, isAttack: true},
        {c: 0, r: 1, isLoop: true, isAttack: true},
    ],
    p: [
        {c: 0, r: 1, isAttack: false, sideNeeded: 'b'},
        {c: 0, r: 2, isAttack: false, sideNeeded: 'b', condition: (props) => props.r === 1 && !props.pieces.find(p => p.i === (props.r+1)*8+props.c)},
        {c: 0, r: -1, isAttack: false, sideNeeded: 'w'},
        {c: 0, r: -2, isAttack: false, sideNeeded: 'w', condition: (props) => props.r === 6 && !props.pieces.find(p => p.i === (props.r-1)*8+props.c)},
        {c: -1, r: 1, isAttack: true, sideNeeded: 'b', condition: (props) => !!props.pieceTarget || notationToIndex(props.enpassant).i === (props.r+1)*8+props.c-1, isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r+1)*8+props.c-1},
        {c: 1, r: 1, isAttack: true, sideNeeded: 'b', condition: (props) => !!props.pieceTarget || notationToIndex(props.enpassant).i === (props.r+1)*8+props.c+1, isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r+1)*8+props.c+1},
        {c: -1, r: -1, isAttack: true, sideNeeded: 'w', condition: (props) => !!props.pieceTarget || notationToIndex(props.enpassant).i === (props.r-1)*8+props.c-1, isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r-1)*8+props.c-1},
        {c: 1, r: -1, isAttack: true, sideNeeded: 'w', condition: (props) => !!props.pieceTarget || notationToIndex(props.enpassant).i === (props.r-1)*8+props.c+1, isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r-1)*8+props.c+1},
    ]
}

function notationToIndex(notation) {
    if (notation === '-') return {}
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const [first, second] = notation.split('')
    const c = letters.indexOf(first)
    const r = 8-Number(second)
    const i = r*8+c
    return {r, c, i}
}

export default function ChessTable() {
    const [pieceActive, setPieceActive] = useState(null)
    const [eventCell, setEventCell] = useState()
    const [marks, setMarks] = useState([])
    const [preHigh, setPreHigh] = useState()


    const fenEx = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1"
    // const fenEx = "8/pp2k3/4p3/P7/1PN2Pp1/2p3Pp/3r3P/4K3 b - f3 0 35"
    const startFen = "r1bqkbnr/pppppppp/8/3Pp3/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const fen = fenEx
    const fenSplited = fen.split(" ")
    const [table, turn, castles, enpassant, halfTurns, fullTurns] = fenSplited
    const tableSplited = table.split('/')

    const { actualCell, eventClone, button } = eventCell || {}
    const { piece, side, column, row } = pieceActive || {}
        
    const pieces = numberToItem(tableSplited.join('')).map((piece, i) => ({p: piece, i, side: isCapitalize(piece) ? 'w' : 'b'})).filter(piece => piece.p != '0')

    console.log(pieces)

    function allMoves(arr, piece, table) {
        const reduce = arr.reduce((prev, curr) => {
            const validMoves = (target, actual, table, moves = []) => {
                const {c, r, isLoop, isAttack, sideNeeded, condition} = target
                const {column, row, side} = actual
                const {castles, enpassant} = table

                if (sideNeeded && sideNeeded !== side) return moves

                if (column + c < 0 || column + c > 7) return moves
                if (row + r < 0 || row + r > 7) return moves

                const i = (row+r)*8+(column+c)
                const pieceTarget = pieces.find(p => p.i === i)
                const rightCondition = condition && condition({c: column, r: row, pieceTarget, pieces, castles, enpassant})
                console.log(notationToIndex(enpassant).i === (row-1)*8+column-1)

                if (condition && !rightCondition) return moves

                if (pieceTarget?.side === side) return moves
                if (pieceTarget && !isAttack) return moves

                const increment = [...moves, {i, type: pieceTarget && isAttack ? 'attack' : 'move'}]
                
                if (isLoop && !pieceTarget) return validMoves(target, {column: column + c, row: row + r, side}, table, increment)
                return increment
            }

            const moves = validMoves(curr, piece, table)
            // console.log(moves, prev, curr)
            return [...prev, ...moves]

        }, [])

        return reduce
    }

    const attackMoves = pieceActive ? allMoves(movements[piece.toLowerCase()], {column, row, side, castles}, {castles, enpassant}): []

    const tableElements = tableSplited.map((r, i) => {
        return (
            <Row
                row={r}
                key={i}
                rowIndex={i}
                pieceActive={pieceActive}
                setPieceActive={setPieceActive}
                eventCell={eventCell}
                setEventCell={setEventCell}
                marks={marks}
                setMarks={setMarks}
                preHigh={preHigh}
                setPreHigh={setPreHigh}
                pieces={pieces}
                attackMoves={attackMoves}
            />
        )
    })

    const piecesElements = pieces.map(piece => {
        const {p, i} = piece
        return (
            <Piece
                key={i}
                piece={p}
                index={i}
                pieceActive={pieceActive}
                setPieceActive={setPieceActive}
                setEventCell={setEventCell}
                setPreHigh={setPreHigh}
            />
        )
    })

    function handleContextMenu(e) {
        e.preventDefault()
        return false
    }

    useEffect(() => {
        if (actualCell || button === 2) {
            actualCell.dispatchEvent(eventClone)
        }
    }, [eventCell])

    return (
        <main className="main-game" onContextMenu={handleContextMenu}>
            <div className='pieces'>
                {piecesElements}
            </div>
            <div className='chess-table'>
                {tableElements}
            </div>
        </main>
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
    const {
        row, 
        pieceActive, 
        setPieceActive,
        rowIndex, 
        eventCell, 
        setEventCell, 
        marks, 
        setMarks,
        preHigh,
        setPreHigh,
        pieces,
        attackMoves,
    } = props
    const rowsFull = numberToItem(row)
    
    const rowElements = rowsFull.map((c, i) => {
        return (
            <Cell
                key={i}
                piece={c}
                pieceActive={pieceActive}
                setPieceActive={setPieceActive}
                rowIndex={rowIndex}
                columnIndex={i}
                eventCell={eventCell}
                setEventCell={setEventCell}
                marks={marks}
                setMarks={setMarks}
                preHigh={preHigh}
                setPreHigh={setPreHigh}
                pieces={pieces}
                attackMoves={attackMoves}
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
    const {
        pieceActive, 
        rowIndex, 
        columnIndex, 
        setPieceActive,
        eventCell, 
        setEventCell, 
        marks, 
        setMarks,
        preHigh,
        setPreHigh,
        pieces,
        attackMoves,
    } = props

    const color = 'punk'
    const index = rowIndex*8 + columnIndex
    const isThisActive = pieceActive?.index === index
    const thisSelectedStage = pieceActive?.selectedStage || 0
    const isThisMarked = marks?.includes(index)
    const isThisPreHigh = preHigh === index

    const styles = {
        // backgroundImage: `url("/chess-project/assets/pieces/${theme}/${piece}${side}.png")`,
        "--light-color": `var(--${color}-lc)`,
        "--dark-color": `var(--${color}-dc)`,
    }

    const isThisMovement = attackMoves.find(attk => attk.i === index)?.type
    
    function handleMouseUp(e) {
        if (e.button === 0) {
            if (!isThisActive) return
            
            if (thisSelectedStage >= 2) {
                setPieceActive(null)
            }
        } else if (e.button === 2) {
            if (isThisMarked) {
                setMarks(prev => ([...prev.filter(i => i !== index)]))

            } else {
                setMarks(prev => ([...prev, index]))
            }
        }
    }

    function handleMouseDown(e) {
        if (e.button === 0) {
            if (!isThisActive) {
                setPieceActive(null)
                setMarks([])
            } else {
                const selectedStage = thisSelectedStage + 1
                setPieceActive(prev => ({...prev, selectedStage}))
                setMarks([])
            }
        } else if (e.button === 2) {
            setPieceActive(null)
        }
    }
    
    function handleMouseEnter(e) {
        const isMoving = pieceActive?.isMoving
        if (!isMoving) return

        setPreHigh(index)
    }

    return (
        <div 
            className={`cell ${isThisMovement || ''} ${isThisPreHigh ? 'pre-high' : ''} ${isThisMarked ? 'marked' : ''} ${isThisActive && thisSelectedStage !== 0 ? 'selected' : ''}`}
            style={styles} 
            data-row={rowIndex} 
            data-column={columnIndex}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
        />
    )
}

function Piece(props) {
    const {
        piece, 
        index, 
        pieceActive, 
        setPieceActive, 
        setEventCell,
        setPreHigh,

    } = props

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

    const styles = {
        backgroundImage: `url("/chess-project/assets/pieces/${theme}/${piece.toLowerCase()}${side}.png")`,
        left: isThisMoving ? '0px' : `calc(${column}*var(--piece-width))`,
        top: isThisMoving  ? '0px' : `calc(${row}*var(--piece-width))`,
        transform: isThisMoving  ? `translate(${minMax_x}%, ${minMax_y}%)` : 'none',
        zIndex: isThisMoving ? '99' : '1'
    }

    function handleMouseDown(e) {
        const {button} = e
        if (button !== 0 && button !== 2) return
        if (button === 0) {
            const {x, y} = e.target.closest('.main-game').getBoundingClientRect()
            setPieceActive(prev => (
                {
                    piece,
                    side,
                    column,
                    row,
                    index, 
                    start_x: x + cellSize/2, 
                    start_y: y + cellSize/2, 
                    moving_x: e.clientX, 
                    moving_y: e.clientY, 
                    isMoving: true,
                    selectedStage: index !== prev?.index ? 0 : prev?.selectedStage
                }
            ))
        } 
        const {eventClone, actualCell} = getEvent(e, {x: e.clientX, y: e.clientY})
        setEventCell({actualCell, eventClone, button})
    }
    
    function handleStopMoving(e) {
        if (!isThisMoving) return
        setPieceActive(prev => ({...prev, isMoving: false}))
        setPreHigh()
    }

    function handleMouseMove(e) {
        if (!isThisMoving) return
        setPieceActive(prev => ({...prev, moving_x: e.clientX, moving_y: e.clientY, isMoving: true}))
    }

    function handleMouseEnter(e) {
        const isMoving = pieceActive?.isMoving
        if (!isMoving) return
        
        setPreHigh(index)
    }

    function getEvent(e, coords) {
        const {x, y} = coords
        const eventClone = new MouseEvent(e.type, e)
        const elements = document.elementsFromPoint(x, y)
        const cells = [...document.querySelectorAll('.cell')]
        const [actualCell] = cells.filter(c => elements.includes(c))

        return {actualCell, eventClone}
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
        <div 
            className={`piece ${isThisMoving ? 'moving' : ''}`} 
            style={styles} 
            onMouseDown={handleMouseDown} 
            // onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
        />
    )
}

function isCapitalize(str) {
    return str.toUpperCase() === str ? true : false
}