import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RoleManager.less';
import { connect } from 'dva';
import PermissionTree from './PermissionTree';
import {accountNode, deviceNode, batchNode, groupNode, rentNode, profitNode, upgradeNode, strainerNode, prodNode} from './PermissionTree';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

const CreateRoleForm = Form.create()((props) => {
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
      width='600'
      title="创建角色"
      visible={visible}
      okText='创建'
      cancelText='取消'
      onOk={okHandle}
      onCancel={cancelHandle}
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
        label="权限"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Row>
          <Col span={6}>
            {form.getFieldDecorator('account')(
              <PermissionTree
                dataNode={accountNode}
              />        
            )}
          </Col>
          <Col span={6}>
            {form.getFieldDecorator('device')(
              <PermissionTree
                dataNode={deviceNode}
              />
              )}
          </Col>
          <Col span={6}>
            {form.getFieldDecorator('batch')(
              <PermissionTree
                dataNode={batchNode}
              />
            )}
          </Col>
          <Col span={6}>
            {form.getFieldDecorator('rent')(
              <PermissionTree
                dataNode={rentNode}
              /> 
            )}
          </Col>          
        </Row>    
        <Row>
          <Col span={6}>
            {form.getFieldDecorator('profit')(
              <PermissionTree
                dataNode={profitNode}
              />             
            )}
          </Col>
          <Col span={6}>
            {form.getFieldDecorator('group')(
              <PermissionTree
                dataNode={groupNode}
              />             
            )}
          </Col>
          <Col span={6}>
            {form.getFieldDecorator('upgrade')(
              <PermissionTree
                dataNode={upgradeNode}
              />             
            )}
          </Col>
          <Col span={6}>
            {form.getFieldDecorator('prod')(
              <PermissionTree
                dataNode={prodNode}
              />             
            )}
          </Col>          
        </Row> 
        <Row>
          <Col span={6}>
            {form.getFieldDecorator('strainer')(
              <PermissionTree
                dataNode={strainerNode}
              /> 
            )}
          </Col>        
        </Row>                    
      </FormItem>            

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色描述"
      >
        {form.getFieldDecorator('descr')(
          <TextArea/>
        )}
      </FormItem>      
    </Modal>
  );
});

const EditRoleForm = Form.create()((props) => {
  const { visible, form, handleEdit, hideEditModal, editData } = props;
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
          <div>{editData.name}</div> 
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
        <TextArea placeholder={editData.descr}/>     
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
      editVisible: false,
      editData: '',
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
              <a onClick={() => {this.onEditItem(record)}} className={styles.left}>编辑</a>
              <a onClick={() => {this.onDeleteItem(record)}} className={styles.right}>删除</a>
            </div>
        );
      },
  }]

  componentDidMount() {
    this.props.dispatch({
      type: 'account/queryRoleList',
    });
  }

  onEditItem = (record) => {
    this.setState({
      editVisible: true,
      editData: record,
    });
  }

  onDeleteItem = (record) => {
    const { dispatch } = this.props;
    confirm({
      title: '删除角色',
      content: '确定从角色列表中删除此角色？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'account/deleteRole',
            payload: {
              roleID: record.id,
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

  render() {
    const { account } = this.props;
    var dataSource = account.roles || [];
    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      hideEditModal: this.hideEditModal,
      handleEdit: this.handleEdit,
    };
    dataSource.map(item=>{
      item['key'] = item.id;
    })

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
          editData={this.state.editData}      
        />
      </PageHeaderLayout>
    );
  }
}