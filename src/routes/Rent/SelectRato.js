import React from 'react';
import { Col, Row, Input, Select, Button, Icon} from 'antd';

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

  click = (index, k) => {

    const { add, remove } = this.props;
    if(index === 0) {
      return ()=>add();
    } else {
      return ()=>remove(k);
    }
  }

  render() {
  	const { roleList, index, k, formData } = this.props;
  	const state = this.state;
	  const optionValue = roleList || [];
    var type = index === 0 ? "plus-circle-o" : "minus-circle-o";
  	return(
		  <span>
	        <Select
	          style={{ width: '55%' }}
	          onChange={this.handleRoleChange}
            placeholder='请选择角色'
            value={state.role}
	        >
		      {optionValue.map((item, i) => (
					   <Option value={item.id}>{item.name}</Option>
			    ))}
	        </Select> 
          {
            formData === null ? 
    	        <span><Input
    	          type="text"
    	          value={state.number}
    	          onChange={this.handleNumberChange}
                style={{ width: '29%', marginLeft: '3%', marginRight: '3%', }}
                addonAfter='%'
    	        />
              <Icon type={type} onClick={this.click(index, k)} /></span>
              : <Input
                type="text"
                value={state.number}
                onChange={this.handleNumberChange}
                style={{ width: '42%', marginLeft: '3%'}}
                addonAfter='%'
              />
          }         

		  </span>       
  	);
  }
}