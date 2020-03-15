import React from 'react';
import { Button, Form, Message, Icon } from 'semantic-ui-react';
import Utils from '../utils/Utils';

const IndexForm = ({
	value,
	onChange,
	handleSubmit,
	placeholder,
	type,
	validator
}) => {
	let error;
	let errorMessage;
	if (validator) {
		const validationResult = validator(value);
		error = validationResult.error;
		errorMessage = validationResult.errorMessage;
	}

	const isRange = type === 'range';
	return (
		<div>
			<Form size="large" onSubmit={handleSubmit}>
				<Form.Input
					fluid
					label={isRange ? `How many elements? ${value}` : ''}
					icon={isRange ? '' : 'calculator'}
					min={1}
					max={41}
					placeholder={placeholder}
					type={type}
					onChange={event => {
						onChange(event.target.value);
					}}
					value={value}
				/>
				<Button
					color="black"
					fluid
					size="large"
					disabled={error || Utils.isBlank(value)}
				>
					Calculate
				</Button>
			</Form>
			<Message attached="bottom" error={error} hidden={!error}>
				<Icon name="cancel" />
				{errorMessage}
			</Message>
		</div>
	);
};

IndexForm.defaultProps = {
	type: 'text',
	value: '0'
};

export default IndexForm;
