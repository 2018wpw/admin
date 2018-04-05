import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col } from 'antd';
import styles from './List.less';
import commonStyles from '../Common.less'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;


const ChangePwdForm = Form.create()((props) => {
  const { changePwdModalVisible, form, handleChangePwd, handlePwdModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleChangePwd(fieldsValue);
    });
  };
  return (
    <Modal
      title="修改密码"
      visible={changePwdModalVisible}
      onOk={okHandle}
      onCancel={() => handlePwdModalVisible()}
    >
    <Form className={commonStyles.formItemGap}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="初始密码"
      >
        {form.getFieldDecorator('pwd', {
          rules: [{ required: true, message: '请输入初始密码' }],
        })(
          <Input placeholder="请输入初始密码" />
        )}
      </FormItem> 

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="新密码"
      >
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入密码' }],
        })(
          <Input placeholder="请输入密码" />
        )}
      </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="确认密码"
      >
        {form.getFieldDecorator('zone', {
          rules: [{ required: true, message: '请输入密码' }],
        })(
          <Input placeholder="请输入密码" />
        )}
      </FormItem>
    </Form>

    </Modal>
  );
});


const AddAccountForm = Form.create()((props) => {
  const { addAccountModalVisible, form, handleCreate, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };
  return (
    <Modal
      title="添加账号"
      visible={addAccountModalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form className={commonStyles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户名"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input placeholder="请输入用户名" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="地区"
        >
          {form.getFieldDecorator('zone', {
            rules: [{ required: true, message: '请输入地区' }],
          })(
            <Input placeholder="请输入地区" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="类型"
        >
          {form.getFieldDecorator('desc', {
            rules: [{ required: true, message: '请选择类型' }],
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
          label="初始密码"
        >
          {form.getFieldDecorator('pwd', {
            rules: [{ required: true, message: '请输入初始密码' }],
          })(
            <Input placeholder="请输入初始密码" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="联系电话"
        >
          {form.getFieldDecorator('tel', {
            rules: [{ required: true, message: '请输入联系电话' }],
          })(
            <Input placeholder="请输入联系电话" />
          )}
        </FormItem>            

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="联系人"
        >
          {form.getFieldDecorator('contact', {
            rules: [{ required: true, message: '请输入联系人' }],
          })(
            <Input placeholder="请输入联系人" />
          )}
        </FormItem>         
      </Form>   
    </Modal>
  );
});


export default class AccountList extends React.Component {
  constructor(props) {
    super(props);

    this.dataColumns = [{
      title: '用户名',
      dataIndex: 'userName',
    }, {
      title: '地区',
      dataIndex: 'Zone',
    }, {
      title: '类型',
      dataIndex: 'type',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
    }, {
      title: '上级账号',
      dataIndex: 'superAccount',
    }, {
      title: '联系电话',
      dataIndex: 'tel',
    }, {
      title: '联系人',
      dataIndex: 'contact',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <div>
              <a name="edit" className={styles.edit} onClick={() => {alert("alert")}}>编辑</a>
              <a name="change" className={styles.change} onClick={() => {this.onChange()}}>修改密码</a>
            </div>
        );
      },
    }];


    this.state = {
      addAccountModalVisible: false,
      dataSource: [{
        key: '0',
        userName: '张三',
        Zone: '北京',
        type: '我是谁',
        createTime: '2018-01-01',
        tel: '18600000000',
        superAccount: '上级',
        contact: '李四'
      }],
      dataCount: 1,
      changePwdModalVisible: false,
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


  handleModalVisible = (flag) => {
    this.setState({
      addAccountModalVisible: !!flag,
    });
  }

  handlePwdModalVisible = (flag) => {
    this.setState({
      changePwdModalVisible: !!flag,
    });
  }

  handleChangePwd = () => {
    //TODO
    this.setState({
      changePwdModalVisible: false
    });
  }

  onEdit = () => {
    //TODO
  }

  onChange = () => {
    //TODO
    this.setState({
      changePwdModalVisible: true
    });
  }

  handleCreate = () => {
    const { historyCount, dataSource, dataCount } = this.state;
    const form = this.form;
    const newData = {
        key: historyCount,
        userName: '张三1',
        Zone: '北京1',
        type: '我是谁1',
        createTime: '2018-01-02',
        tel: '18600000000',
        superAccount: '上级1',
        contact: '李四1'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      dataCount: dataCount + 1,
      addAccountModalVisible: false
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  renderSimpleForm() {
    return (
      <Form layouts="vertical" layout="inline">
            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
              <Col md={6} sm={24}>
                <FormItem label="用户名">
                  <Input placeholder="请输入用户名"></Input>
                </FormItem>
              </Col>
              <Col  md={6} sm={24}>
                <FormItem label="地区">
                  <Input placeholder="请输入地区"></Input>             
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="产品型号">
                  <Input placeholder="请输入手机号"></Input>                
                </FormItem>
              </Col> 
              <Col md={6} sm={24}>
                <FormItem>
                  <div layout="inline" align="right">
                    <Button type="primary" className={styles.button}>查询</Button>
                    <Button type="primary" className={styles.button}  onClick={() => this.handleModalVisible(true)}>添加</Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
      </Form> 
    );
  }

  render() {
    const { dataSource, addAccountModalVisible, changePwdModalVisible } = this.state;
    const dataColumns = this.dataColumns;

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      handlePwdModalVisible: this.handlePwdModalVisible,
      handleChangePwd: this.handlePwdModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>

          <div>
            <Table bordered dataSource={dataSource} columns={dataColumns} />
          </div>
        </Card>

        <AddAccountForm
          {...parentMethods}
          addAccountModalVisible={addAccountModalVisible}
        />

        <ChangePwdForm
          {...parentMethods}
          changePwdModalVisible={changePwdModalVisible}
        />

      </PageHeaderLayout>
    );
  }
}