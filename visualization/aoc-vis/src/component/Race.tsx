import { useRef, useState, useEffect } from 'react';
import './Race.css';
import Boat from './Boat';
import { RaceData } from '../util';
import { RaceDataService } from './RaceDataService';


function Race() {
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [winner, setWinner] = useState<string[]>([]);
    const [key, setKey] = useState(0); // Add key state
    const [currentRaceIndex, setCurrentRaceIndex] = useState<number>(0);
    const races: RaceData[] = [{ distance: 9, time: 7 }, { distance: 40, time: 15 }, { distance: 200, time: 30 }];
    const raceData = useRef(new RaceDataService(races[currentRaceIndex].time, races[currentRaceIndex].distance));
    const interval = useRef<number>();


    useEffect(() => {
        const startCounter = () => {
            interval.current = setInterval(() => {
                setTime(prevTime => {
                    raceData.current.updateBoats(prevTime + 1);
                    checkTime(prevTime + 1);
                    return prevTime + 1;
                });
                setKey(prevKey => prevKey + 1); // Update the key to force re-render

            }, 1000);
        };

        if (running) {
            startCounter();

        } else {
            stopCounter();
        }
        return () => stopCounter();
    }, [currentRaceIndex, running]);



    const stopCounter = () => {
        clearInterval(interval.current);
        setTime(0); // Reset time to 0
        setKey((prevKey) => prevKey + 1); // Update key to force re-render
        raceData.current = new RaceDataService(races[currentRaceIndex].time, races[currentRaceIndex].distance);
    };

    function checkTime(time: number) {
        if (time === raceData.current.duration) {
            stopCounter();
        }
    }

    function toggleTimer() {
        setRunning(prevRunning => !prevRunning);
    }

    function nextRace() {
        stopCounter();
        setRunning(() => false);
        setCurrentRaceIndex(prevRace => { if (prevRace + 1 >= races.length) { return 0; } else return prevRace + 1; });
        raceData.current = new RaceDataService(races[currentRaceIndex].time, races[currentRaceIndex].distance);
    }

    function createBoats() {
        const boats: JSX.Element[] = [];
        for (let index = 0; index < races[currentRaceIndex].time; index++) {
            const boatData = raceData.current.boats.get(index);
            if (boatData !== undefined) {
                boats.push(<Boat key={`${index}-${key}`} id={index} initialPosition={{ x: boatData.position.x, y: boatData.position.y }} />);

            }
        }
        return boats;
    }

    return (
        <>
            <h1>Race {currentRaceIndex + 1}:</h1>
            <div style={{ margin: "8px" }}>
                <button onClick={toggleTimer}>{running ? 'Stop' : 'Start'}</button>
            </div>
            <div style={{ margin: "8px" }}>
                <button onClick={nextRace}>Next Race</button>
            </div>
            <div className="canvas" style={{ width: `${raceData.current.distance * 24 + 25}px`, height: `${raceData.current.duration * 24 + 25}px` }}>
                {createBoats()}
                <div className="line" style={{ marginLeft: `${raceData.current.distance * 24}px`, height: `${raceData.current.duration * 24 + 25}px` }} />
            </div>
        </>
    );
}

export default Race;
