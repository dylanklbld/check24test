export function getDummyMapObject(rows, columns, colorsCount){
    const fixedColorSet = getRandomColorSet(colorsCount)
    
    const getCoordinates = (x, y) => ({x, y})
    const getId = (x, y) => x*rows+y
    const getRandomColorFromSet = () => fixedColorSet[getRandomInt(fixedColorSet.length)]
    const getNeighborCoordinates = (rowNumber, columnNumber) => () => {
        return {
            north: rowNumber === 0 ? null : getCoordinates(rowNumber-1, columnNumber),
            west: columnNumber === 0 ? null : getCoordinates(rowNumber, columnNumber-1),
            south: rowNumber === rows-1 ? null : getCoordinates(rowNumber+1, columnNumber),
            east: columnNumber === columns-1 ? null : getCoordinates(rowNumber, columnNumber+1)
        } 
    }

    return [...Array(rows).keys()].map((rowNumber) => [...Array(columns).keys()].map((columnNumber)=>({
        _id: getId(rowNumber, columnNumber),
        coordinates: getCoordinates(rowNumber, columnNumber),
        neighborCoordinates: getNeighborCoordinates(rowNumber, columnNumber),
        color: getRandomColorFromSet(),
        visited: null
    })))
}

function getRandomInt(max, min=0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function getRandomColorSet(size){
    const s = size > 100 ? 100 : size
    const onlyUnique = (value, index, self) => { 
        return self.indexOf(value) === index;
    }
    return [...Array(size).keys()].map(()=>getRandomColor()).filter(onlyUnique)
}

