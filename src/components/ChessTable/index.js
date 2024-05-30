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
        {c: -1, r: 1, isAttack: true, sideNeeded: 'b'},//, condition: (props) => (notationToIndex(props.enpassant).i === (props.r+1)*8+props.c-1 && isBetween(40, notationToIndex(props.enpassant).i, 47)), isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r+1)*8+props.c-1},
        {c: 1, r: 1, isAttack: true, sideNeeded: 'b'},// condition: (props) => (notationToIndex(props.enpassant).i === (props.r+1)*8+props.c+1 && isBetween(40, notationToIndex(props.enpassant).i, 47)), isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r+1)*8+props.c+1},
        {c: -1, r: -1, isAttack: true, sideNeeded: 'w'},// condition: (props) => (notationToIndex(props.enpassant).i === (props.r-1)*8+props.c-1 && isBetween(16, notationToIndex(props.enpassant).i, 23)), isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r-1)*8+props.c-1},
        {c: 1, r: -1, isAttack: true, sideNeeded: 'w'},// condition: (props) => (notationToIndex(props.enpassant).i === (props.r-1)*8+props.c+1 && isBetween(16, notationToIndex(props.enpassant).i, 23)), isEnpassant: (props) => notationToIndex(props.enpassant).i === (props.r-1)*8+props.c+1},
    ]
}

function isBetween(less, bet, great) {
    return !!(less <= bet && bet <= great)
}

function closer(v1, v2, ref) {
    return Math.abs(v1 - ref) < Math.abs(v2 - ref) ? v1 : v2;
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

function translatedTable(array) {
    // Cria uma string concatenando os valores da chave 'p' de cada objeto
    let str = array.map(obj => obj.p).join('');
    
    // Inicializa uma variável para armazenar o resultado final
    let result = '';
    
    // Processa a string em blocos de 8 caracteres
    for (let i = 0; i < str.length; i += 8) {
        // Extrai um bloco de 8 caracteres ou menos
        let chunk = str.slice(i, i + 8);
        
        // Substitui sequências de zeros consecutivos pelo seu comprimento
        chunk = chunk.replace(/0+/g, match => match.length);
        
        // Adiciona o bloco processado ao resultado
        result += chunk + '/';
    }
    
    // Remove a barra final desnecessária
    if (result.endsWith('/')) {
        result = result.slice(0, -1);
    }
    
    return result;
}

export default function ChessTable(props) {
    const {playerSide} = props
    const [pieceActive, setPieceActive] = useState(null)
    const [eventCell, setEventCell] = useState()
    const [marks, setMarks] = useState([])
    const [preHigh, setPreHigh] = useState()


    const fenPassant = "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1"
    const fenEndGame = "8/pp2k3/4p3/P7/1PN2Pp1/2p3Pp/3r3P/4K3 w - f3 0 35"
    const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const fenEx = fenEndGame

    const { actualCell, eventClone, button } = eventCell || {}
    const { piece, side, column, row } = pieceActive || {}
    
    const [fen, setFen] = useState(fenEx)
    const [tableData, setTableData] = useState(getTableFromFen(fenEx))

    const {table, turn, castles, enpassant, halfTurns, fullTurns} = tableData
    const pieces = table.filter(piece => piece.p != '0')

    function getTableFromFen(fen) {
        const fenSplited = fen.split(" ")
        const [tableNotation, turn, castles, enpassant, halfTurns, fullTurns] = fenSplited
        const tableSplited = tableNotation.split('/')
        const table = numberToItem(tableSplited.join('')).map((piece, i) => ({p: piece, i, ...(piece != 0) ? {side: isCapitalize(piece) ? 'w' : 'b'} : null}))
        return {table, turn, castles, enpassant, halfTurns, fullTurns}
    }

    function allMoves(arr, piece, table) {
        const reduce = arr.reduce((prev, curr) => {
            const validMoves = (target, actual, table, moves = []) => {
                const {c, r, isLoop, isAttack, sideNeeded, condition} = target
                const {column, row, side, piece} = actual
                const {castles, enpassant} = table

                if (sideNeeded && sideNeeded !== side) return moves

                if (column + c < 0 || column + c > 7) return moves
                if (row + r < 0 || row + r > 7) return moves

                const i = (row+r)*8+(column+c)
                const pieceTarget = pieces.find(p => p.i === i)
                const rightCondition = condition && condition({c: column, r: row, pieceTarget, pieces, castles, enpassant})

                if (condition && !rightCondition) return moves

                // if () return moves
                if (pieceTarget && !isAttack) return moves

                const isSameSide = pieceTarget?.side === side
                const thisPiece = pieces.find(p => p.i === row*8+column)
                const isPawn = thisPiece?.p.toLowerCase() === 'p'
                const increment = [...moves, {piece, i, side, type: pieceTarget && isAttack ? 'attack' : 'move', isSameSide, canAttack: isAttack, ...(isPawn && isAttack && !pieceTarget) && {noTarget: true}}]
                
                if (isLoop && !pieceTarget) return validMoves(target, {piece, column: column + c, row: row + r, side}, table, increment)
                return increment
            }

            const moves = validMoves(curr, piece, table)
            return [...prev, ...moves]

        }, [])

        return reduce
    }

    function movemmentPiece(move, index) {
        setTableData(prev => {
            const {table} = prev
            const fixed = table.map(p => {
                if (p.i === index) return {...p, p: pieceActive.piece, side: pieceActive.side, isPrev: true}
                if (p.i === pieceActive.index) {
                    const {side, ...rest} = p
                    return {...rest, p: '0', isPrev: true}
                }
                const {isPrev, ...rest} = p
                return {...rest}
            })
            return {...prev, table: fixed}
        })
        if (move === 'move') {
        } else if (move === 'attack') {
        }
    }
    
    const allAttackMoves = pieces?.reduce((prev, curr) => {
        const {p, i, side} = curr
        const column = i % 8
        const row = Math.floor(i / 8)
        const moves = allMoves(movements[p.toLowerCase()], {piece: p, column, row, side}, {castles, enpassant}).filter(p => p.canAttack)

        return [...prev, ...moves]
    }, []).reduce((prev, curr) => {
        const hasCopy = prev.find(p => p.i === curr.i && p.side === curr.side)
        if (hasCopy) return prev
        const {noTarget, type, canAttack, ...rest} = curr
        return [...prev, rest]
    }, [])

    const enemyMoves = pieceActive ? allAttackMoves.filter(attk => attk.side !== pieceActive.side) : []

    const attackMoves = pieceActive 
        ? allMoves(movements[piece.toLowerCase()], {column, row, side, piece}, {castles, enpassant})
            .filter(p => {
                console.log(p.side, turn, playerSide)
                if (!(turn === playerSide && p.side === playerSide)) return false
                if (p.isSameSide) return false
                const isInCheck = p.piece.toLowerCase() === 'k' && enemyMoves.some(m => m.i === p.i)
                if (isInCheck) return false
                return true
            })
        : []

    const tableNotation = translatedTable(table)
    const tableElements = tableNotation.split('/').map((r, i) => {
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
                tableData={tableData}
                setTableData={setTableData}
                movemmentPiece={movemmentPiece}
                allAttackMoves={allAttackMoves}
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
                attackMoves={attackMoves}
                movemmentPiece={movemmentPiece}
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

    const columnCoords = [1, 2, 3, 4, 5, 6, 7, 8].map(c => {
        return (
            <div className='coord column'>
                <span>{c}</span>
            </div>
        )
    })

    const rowCoords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(r => {
        return (
            <div className='coord row'>
                <span>{r}</span>
            </div>
        )
    })
    
    return (
        <div className="table" onContextMenu={handleContextMenu}>
            <div className='coords'>
                <div className='column-coords'>
                    {columnCoords}
                </div>
                <div className='row-coords'>
                    {rowCoords}
                </div>
            </div>
            <div className='pieces'>
                {piecesElements}
            </div>
            <div className='chess-table'>
                {tableElements}
            </div>
        </div>
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
        tableData,
        setTableData,
        movemmentPiece,
        allAttackMoves,
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
                tableData={tableData}
                setTableData={setTableData}
                movemmentPiece={movemmentPiece}
                allAttackMoves={allAttackMoves}
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
        marks, 
        setMarks,
        preHigh,
        setPreHigh,
        pieces,
        attackMoves,
        tableData,
        setTableData,
        movemmentPiece,
        allAttackMoves,
    } = props

    const index = rowIndex*8 + columnIndex
    const isThisActive = pieceActive?.index === index
    const thisSelectedStage = pieceActive?.selectedStage
    const isThisMarked = marks?.includes(index)
    const isThisPreHigh = preHigh === index
    
    const color = 'punk'
    const styles = {
        // backgroundImage: `url("/chess-project/assets/pieces/${theme}/${piece}${side}.png")`,
        "--light-color": `var(--${color}-lc)`,
        "--dark-color": `var(--${color}-dc)`,
    }

    const thisMove = attackMoves.find(attk => attk.i === index)
    const {type, noTarget} = thisMove || {}
    const isThisMovement = type && !noTarget

    const showAllAttacks = allAttackMoves.find(p => p.i === index) && false
    
    function handleMouseUp(e) {
        if (e.button === 0) {
            setPreHigh()

            if (!isThisActive) {
                if (isThisMovement) {
                    movemmentPiece(type, index)

                    setPieceActive(null)
                    return
                }
                return
            }

            if (thisSelectedStage >= 2) {
                setPieceActive(null)
                return
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
                if (isThisMovement) {
                    movemmentPiece(type, index)
                }
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
        console.log('opa')
        const isMoving = pieceActive?.isMoving
        if (!isMoving) return
        setPreHigh(index)
    }

    return (
        <div 
            className={`cell ${showAllAttacks ? 'marked' : ''} ${isThisMovement && type} ${isThisPreHigh ? 'pre-high' : ''} ${isThisMarked ? 'marked' : ''} ${(isThisActive && thisSelectedStage !== 0) || tableData.table.find(p => p.i === index).isPrev ? 'selected' : ''}`}
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
        attackMoves,
        movemmentPiece
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
            const move = attackMoves.find(p => p.i === index)?.type
            if (move === 'attack') {
                movemmentPiece(move, index)
                setPieceActive(null)
                setPreHigh()
                return
            }
            const {x, y} = e.target.closest('.table').getBoundingClientRect()
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

    function handleMouseUp(e) {
        console.log('opa')
        if (!pieceActive) return
        const move = attackMoves.find(p => p.i === index)?.type
        if (move === 'attack') {
            movemmentPiece(move, index)
            setPieceActive(null)
            setPreHigh()
        }
        return
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
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
        />
    )
}

function isCapitalize(str) {
    return str.toUpperCase() === str ? true : false
}