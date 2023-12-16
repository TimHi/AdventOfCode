import { useState } from 'react';
import RockGrid from '../component/RockGrid';

import {
	GetEast,
	GetInitialField,
	GetNorth,
	GetSouth,
	GetWest,
} from '../service/Day14Data';

function Day14() {
	const [field, setField] = useState<string[]>(GetInitialField());
	return (
		<>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr 1fr',
					gap: '10px',
					maxWidth: '150px',
					margin: 'auto',
				}}
			>
				<button
					onClick={() => setField(GetNorth(field))}
					style={{ gridRow: 1, gridColumn: 2 }}
				>
					North
				</button>
				<button
					onClick={() => setField(GetEast(field))}
					style={{ gridRow: 2, gridColumn: 3 }}
				>
					East
				</button>
				<button
					onClick={() => setField(GetWest(field))}
					style={{ gridRow: 2, gridColumn: 1 }}
				>
					West
				</button>
				<button
					onClick={() => setField(GetSouth(field))}
					style={{ gridRow: 3, gridColumn: 2 }}
				>
					South
				</button>
			</div>
			<div style={{ display: 'flex' }}>
				<div style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
					<RockGrid field={field} />
				</div>
			</div>
		</>
	);
}

export default Day14;
