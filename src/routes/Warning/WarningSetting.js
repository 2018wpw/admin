import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

const CreateWarningForm = Form.create()((props) => {
  const { visible, form, handleCreate, handleModalVisible, warningSettingData } = props;
  const { tvocMaxVal, name, groupID, ch2oMaxVal, pm25MaxVal, humidityMaxVal, humidityMinVal, tempMaxVal,tempMinVal, descr, strainerMinVal } = warningSettingData;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue, warningSettingData === '');
    });
  };
  
  const onCancel = () => {
    form.resetFields();
    handleModalVisible();
  };

  return (
    <Modal
      title="创建告警"
      visible={visible}
      onOk={okHandle}
      onCancel={onCancel}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="告警名称"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入' }],
            initialValue: name,
          })(
            <Input placeholder="请输入"/>
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="群组"
        >
          {form.getFieldDecorator('groupID', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: groupID,
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
          label="PM2.5的值≥"
        >
          {form.getFieldDecorator('pm25MaxVal', {initialValue: pm25MaxVal,})(
            <Input placeholder="请输入" />
          )}
        </FormItem>  

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="TVOC的值≥"
        >
          {form.getFieldDecorator('tvocMaxVal', {initialValue: tvocMaxVal,})(
            <Input placeholder="请输入" />
          )}
        </FormItem>           
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="甲醛≥"
        >
          {form.getFieldDecorator('ch2oMaxVal', {initialValue: ch2oMaxVal,})(
            <Input placeholder="请输入" />
          )}
        </FormItem> 
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="滤网剩余天数"
        >
          {form.getFieldDecorator('strainerMinVal', {initialValue: strainerMinVal})(
            <Input placeholder="天" />
          )}
        </FormItem>
          
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="co2≥"
        >
          {form.getFieldDecorator('co2MaxVal')(
            <Input placeholder="请输入" />
          )}
        </FormItem>           
        
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="温度≤"
        >
          <Row>
            <Col span={11}>
              {form.getFieldDecorator('tempMaxVal', {initialValue: tempMaxVal})(
                <Input placeholder="请输入" />
              )}              
            </Col>
            <Col span={2}>
              <div className={styles.center}>≥</div>
            </Col>
            <Col span={11}>
              {form.getFieldDecorator('tempMinVal', {initialValue: tempMinVal})(
                <Input placeholder="请输入" />
              )}              
            </Col>            
          </Row>

        </FormItem>  
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="湿度≤"
        >
          <Row>
            <Col span={11}>
              {form.getFieldDecorator('humidityMaxVal', {initialValue: humidityMaxVal})(
                <Input placeholder="请输入" />
              )}              
            </Col>
            <Col span={2}>
              <div className={styles.center}>≥</div>
            </Col>
            <Col span={11}>
              {form.getFieldDecorator('humidityMinVal', {initialValue: humidityMinVal})(
                <Input placeholder="请输入" />
              )}              
            </Col>            
          </Row>
        </FormItem>  
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述信息"
        >
          {form.getFieldDecorator('descr', {initialValue: descr})(
            <TextArea/>
          )}
        </FormItem> 
      </Form>     
    </Modal>
  );
});

@connect(({ warning, loading }) => ({
  warning,
  loading: loading.effects['warning/list'],
}))
export default class WarningSetting extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '告警名称',
      dataIndex: 'name',
      width: '20%',
    }, {
      title: '描述',
      dataIndex: 'descr',
      width: '60%',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (text, record) => {
        return (
          <div>
              <a onClick={()=>this.onEditItem(record)} className={styles.left}>编辑</a>
              <a onClick={()=>this.onDeleteItem(record)} className={styles.right}>删除</a>            
          </div>
        );
      },
    }];

    this.state = {
      warningSettingData: '',
      count: 0,
      visible: false,
    };
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.props.dispatch({
      type: 'warning/list',
    });
  }  

  handleCreate = (values, flag) => {
    this.setState({
      visible: false
    });
    if (flag) {
      this.props.dispatch({
        type: 'warning/create',
        payload: {
          ...values,
        }
      });      
    } else {
      this.props.dispatch({
        type: 'warning/edit',
        payload: {
          ...values,
        }
      });      
    }
  }
  
  onDeleteItem = (record) => {
    const { dispatch } = this.props;
    confirm({
      title: '删除告警设置',
      content: '确定从列表中删除此告警设置？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'warning/delete',
            payload: {
              alarmID: record.id,
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

  onEditItem = (record) => {
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'warning/query',
        payload: {
          alarmID: record.id,
          resolve,
          reject,
        }
      });
    }).then(res => {
      console.log(res);
      this.setState({
        visible: true,
        warningSettingData: res,
      });
    })
    .catch((err) => {
      console.log(err);
    })
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
      warningSettingData: '',
    });
  }

  onSubmit = (e) => {

  }

  saveFormRef = (form) => {
    this.form = form;
  }


  render() {
    const { visible } = this.state;
    const columns = this.columns;
    const { warning } = this.props;
    var dataSource = warning.data || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
    }); 

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={this.showModal} className={styles.createButton}>创建新的告警</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <CreateWarningForm
          {...parentMethods}
          visible={visible}
          warningSettingData={this.state.warningSettingData}
        />
      </PageHeaderLayout>
    );
  }
}