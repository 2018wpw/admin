import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RoleManager.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateRoleForm = Form.create()((props) => {
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
      title="创建角色"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色名称"
      >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称' }],
        })(
          <Input placeholder="请输入角色名称" />
        )}
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="权限"
      >
        {form.getFieldDecorator('permission', {
          rules: [{ required: true, message: '请输入权限' }],
        })(
          <Input placeholder="请输入权限" />
        )}
      </FormItem>            

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色描述"
      >
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: '请输入角色描述' }],
        })(
          <TextArea/>
        )}
      </FormItem>      
    </Modal>
  );
});


export default class RoleManager extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '角色描述',
      dataIndex: 'description',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.left}>编辑</a>
              <a href="#" className={styles.right}>删除</a>
            </Popconfirm>
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: '管理员',
        description: '我是管理员',
      }],
      count: 1,
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
            <Button className={styles.button} type="primary" onClick={this.showModal}>创建角色</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <CreateRoleForm
          {...parentMethods}
          visible={visible}
        />
      </PageHeaderLayout>
    );
  }
}