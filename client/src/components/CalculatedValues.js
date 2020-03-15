import React from 'react';
import { Feed, Label, Header, Loader } from 'semantic-ui-react';

const CalculatedValues = ({ values }) => {
	return (
		<Feed>
			<Header>Calculated Values</Header>
			{Object.entries(values).length === 0
				? 'Nothing calculated yet'
				: Object.keys(values).map(key => (
						<Feed.Event key={key}>
							<Feed.Label>
								<Label circular>
									<Loader
										active={values[key] === 'null'}
										inline="centered"
										size="small"
									></Loader>
									{values[key] !== 'null' && `Index ${key}`}
								</Label>
							</Feed.Label>
							<Feed.Content>
								<Feed.Summary>
									{values[key] === 'null'
										? `Calculating value for index ${key}...`
										: `For index ${key} calculated value ${values[key]}`}
								</Feed.Summary>
							</Feed.Content>
						</Feed.Event>
				  ))}
		</Feed>
	);
};

export default CalculatedValues;
