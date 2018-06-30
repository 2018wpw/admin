import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Cascader, message } from 'antd';
import styles from './List.less';
import commonStyles from '../Common.less'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { getChinaAddr } from '../../utils/authority';
import { getTime, account_type } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;
const CascaderOptions = getChinaAddr();

const AddAccountForm = Form.create()((props) => {
  const { addAccountModalVisible, form, handleAddAccount, handleAddModalVisible, userData, handleEditAccount } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (userData === '') {
      	handleAddAccount(fieldsValue);
      } else {
		handleEditAccount(fieldsValue, userData.id);
      }
      form.resetFields();
    });
  };

  const closeHandle = () => {
  	form.resetFields();
  	handleAddModalVisible();
  }

  const onChange = (value) => {
    console.log('onChange', value);
  };

  var title = userData === '' ? '添加账号' : '编辑账号';

  return (
    <Modal
      title={title}
      visible={addAccountModalVisible}
      onOk={okHandle}
      onClose={closeHandle}
      onCancel={closeHandle}
    >
      <Form className={commonStyles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户名"
        >
          {form.getFieldDecorator('name', {
          	initialValue: userData.name,          	          	          	
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input placeholder='请输入用户名' />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="地区"
        >
          {form.getFieldDecorator('addrCode', {
            rules: [{ required: true, message: '请输入地区' }],
          })(
            <Cascader options={CascaderOptions} onChange={onChange} changeOnSelect placeholder='请选择' />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="详细地址"
        >
          {form.getFieldDecorator('addrDetail', {
          	initialValue: userData.addrDetail,          	          	
            rules: [{ required: true, message: '请输入详细地址' }],
          })(
            <Input placeholder="请输入详细地址" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="类型"
        >
          {form.getFieldDecorator('roleID', {
          	initialValue: userData.roleID,
            rules: [{ required: true, message: '请输选择角色' }],
          })(
            <Select placeholder="请选择角色">
              <Select.Option value="0">{account_type[0]}</Select.Option>
              <Select.Option value="1">{account_type[1]}</Select.Option>
              <Select.Option value="2">{account_type[2]}</Select.Option>
              <Select.Option value="3">{account_type[3]}</Select.Option>
              <Select.Option value="4">{account_type[4]}</Select.Option>
            </Select>
          )}
        </FormItem>         

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="联系电话"
        >
          {form.getFieldDecorator('phone', {
          	initialValue: userData.phone,          	
            rules: [{ required: true, message: '请输入联系电话' }],
          })(
            <Input placeholder="请输入联系电话"/>
          )}
        </FormItem>            

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="联系人"
        >
          {form.getFieldDecorator('contact', {
          	initialValue: userData.contact,
            rules: [{ required: true, message: '请输入联系人' }],
          })(
            <Input placeholder={"请输入联系人"} />
          )}
        </FormItem>         
      </Form>   
    </Modal>
  );
});

class AccountList extends React.Component {
  constructor(props) {
    super(props);

    this.dataColumns = [{
      title: '用户名',
      dataIndex: 'name',
      width: '15%',
    }, {
      title: '地区',
      dataIndex: 'addrDetail',
    }, {
      title: '类型',
      dataIndex: 'accountType',
      width: '8%',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '18%',
    }, {
      title: '上级账号',
      dataIndex: 'parent',
    }, {
      title: '联系电话',
      dataIndex: 'phone',
    }, {
      title: '联系人',
      dataIndex: 'contact',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (text, record) => {
    	return (
            <div>
              <a name="edit" className={styles.edit} onClick={() => {this.onResetPwd(record)}}>重置密码</a>
              <a name="change" className={styles.change} onClick={() => {this.onEditItem(record)}}>编辑</a>
            </div>
        );
      },
    }];

    this.state = {
      addAccountModalVisible: false,
      userData: '',
      searching: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'account/queryAccountList',
    });
  }

  handleAddModalVisible = (flag) => {
    this.setState({
      addAccountModalVisible: !!flag,
      userData: '',
    });
  }

  onEditItem = (record) => {
    this.setState({
      addAccountModalVisible: true,
      userData: record,
    });
  }

  onResetPwd = (record) => {
    console.log('onResetPwd', record);
    const { dispatch } = this.props;
    confirm({
      title: '重设密码',
      content: '重设密码后旧密码将不可用，是否要重设密码？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'account/resetAccountPwd',
            payload: {
              userID: record.id,
              resolve: resolve,
              reject: reject,
            }
          });          
        })
        .then(res => {
          const modal = Modal.success({
            title: '新密码',
            content: '密码：' + res,
            okText: '关闭',
          });            
        })
        .catch((err) => {
          console.log(err);
          if(err.errCode === 521) {
			message.error("用户不存在");
          }
        })
      },
      onCancel() {},
    });
  }

  handleEditAccount = (values, userID) => {
    this.setState({
      addAccountModalVisible: false,
      userData: '',
    });
    this.props.dispatch({
      type: 'account/editAccount',
      payload: {
      	userID: userID,
	    name: values.name,
	    addrDetail: values.addrDetail,
	    phone: values.phone,
	    addrCode: values.addrCode[values.addrCode.length - 1],
	    contact: values.contact,
	    roleID: values.roleID,
      },
    });    
  }  

  handleAddAccount = (values) => {
    this.setState({
      addAccountModalVisible: false,
      userData: '',
    });
    this.props.dispatch({
      type: 'account/createAccount',
      payload: {
	    name: values.name,
	    addrDetail: values.addrDetail,
	    phone: values.phone,
	    addrCode: values.addrCode[values.addrCode.length - 1],
	    contact: values.contact,
	    roleID: values.roleID,
      }
    });    
  }

  onChange = (value) => {
    console.log(value);
  }

  loadData = (options) => {
	console.log(options);
  }

  searchAccount = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      var code = fieldsValue.addrCode ? fieldsValue.addrCode[fieldsValue.addrCode.length - 1] : undefined;
	    return new Promise((resolve, reject) => {
	      this.props.dispatch({
	        type: 'account/searchAccount',
	        payload: {
	          resolve: resolve,
	          reject: reject,
	          name: fieldsValue.name,
	          addrDetail: fieldsValue.addrDetail,
	          phone: fieldsValue.phone === '' ? undefined : fieldsValue.phone,
			      addrCode: code,
	        },
	      });
	    }).then(res => {
	      this.setState({
	        visible: true,
	        formData: formData,
	        roleList: res.roles,
	        searching: false,
	      });
	    }).catch(err => {
	      console.log(err);
	      this.setState({
	        searching: false,
	      });      
	    });
    });
  }

  render() {
    const { form, dispatch } = this.props;
    const { addAccountModalVisible } = this.state;
    const { account } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const dataSource = account.accounts || [];
    dataSource.map((item, index) => {
      item['key'] = index;
      item['id'] = item.id.toString();
      // if (item.district && item['accountType'] === null) {
      //   const path = item.district.lev1;
      //   item['addrDetail'] = path + (item.addrDetail ? item.addrDetail : '');      	
      // }
      item['accountType'] = item.role.name;
      item['createTime'] = getTime(item.createTime);
      item['addrDetail'] = item.addrDetail; 
    });

    const parentMethods = {
      handleAddAccount: this.handleAddAccount,
      handleAddModalVisible: this.handleAddModalVisible,
      handleEditAccount: this.handleEditAccount,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form layouts="vertical" layout="inline"  onSubmit={this.searchAccount}>
              <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
                <Col md={5} sm={24}>
                  <FormItem label="用户名">
                    {getFieldDecorator('name')(
                      <Input placeholder="请输入用户名"></Input>                    
                    )}                
                  </FormItem>
                </Col>
                <Col  md={7} sm={24}>
                  <FormItem label="地区">
                    {getFieldDecorator('addrCode')(
                      <Cascader
                       loadData={this.loadData}
                       options={CascaderOptions}
                       onChange={this.onChange} 
                       changeOnSelect placeholder='请选择' />
                    )}
                  </FormItem>
                </Col>
                <Col md={7} sm={24}>
                  <FormItem label="详细地址">
                   {getFieldDecorator('addrDetail')(
                      <Input placeholder="请输入详细地址"></Input>                    
                    )}                   
                  </FormItem>
                </Col> 
                <Col md={5} sm={24}>
                  <FormItem label="手机号">
                   {getFieldDecorator('phone')(
                      <Input placeholder="请输入手机号"></Input>                    
                    )}                  
                  </FormItem>
                </Col>                             
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <FormItem>
                    <div layout="inline" align="center">
                      <Button type="primary" className={styles.button} loading={this.state.searching} htmlType="submit">查询</Button>
                      <Button type="primary" className={styles.button} onClick={() => this.handleAddModalVisible(true)}>添加</Button>
                    </div>
                  </FormItem>
                </Col>              
              </Row>
            </Form>
          </div>

          <div>
            <Table bordered dataSource={dataSource} columns={this.dataColumns} />
          </div>
        </Card>

        <AddAccountForm
          {...parentMethods}
          addAccountModalVisible={addAccountModalVisible}
          userData={this.state.userData}
        />

      </PageHeaderLayout>
    );
  }
}

export default connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/queryAccountList'],
}))(Form.create()(AccountList));