import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RoleManager.less';
import { connect } from 'dva';

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
        {form.getFieldDecorator('permissions', {
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
        {form.getFieldDecorator('descr', {
          rules: [{ required: true, message: '请输入角色描述' }],
        })(
          <TextArea/>
        )}
      </FormItem>      
    </Modal>
  );
});

const EditRoleForm = Form.create()((props) => {
  const { visible, form, handleEdit, hideEditModal } = props;
  const { getFieldProps, getFieldDecorator } = form;

  const okHandle = () => {
    form.validateFields((err, values) => {
      handleEdit(values);
    });    
  };
  return (
    <Modal
      title="编辑角色"
      visible={visible}
      onOk={okHandle}
      onCancel={() => hideEditModal()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色名称"
      >
      {getFieldDecorator('name')(
          <div>名称</div> 
      )}
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="权限"
      >
      {getFieldDecorator('permissions')(
          <div>删除</div> 
      )}      
      </FormItem>            

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色描述"
      >
      {getFieldDecorator('descr')(
        <TextArea placeholder='描述'/>     
      )}        
      </FormItem>      
    </Modal>
  );
});

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/queryRoleList'],
}))
export default class RoleManager extends React.Component {
  state = {
      count: 1,
      visible: false,
      dataSource: [],
      editVisible: false,
  }

  columns = [{
      title: '角色名称',
      dataIndex: 'name',
      width: '20%',
    }, {
      title: '角色描述',
      dataIndex: 'descr',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (text, record) => {
        return (
            <div>
              <a onClick={() => {this.onEdit()}} className={styles.left}>编辑</a>
              <a onClick={() => {this.onDelete()}} className={styles.right}>删除</a>
            </div>
        );
      },
  }]

  componentDidMount() {
    this.props.dispatch({
      type: 'account/queryRoleList',
    });
  }

  onEdit = () => {
    this.setState({
      editVisible: true
    });
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
  handleCreate = (value) => {
    this.props.dispatch({
      type: 'account/createRole',
      payload: {
        ...value,
      }
    });
    this.setState({
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

  hideEditModal = () => {
    this.setState({
      editVisible: false,
    })
  }

  handleEdit = (value) => {
    this.props.dispatch({
      type: 'account/editRole',
      payload: {
        ...value,
      }
    });
    this.setState({
      editVisible: false,
    })    
  }

  onSubmit = (e) => {

  }

  render() {
    const { account } = this.props;
    var dataSource = account.roles || [];
    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      hideEditModal: this.hideEditModal,
      handleEdit: this.handleEdit,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.button} type="primary" onClick={this.showModal}>创建角色</Button>
            <Table bordered dataSource={dataSource} columns={this.columns} />
          </div>          
        </Card>

        <CreateRoleForm
          {...parentMethods}
          visible={this.state.visible}
        />
        <EditRoleForm
          {...parentMethods}
          visible={this.state.editVisible}        
        />
      </PageHeaderLayout>
    );
  }
}