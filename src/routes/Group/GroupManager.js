import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const confirm = Modal.confirm;


const AssignSubAccountForm = Form.create()((props) => {
  const { assignVisible, form, handleAssign, hideAssignModal } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAssign(fieldsValue);
    });
  };
  return (
    <Modal
      title="分配群组"
      visible={assignVisible}
      onOk={okHandle}
      onCancel={() => hideAssignModal()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="子账号"
        >
          {form.getFieldDecorator('prodName', {
            rules: [{ required: true, message: '请选择子账号' }],
          })(
            <Select placeholder="请选择">
              <Option value="0">子账号</Option>
            </Select>
          )}
        </FormItem>
      </Form>     
    </Modal>
  );
});


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
          {form.getFieldDecorator('prodName', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Select placeholder="请选择">
              <Option value="0">净化器</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备型号"
        >
          {form.getFieldDecorator('modelID', {
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
          {form.getFieldDecorator('descr')(
            <TextArea/>
          )}
        </FormItem> 
      </Form>     
    </Modal>
  );
});

@connect(({ group, loading }) => ({
  group,
  loading: loading.effects['group/queryList'],
}))
export default class GroupManager extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '群组名称',
      dataIndex: 'name',
    }, {
      title: '描述信息',
      dataIndex: 'descr',
    }, {
      title: '设备数量',
      dataIndex: 'deviceCount',
    }, {
      title: '分配状态',
      dataIndex: 'asignState',
    }, {
      title: '设备型号',
      dataIndex: 'modelName',
    }, {
      title: '设备类型',
      dataIndex: 'prodName',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        console.log('rend group list item', text, record);
        if(record.assignInfo) {
          return(
            <div>
              <a onClick={()=>{this.onDeleteDevice(record)}} className={styles.left}>删除设备</a>
              <a onClick={()=>{this.onExitRent(record)}} className={styles.right}>退出租赁</a>
            </div>               
          );
        } else {
          return(
            <div>
              <a onClick={()=>{this.onAssignSubAccount(record)}} className={styles.left}>分配</a>
              <a onClick={()=>{this.onJoinRent(record)}} className={styles.right}>加入租赁</a>                         
            </div>            
          );
        }
      }, 
    }, {
      title: '是否加入租赁',
      dataIndex: 'enableRent',
    }];

    this.state = {
      visible: false,
      assignVisible: false,
    };
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.props.dispatch({
      type: 'group/queryList',
    });
  }

  onDeleteDevice = (record) => {
    console.log('onDeleteDevice', record);
    const { dispatch } = this.props;
    confirm({
      title: '删除设备',
      content: '确定从群组中删除设备？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'group/removeDevices',
            payload: {
              groupID: record.id,
              devices: new Array(2),//TODO
              resolve: resolve,
              reject: reject,
            }
          });
        })
        .catch((err) => console.log(err));        
      },
      onCancel() {},
    });
  }

  onExitRent = (record) => {
    console.log('onExitRent', record);
    const { dispatch } = this.props;
    confirm({
      title: '退出租赁',
      content: '确定从群组中退出租赁设备？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'group/exitRent',
            payload: {
              groupID: record.id,
              rentID: record.id,//TODO 租赁设备 id
              resolve: resolve,
              reject: reject,
            }
          });
        })
        .catch((err) => console.log(err));        
      },
      onCancel() {},
    });
  }    

  handleAssign = (values) => {
    this.setState({
      assignVisible: false,
    });
    this.props.dispatch({
      type: 'group/assign',
      payload: {
        ...values,
      }
    });    
  }

  hideAssignModal = () => {
    this.setState({
      assignVisible: false,
    });
  }

  handleCreate = (values) => {
    console.log('handleCreate')
    this.props.dispatch({
      type: 'group/create',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
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


  saveFormRef = (form) => {
    this.form = form;
  }


  render() {
    const { visible } = this.state;
    const columns = this.columns;
    const { group } = this.props;

    var dataSource = group.groups || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
      item['asignState'] = item.assignInfo.assignAccounts ? '已分配' : '尚未分配';
      item['enableRent'] = item.assignInfo.assignAccounts ? '是' : '否';
    });

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      handleAssign: this.handleAssign,
      hideAssignModal: this.hideAssignModal,
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

        <AssignSubAccountForm
          {...parentMethods}
          assignVisible={this.state.assignVisible}
        />

      </PageHeaderLayout>
    );
  }
}