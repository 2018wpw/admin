import React from 'react';
import { Col, Row, Input, Select } from 'antd';

const Option = Select.Option;

export default class SelectRato extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      number: value.number || 0,
      role: value.role || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleNumberChange = (e) => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  }

  handleRoleChange = (role) => {
    if (!('value' in this.props)) {
      this.setState({ role });
    }
    this.triggerChange({ role });
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
  	const { addClick, methodName, removeMethod, roleList } = this.props;
  	const state = this.state;
	const optionValue = roleList || [];

  	return(
		<span>
	        <Select
	          style={{ width: '65%' }}
	          onChange={this.handleRoleChange}
	        >
		        {optionValue.map((item, i) => (
					<Option value={item.name}>{item.name}</Option>
			    ))}
	        </Select>          
	        <Input
	          type="text"
	          value={state.number}
	          onChange={this.handleNumberChange}
	          style={{ width: '32%', marginLeft: '3%' }}
	        />   			
		</span>       
  	);
  }
}