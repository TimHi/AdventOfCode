import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import Day14 from './pages/Day14.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	// {
	// 	path: 'day06',
	// 	element: <Day06 />,
	// },
	{
		path: 'day14',
		element: <Day14 />,
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
