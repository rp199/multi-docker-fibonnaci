import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';

const ContentBox = ({ children, hidden }) => {
	return (
		!hidden && (
			<Grid textAlign="center">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Segment stacked>{children}</Segment>
				</Grid.Column>
			</Grid>
		)
	);
};

ContentBox.defaultProps = {
	hidden: false
};

export default ContentBox;
