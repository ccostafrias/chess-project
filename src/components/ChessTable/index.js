import React from 'react'

export default function ChessTable() {
    const fen = "8/pp2k3/4p3/P3p3/1P4p1/N1p3Pp/3r1P1P/4K3 w - - 0 34"
    const fenSplited = fen.split(" ")
    const [table] = fenSplited
    const tableSplited = table.split('/')
    const tableElements = tableSplited.map((r, i) => {
        return (
            <Row
                row={r}
                key={i}
            />
        )
    })
    console.log(tableElements)

    return (
        <div className='chess-table'>
            {tableElements}
        </div>
    )
}


function Row(props) {
    const {row} = props
    const rowsFull = Array.from(row).reduce((acc, curr) => {
        const num = Number(curr)
        if (!num) return [...acc, curr]
        else {
            const empties = Array.from(Array(num), (_) => '0')
            return acc.concat(empties)
        }
    }, [])
    
    const rowElements = rowsFull.map((c, i) => {
        return (
            <Cell
                key={i}
                piece={c}
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
    const {piece} = props
    const theme = 'default'
    console.log(piece)
    const styles = {
        backgroundImage: `url("/chess-project/assets/pieces/default/P.png")`
    }

    return (
        <div className='cell' style={styles}>
        </div>
    )
}