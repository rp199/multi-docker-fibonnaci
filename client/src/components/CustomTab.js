import React from 'react';
import { Tab } from 'semantic-ui-react';

const CustomTabs = ({ children, names }) => {
	const elements = children.map((child, i) => ({
		menuItem: names[i],
		render: () => <Tab.Pane>{child}</Tab.Pane>
	}));

	return <Tab panes={elements}></Tab>;
};

export default CustomTabs;
