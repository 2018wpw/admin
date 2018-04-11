import { Form, Input, Icon, Button, Select } from 'antd';
import styles from '../Common.less';
import SelectRato from 'components/Widget';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

let uuid = 2;
class ProfitSubForm extends React.Component {
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
      roleList,
      form
    } = this.props;
    form.getFieldDecorator('keys', { initialValue: [1] });
    const keys = form.getFieldValue('keys');
    console.log('keys', keys);

    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}        
          label={index === 0 ? '分成比例' : ''}
          key={k}
        >
          {form.getFieldDecorator(`names[${k}]`, {
            initialValue: { number: 1, role: ''},
            validateTrigger: ['onChange', 'onBlur'],
          })(
            <SelectRato
              {...parentMethods}
              index={index}
              roleList={roleList}
              k={k}
            >
              
            </SelectRato>
          )}
        </FormItem>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit} className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入分润模式名称' }],
          })(
            <Input placeholder="请输入分润模式名称" />          
          )}
        </FormItem>
        {formItems}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分润模式描述"
        >
          {form.getFieldDecorator('descr')(
            <TextArea/>
          )}
        </FormItem> 
      </Form>
    );
  }
};

const SubForm = Form.create()(ProfitSubForm);
export default SubForm;
