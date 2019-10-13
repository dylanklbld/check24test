const getCell = (coordinates, map) => {
    const {x, y} = coordinates
    return map.flat().find(value => value.coordinates.x === x && value.coordinates.y === y)
}

export const startGame = (coordinates, gameMap) => {
    const {x, y} = coordinates
    const newMap = Object.assign([], gameMap)
    
    const prevStartCell = newMap.flat().find(el=>el.start)
    
    if(prevStartCell) {
        prevStartCell.start = false
    }
    
    const startCell = newMap.flat().find(value => value.coordinates.x === x && value.coordinates.y === y)
    
    startCell.start = startCell.visited = true

    return newMap
}

export const getCurrentCellNeighbors = (coordinates, gameMap) => {
    const newMap = Object.assign([], gameMap)
    const cell = getCell(coordinates, newMap) 
    const neighborCells = Object.values(cell.neighborCoordinates()).filter((entry) =>Boolean(entry))

    return neighborCells.map(nCoords => getCell(nCoords, newMap))
}

export const getCurrentCellClusterNeighbors = (map) => {
    const cellCluster = map.flat().filter(el=>el.visited)

    const n = cellCluster.map(cell => getCurrentCellNeighbors(cell.coordinates, map))
    // removing duplicates
    return n.flat().filter(el=>!el.visited)
    .filter((cell, index, fullArray)=>fullArray.findIndex(c=>(c._id === cell._id)) === index)
}

const findColorPathFromCell = (currentCell, map, checkedCellIds=[]) => {
    checkedCellIds.push(currentCell._id)
    
    const specifiedColor = currentCell.color
    const connectedCells = getCurrentCellNeighbors(currentCell.coordinates, map)
    if(connectedCells.length === 0){
        return checkedCellIds
    }
    const sameColorConnectedCells = connectedCells.filter(c=>c.color === specifiedColor && !checkedCellIds.includes(c._id) && !c.visited)
    if(sameColorConnectedCells.length === 0){
        return checkedCellIds
    }

    sameColorConnectedCells.reduce((acc, cell, index) => {
        acc.push(cell)
        findColorPathFromCell(cell, map, checkedCellIds)
        
        return acc
    }, [])

    return checkedCellIds
}

export const makeStep = (coordines, gameMap) => {
    const newMap = Object.assign([], gameMap)
    const neighborCells = getCurrentCellClusterNeighbors(newMap)
    

    const currentPathList = neighborCells.reduce((acc, cell) => {
        if(!acc[cell.color]){
            acc[cell.color] = []
        }
         
        const path = findColorPathFromCell(cell, newMap)

        acc[cell.color].push(path)

        return acc;
    }, {})

    
    const joinByColor = Object.values(currentPathList).map((list)=>list.flat())
    
    const longestList = joinByColor.sort(function(a, b) {return b.length - a.length})[0]
    const longestListColor = newMap.flat().find(c=>c._id === longestList[0]).color
    
    newMap.flat().filter(c=>c.visited).map((cell)=>{cell.color = longestListColor})
    newMap.flat().filter(c=>longestList.includes(c._id)).map(cell => { cell.visited = true })
    
    return newMap
}


