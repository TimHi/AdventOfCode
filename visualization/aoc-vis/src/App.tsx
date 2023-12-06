import './App.css';
import { useNavigate } from 'react-router-dom';



function App() {
  const nav = useNavigate();
  return (
    <>
      <h1>Choose your simulation</h1>
      <button onClick={(() => {
        console.log("aal");
        nav("/day06");
      })}>Day 06 - Boat race</button>

    </>
  );
}

export default App;
