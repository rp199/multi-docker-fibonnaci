import React, { Component } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import IndexForm from './components/IndexForm';
import SeenValues from './components/SeenValues';
import CalculatedValues from './components/CalculatedValues';
import ContentBox from './components/ContentBox';
import apiClient from './api/ApiClient';
import CustomTabs from './components/CustomTab';
import Utils from './utils/Utils';
import Sequence from './components/Sequence';

export default class Fib extends Component {
	state = {
		seenIndexes: [],
		values: {},
		index: '',
		sequenceLength: 0,
		sequence: []
	};

	componentDidMount() {
		Promise.all([this.fetchValues(), this.fetchIndexes()]);
	}

	async fetchValues() {
		const { data } = await apiClient.fecthAllValues();
		this.setState({ values: data });
		this.updateSequence();
		this.refreshUncalculatedValues();
	}

	async refreshUncalculatedValues() {
		const unfetchedValues = Object.entries(this.state.values)
			.filter(value => value[1] === 'null')
			.map(value => value[0]);
		if (unfetchedValues.length > 0) {
			const { data } = await apiClient.fecthValues(unfetchedValues);
			console.log(`Calculating values: ${unfetchedValues}...`);
			Object.entries(data)
				.filter(value => value[1] !== 'null')
				.map(value => {
					this.setState({
						values: { ...this.state.values, [value[0]]: value[1] }
					});
				});
			console.log(data);
			this.updateSequence();
			setTimeout(() => this.refreshUncalculatedValues(), 3000);
		} else {
			console.log('Finished calculating values');
			return;
		}
	}

	async fetchIndexes() {
		const { data } = await apiClient.fetchIndexes();
		this.setState({
			seenIndexes: data
		});
	}

	handleSubmit = async event => {
		event.preventDefault();
		await apiClient.submitIndex(this.state.index);
		this.setState({ index: '' });
		Promise.all([this.fetchIndexes(), this.fetchValues()]);
	};

	handleSubmitRange = async event => {
		event.preventDefault();
		await apiClient.generateSequence(this.state.sequenceLength);
		Promise.all([this.fetchIndexes(), this.fetchValues()]);
	};

	clearSeenValues = async () => {
		await apiClient.deleteIndexes();
		this.setState({
			seenIndexes: []
		});
	};

	clearCalculatedValues = async () => {
		await apiClient.deleteValues();
		this.setState({
			values: {},
			index: '',
			sequenceLength: 0,
			sequence: []
		});
	};

	clearAll = async () => {
		const [resultDB, resultRedis] = await Promise.all([
			apiClient.deleteIndexes(),
			apiClient.deleteValues()
		]);
		console.log(
			`Delete all reponse code: ${resultDB.status}. Delete current response code: ${resultRedis.status}`
		);
		this.setState({
			seenIndexes: [],
			values: {},
			index: '',
			sequenceLength: 0,
			sequence: []
		});
	};

	updateSequence = () => {
		const sequenceArray = [];
		if (this.state.sequence.length === this.state.sequenceLength) {
			return;
		}
		for (let i = 0; i < this.state.sequenceLength; i++) {
			sequenceArray.push(this.state.values[i]);
		}
		this.setState({ sequence: sequenceArray });
	};

	render() {
		return (
			<div>
				<Header as="h2" color="black" textAlign="center">
					Fibonnaci Calculator
				</Header>
				<ContentBox>
					<CustomTabs
						names={['Index calculator', 'Sequence generator']}
					>
						<IndexForm
							formHeader="Fibonnaci Index Calculator"
							placeholder="Enter index..."
							value={this.state.index}
							handleSubmit={this.handleSubmit}
							onChange={value => this.setState({ index: value })}
							type="text"
							validator={Utils.indexValidator}
						/>
						<IndexForm
							formHeader="Fibonnaci Sequence Generator"
							value={this.state.sequenceLength}
							handleSubmit={this.handleSubmitRange}
							onChange={value =>
								this.setState({ sequenceLength: value })
							}
							type="range"
						/>
					</CustomTabs>

					<Segment>
						<Button
							onClick={this.clearSeenValues}
							content="Clear seen"
						/>
						<Button
							onClick={this.clearCalculatedValues}
							content="Clear calculated"
						/>
						<Button onClick={this.clearAll} content="Clear All" />
					</Segment>
				</ContentBox>
				<ContentBox hidden={this.state.sequence.length === 0}>
					<Sequence values={this.state.sequence}></Sequence>
				</ContentBox>

				{this.state.seenIndexes.length !== 0 && (
					<SeenValues
						values={this.state.seenIndexes.map(
							({ number }) => number
						)}
					></SeenValues>
				)}

				<ContentBox>
					<CalculatedValues
						values={this.state.values}
					></CalculatedValues>
				</ContentBox>
			</div>
		);
	}
}
