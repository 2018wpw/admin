import { Form, Input, Icon, Button, Select } from 'antd';
import styles from '../Common.less';
import SelectRent from './SelectRent';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

let uuid = 2;
class RentSubForm extends React.Component {
  constructor(props) {
    super(props);
    uuid = 2;
  }


  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    // can use data-binding to get
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    console.log('add', keys, nextKeys);

    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;    
    console.log('handleSubmit', e);
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const parentMethods = {
      add: this.add,
      remove: this.remove,
    };    
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 5 },
      },
    };
    const { 
      profitList,
      form,
      formData,
    } = this.props;
    form.getFieldDecorator('keys', { initialValue: [1] });
    const keys = form.getFieldValue('keys');
    console.log('keys', keys);

    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}        
          label={index === 0 ? '价格' : ''}
          key={k}
        >
          {form.getFieldDecorator(`names[${k}]`, {
            initialValue: { number: 1, price: 1},            
            validateTrigger: ['onChange', 'onBlur'],
          })(
            <SelectRent
              {...parentMethods}
              index={index}
              formData={formData}
              k={k}
            >
              
            </SelectRent>
          )}
        </FormItem>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit} className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分润模式"
        >
          {form.getFieldDecorator('profitID', {
            initialValue: formData === null ? null: formData.name,
            rules: [{ required: true, message: '请选择分润模式' }],
          })(
            <Select
              placeholder='请选择分润模式'
            >
              {profitList.map((item, i) => (
                 <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>        
          )}
        </FormItem>
        {formItems}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述信息"
        >
          {form.getFieldDecorator('descr', {
            initialValue: formData === null ? null: formData.descr,
          })(
            <TextArea/>
          )}
        </FormItem> 
      </Form>
    );
  }
};

const SubForm = Form.create()(RentSubForm);
export default SubForm;
