import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
	const nav = useNavigate();
	return (
		<>
			<h1>Choose your simulation</h1>
			{/* <button onClick={() => nav('/day06')}>Day 06 - Boat race</button> */}
			<button onClick={() => nav('/day14')}>
				Day 14 - Parabolic Reflector Dish
			</button>
		</>
	);
}

export default App;
