import React from 'react';
import { Segment, Label, Loader, Header } from 'semantic-ui-react';

const Sequence = ({ values }) => {
	return (
		<div>
			<Header>Sequence size {values.length}</Header>
			<Segment>
				{values.map((value, i) => (
					<Label circular size="medium" key={i}>
						<Loader
							key={value}
							active={value === 'null'}
							inline
							size="mini"
						></Loader>
						{value !== 'null' && value}
					</Label>
				))}
			</Segment>
		</div>
	);
};

export default Sequence;
