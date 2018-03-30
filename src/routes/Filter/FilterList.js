import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card, Spin, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const SettingForm = Form.create()((props) => {
  const { visible, form, handleCreate, handleModalVisible, titleValue } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };
  return (
    <Modal
      title={titleValue}
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={titleValue}
        >
          {form.getFieldDecorator('drawCount', {
            rules: [{ required: true, message: '请输入天数' }],
          })(
            <Input placeholder="请输入"  addonAfter="天" />
          )}
        </FormItem>
      </Form>     
    </Modal>
  );
});

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
      dataIndex: 'group',
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
      dataSource: [{
        key: '0',
        sn: '1234',
        mac: '34734838',
        group: 'group1',
        initial: '3',
        middle: '4',
        high: '5'
      }],
      count: 0,
      visible: false,
      left: '5',
      loading: false
    };
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  initialSet = () => {
    this.setState({visible: true, titleValue: '初效重置'});
  }

  middleSet = () => {
    this.setState({visible: true, titleValue: '中效重置'});  
  }

  highSet = () => {
    this.setState({visible: true, titleValue: '高效重置'});
  }

  messageTip = () => {
    setTimeout(() => {
      message.success("设置成功！");
      this.setState({loading: false});
    }, 500);
  }

  handleCreate = () => {
    this.setState({visible: false});
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
    const { dataSource, visible } = this.state;
    const columns = this.columns;

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Spin spinning={this.state.loading}>
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
          </Spin>
        </Card>

        <SettingForm
          {...parentMethods}
          visible={this.state.visible}
          titleValue={this.state.titleValue}
        />
      </PageHeaderLayout>
    );
  }
}