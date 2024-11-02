import React from 'react'

const MapLine = ({
    degree,
    size,
    start
} : {
    degree: number,
    size: number,
    start: {top: number, left: number}
}) => {
    if(degree == 0){
        return (
          <div 
              className={`h-0.5 w-full bg-p_text absolute`}
              style={{
                  width: `${Math.abs(size)}%`,
                  top: `${start.top}%`,
                  left: `${start.left}%`,
              }}    
          ></div>
        )
    }
    else if(degree == 90) {
        return (
          <div 
              className={`w-0.5 h-full bg-p_text absolute`}
              style={{
                  height: `${Math.abs(size)}%`,
                  top: `${start.top}%`,
                  left: `${start.left}%`,
              }}    
          ></div>
        )

    }
}

export default MapLine