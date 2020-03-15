import React from 'react';
import { Grid } from 'semantic-ui-react';

const SeenValues = ({ values }) => {
	return (
		<Grid columns={6} centered>
			<Grid.Row>
				<Grid.Column>
					<b>Seen values: </b>
					{values.join(', ')}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default SeenValues;
