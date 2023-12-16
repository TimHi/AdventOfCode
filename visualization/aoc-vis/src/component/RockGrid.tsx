import styles from '../pages/Day14.module.css'; // Import css modules stylesheet as styles
function RockGrid({ field }) {
	const renderedField = field.map((line: string, index: number) => (
		<p
			key={index}
			className={`${styles.textWithTrans} ${
				line.trim() === '' ? styles.hidden : ''
			}`}
		>
			{line}
		</p>
	));

	return (
		<div>
			<div>{renderedField}</div>
		</div>
	);
}

export default RockGrid;
