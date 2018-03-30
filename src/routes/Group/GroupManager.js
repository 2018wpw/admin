import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateGroupForm = Form.create()((props) => {
  const { visible, form, handleCreate, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };
  return (
    <Modal
      title="创建群组"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="群组名称"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备类型"
        >
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Select placeholder="请选择">
              <Option value="0">M100</Option>
              <Option value="1">M200</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备型号"
        >
          {form.getFieldDecorator('mode', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Select placeholder="请选择">
              <Option value="0">M100</Option>
              <Option value="1">M200</Option>
            </Select>
          )}
        </FormItem>        
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述信息"
        >
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <TextArea/>
          )}
        </FormItem> 
      </Form>     
    </Modal>
  );
});


export default class WarningSetting extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '描述信息',
      dataIndex: 'description',
    }, {
      title: '设备数量',
      dataIndex: 'deviceCount',
    }, {
      title: '分配状态',
      dataIndex: 'asignState',
    }, {
      title: '设备型号',
      dataIndex: 'deviceMode',
    }, {
      title: '设备类型',
      dataIndex: 'deviceType',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.editHref}>编辑</a>
              <a href="#" className={styles.deleteHref}>删除</a>
            </Popconfirm>
        );
      }, 
    }, {
      title: '是否加入租赁',
      dataIndex: 'enableRent',
    }];

    this.state = {
      dataSource: [],
      count: 0,
      visible: false,
    };
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  handleCreate = () => {
    const { count, dataSource } = this.state;
    const form = this.form;
    const newData = {
        key: count,
        name: '用户1',
        description: '我是描述信息',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      visible: false
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
  }

  handleModalVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  }

  onSubmit = (e) => {

  }

  saveFormRef = (form) => {
    this.form = form;
  }


  render() {
    const { dataSource, visible } = this.state;
    const columns = this.columns;

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={this.showModal} className={styles.createButton}>创建群组</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <CreateGroupForm
          {...parentMethods}
          visible={visible}
        />
      </PageHeaderLayout>
    );
  }
}