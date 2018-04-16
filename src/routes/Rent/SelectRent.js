import React from 'react';
import { Col, Row, Input, Select, Button, Icon} from 'antd';

const Option = Select.Option;

export default class SelectRent extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      number: value.number || 0,
      price: value.price || 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState(value);
    }
  }

  handleTimeChange = (e) => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  }

  handlePriceChange = (e) => {
    const price = parseInt(e.target.value || 0, 10);
    if (isNaN(price)) {
      return;
    }    
    if (!('value' in this.props)) {
      this.setState({ price });
    }
    this.triggerChange({ price });
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
  	const { index, k, formData } = this.props;
  	const state = this.state;
    var type = index === 0 ? "plus-circle-o" : "minus-circle-o";
  	return(
		  <span>
          <Input 
            style={{ width: '55%' }} 
            addonAfter='元' 
            onChange={this.handlePriceChange}
            value={state.price}
          />
          {
            formData === null ? 
    	        <span><Input
    	          type="text"
    	          value={state.number}
    	          onChange={this.handleTimeChange}
                style={{ width: '29%', marginLeft: '3%', marginRight: '3%', }}
                addonAfter='%'
    	        />
              <Icon type={type} onClick={this.click(index, k)} /></span>
              : <Input
                type="text"
                value={state.number}
                onChange={this.handleTimeChange}
                style={{ width: '42%', marginLeft: '3%'}}
                addonAfter='%'
              />
          }         
		  </span>       
  	);
  }
}