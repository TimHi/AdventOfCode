import './Boat.css'

import Boat1 from "../assets/boat_1.png"
import { useState } from 'react'
import { Point } from '../util'

function Boat({ id, initialPosition }) {
    const [position, setPostion] = useState<Point>(initialPosition);


    return (
        <div style={{ position: "absolute", left: position.x, top: position.y }} key={id}>
            <img src={Boat1} width="24px" height="24px"></img>
        </div>
    )
}

export default Boat
