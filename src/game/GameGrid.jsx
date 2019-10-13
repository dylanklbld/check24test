import {makeStep, startGame} from '../utils/gameModule'

import PropTypes from 'prop-types'
import React from 'react'
import {getDummyMapObject,} from '../utils/mapGenerator'

const GridCell = ({onClick, cellColor, text, cellCoordinates, cellWeight, cellDistance, visited}) => {
   // const [cellColor, setCellColor] = React.useState(color)

    const getStyle = () => {
        const outline = {
            border: '1px solid black',
            outlineStyle: 'solid',
            outlineColor: 'red',        
        }

        return !visited ? {background: cellColor} : {
            ...outline,
            background: `repeating-linear-gradient(
                45deg,
                ${cellColor},
                ${cellColor} 3px,
                #465298 3px,
                #465298 6px
              )`
        }
    }     

    return <td className='cell'>
        <div className="content" onClick={onClick} style={getStyle()}>{text}</div>
    </td>
}

const GridRow = ({onCellClick, rowArray}) => {
    return <tr className='row'>
        {rowArray.map((val)=>{
            const {coordinates, color, _id, visited, start} = val

           return  <GridCell 
                onClick={()=>{onCellClick(coordinates)}} 
                key={`-${coordinates.y}-${coordinates.x}`} 
                cellCoordinates={coordinates} 
                text={_id + (start ? "_start_" : '')} 
                cellColor={color}
                visited={visited}
            />})
        }
    </tr>
}

export const GameGrid = ({colors, size}) => {
    const [gameStarted, setGameStarted] = React.useState(false)
    const [gameMap, setGameMap] = React.useState(getDummyMapObject(size, size, colors))

    React.useEffect(()=>{
        console.log('GAME STARTED')
    },[gameStarted])

    const handleCellClick = (coordinates) => {
       if(!gameStarted){

        const gameMapStarted = startGame(coordinates, gameMap)
        //const gameMapStarted1 = visitNeighbors(coordinates, gameMapStarted)
        
        setGameMap(gameMapStarted)
       }
    }
    
    const createRows = () => {
        const rows = gameMap.map((val, rowNumber) => <GridRow onCellClick={handleCellClick} key={`-${rowNumber}`} rowArray={val} />)
    
        return rows
    }

    const handleMakeStep = () => {
        const newMap = makeStep(0, gameMap)
        setGameMap(newMap)
    }
    
    return <React.Fragment>
    <button type="button" onClick={()=>{
        setGameStarted(true)
        
        if(gameStarted){
            handleMakeStep()
        }
    }}>{gameStarted ? "Make step" : "Start"}</button>
    <table>
        <tbody>
            {createRows()}
        </tbody>
    </table>
    </React.Fragment>

}

GameGrid.propTypes = {
    color: PropTypes.string
}
