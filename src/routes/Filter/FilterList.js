import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card, Spin, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

let selectedRowsParam = null;

const ResetForm = Form.create()((props) => {
  const { visible, form, handleReset, handleModalVisible, titleValue } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleReset(fieldsValue, titleValue);
    });
  };
  var title;
  if(titleValue === 0) {
    title = '初效重置';
  } else if(titleValue === 1) {
    title = '中效重置';
  } else {
    title = '高效重置';
  }
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={title}
        >
          {form.getFieldDecorator('strainerTime', {
            rules: [{ required: true, message: '请输入天数' }],
          })(
            <Input placeholder="请输入"  addonAfter="天" />
          )}
        </FormItem>
      </Form>     
    </Modal>
  );
});

@connect(({ strainer, loading }) => ({
  strainer,
  loading: loading.effects['strainer/queryStrainerList'],
}))
export default class FilterList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'SN',
      dataIndex: 'sn',
    }, {
      title: 'MAC/IMEI',
      dataIndex: 'mac',
    }, {
      title: '群组',
      dataIndex: 'groupName',
    }, {
      title: '初效剩余',
      dataIndex: 'initial',
    }, {
      title: '中效剩余',
      dataIndex: 'middle',
    }, {
      title: '高效剩余',
      dataIndex: 'high',
    }];

    this.state = {
      visible: false,
      left: '5',
      loading: false,
      selectedRows: [],
    };
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.props.dispatch({
      type: 'strainer/queryStrainerList',
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  initialSet = () => {
    if(selectedRowsParam === null || selectedRowsParam.length === 0) {
      message.warning('尚未选择设备！');
    } else {
      this.setState({visible: true, titleValue: 0});
    }
  }

  middleSet = () => {
    if(selectedRowsParam === null || selectedRowsParam.length === 0) {
      message.warning('尚未选择设备！');
    } else {
      this.setState({visible: true, titleValue: 1});
    }    
  }

  highSet = () => {
    if(selectedRowsParam === null || selectedRowsParam.length === 0) {
      message.warning('尚未选择设备！');
    } else {
      this.setState({visible: true, titleValue: 2});
    }    
  }

  handleReset = (values, index) => {
    var devices = new Array();
    selectedRowsParam.map((item, index) => {
      devices[index] = item.deviceID;
    })
    this.setState({visible: false});
    this.props.dispatch({
      type: 'strainer/resetStrainer',
      payload: {
        ...values,
        strainerIndex: index,
        devices: devices,
      }
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


  render() {
    const { visible } = this.state;
    const columns = this.columns;
    const { strainer } = this.props;

    var dataSource = strainer.devices || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
      if (item.strainerStatus.index === 0) {
        item['initial'] = item.strainerStatus.reaminingTime;
      } else if(item.strainerStatus.index === 1) {
        item['middle'] = item.strainerStatus.reaminingTime;
      } else {
        item['high'] = item.strainerStatus.reaminingTime;
      }
    });

    const parentMethods = {
      handleReset: this.handleReset,
      handleModalVisible: this.handleModalVisible,
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedRowsParam = selectedRows;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
            <div>
              <div style={{marginBottom: 10}}>
                滤网报警剩余天数 <span style={{ color: 'red' }}> {this.state.left} 天</span>
              </div>
              <div>
                <Table rowSelection={rowSelection} bordered dataSource={dataSource} columns={columns} />
              </div>
              <div>
                <a onClick={this.initialSet}>初效重置</a>
                <a onClick={this.middleSet} style={{marginRight: 20, marginLeft: 20}}>中效重置</a>
                <a onClick={this.highSet}>高效重置</a>                
              </div>            
            </div>
        </Card>

        <ResetForm
          {...parentMethods}
          visible={this.state.visible}
          titleValue={this.state.titleValue}
        />
      </PageHeaderLayout>
    );
  }
}