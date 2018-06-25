import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';
import { prd_type } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const confirm = Modal.confirm;

let prodModelData;

const AssignSubAccountForm = Form.create()((props) => {
  const { assignVisible, form, handleAssign, hideAssignModal } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAssign(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    hideAssignModal();
  };

  return (
    <Modal
      title="分配群组"
      visible={assignVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
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
  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible();
  };

  return (
    <Modal
      title="创建群组"
      visible={visible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="群组名称"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入群组名称' }],
          })(
            <Input placeholder="请输入群组名称" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备类型"
        >
          {form.getFieldDecorator('prodName', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <Select placeholder="请选择设备类型">
              <Option value="0">{prd_type[0]}</Option>
              <Option value="1">{prd_type[1]}</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备型号"
        >
            {form.getFieldDecorator('modelID', {
              rules: [{ required: true, message: '请输选择设备型号' }],
            })(
              <Select placeholder="请选择设备型号">
              {
                prodModelData.map((item, index) => (
                  <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
                ))
              }  
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

@connect(({ group, prodModel, loading }) => ({
  group,
  prodModel,
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
      title: '分配账户',
      dataIndex: 'assignAccounts',
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
      title: '租赁信息',
      dataIndex: 'rentInfo',
    }];

    this.state = {
      visible: false,
      assignVisible: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'group/queryList',
    });
    this.props.dispatch({
      type: 'prodModel/list',
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
    const { group, prodModel } = this.props;

    var groupData = group.groups || [];
    groupData.map((item, index)=>{
      item['key'] = index;
      if (item.assignInfo) {
        if(item.assignInfo.accountInfo) {
          item['accountInfo'] = item.assignInfo.accountInfo.name;
        } else {
          item['accountInfo'] = '尚未分配';
        }
        if (item.assignInfo.rentInfo) {
          item['rentInfo'] = item.assignInfo.rentInfo.name;
        }
      }
      groupData['id'] = item.id.toString();
    });

    prodModelData = prodModel.models || [];
    prodModelData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
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
            <Table bordered dataSource={groupData} columns={columns} />
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