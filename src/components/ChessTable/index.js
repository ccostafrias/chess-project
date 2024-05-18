import React, { useEffect, useState } from 'react'

export default function ChessTable() {
    const [pieceActive, setPieceActive] = useState(null)
    const [eventCell, setEventCell] = useState()
    const [marks, setMarks] = useState([])

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
                setPieceActive={setPieceActive}
                eventCell={eventCell}
                setEventCell={setEventCell}
                marks={marks}
                setMarks={setMarks}
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
                setEventCell={setEventCell}
            />
        )
    })

    function handleContextMenu(e) {
        e.preventDefault()
        return false
    }

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
    const {row, pieceActive, setPieceActive, rowIndex, eventCell, setEventCell, marks, setMarks} = props
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
    const {pieceActive, rowIndex, columnIndex, setPieceActive, eventCell, setEventCell, marks, setMarks} = props
    const color = 'punk'
    const index = rowIndex*8 + columnIndex
    const isThisActive = pieceActive?.index === index
    const thisSelectedStage = pieceActive?.selectedStage || 0
    const isThisMarked = marks?.includes(index)
    const { actualCell, eventClone, button } = eventCell || {}

    const [preHigh, setPreHigh] = useState()
    const isThisPreHigh = preHigh === index

    const styles = {
        // backgroundImage: `url("/chess-project/assets/pieces/${theme}/${piece}${side}.png")`,
        "--light-color": `var(--${color}-lc)`,
        "--dark-color": `var(--${color}-dc)`,
    }

    
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
            if (!isThisActive) return
    
            const selectedStage = thisSelectedStage + 1
            setPieceActive(prev => ({...prev, selectedStage}))
            setMarks([])
        } else if (e.button === 2) {
            setPieceActive(null)
        }
    }

    // console.log(preHigh)
    
    function handleMouseEnter(e) {
        console.log(e)

        if (!pieceActive?.isMoving) return

        setPreHigh(index)
    }

    useEffect(() => {
        if (actualCell || button === 2) {
            // console.log(actualCell, eventClone)
            actualCell.dispatchEvent(eventClone)
        }
    }, [eventCell])


    return (
        <div 
            className={`cell ${isThisPreHigh ? 'pre-high' : ''} ${isThisMarked ? 'marked' : ''} ${isThisActive && thisSelectedStage !== 0 ? 'selected' : ''}`}
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
    const {piece, index, pieceActive, setPieceActive, setEventCell} = props

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

    function handleMouseDown(e) {
        const {button} = e
        if (button !== 0 && button !== 2) return
        if (button === 0) {
            const {x, y} = e.target.closest('.main-game').getBoundingClientRect()
            setPieceActive(prev => (
                {
                    index, 
                    start_x: x + cellSize/2, 
                    start_y: y + cellSize/2, 
                    moving_x: e.clientX, 
                    moving_y: e.clientY, 
                    isFocus: true,
                    isMoving: true,
                    selectedStage: index !== prev?.index ? 0 : prev?.selectedStage
                }
            ))
        } 
        const {eventClone, actualCell} = getEvent(e, {x: e.clientX, y: e.clientY})
        setEventCell({actualCell, eventClone, button})
    }

    function handleMouseUp(e) {
        const {button} = e
        if (button !== 0 && button !== 2) return
        const {eventClone, actualCell} = getEvent(e, {x: e.clientX, y: e.clientY})
        setEventCell({actualCell, eventClone, button})

        if (!isThisFocus) return

        if (button == 0) {
            setPieceActive(prev => ({...prev, isFocus: false}))
        }
    }

    function getEvent(e, coords) {
        const {x, y} = coords
        const eventClone = new MouseEvent(e.type, e)
        const elements = document.elementsFromPoint(x, y)
        const cells = [...document.querySelectorAll('.cell')]
        const [actualCell] = cells.filter(c => elements.includes(c))

        return {actualCell, eventClone}
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

    function handleMouseEnter(e) {
        const {button} = e
        // if (!isThisMoving) return
        const {eventClone, actualCell} = getEvent(e, {x: e.clientX, y: e.clientY})
        setEventCell({actualCell, eventClone, button})
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
            className='piece' 
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