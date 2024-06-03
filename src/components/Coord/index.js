import React from 'react'

export default function Coord({coord, c}) {
    return (
        <div className={`coord ${coord}`}>
            <span>{c}</span>
        </div>
    )
}
