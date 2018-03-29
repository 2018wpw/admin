import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import DescriptionList from 'components/DescriptionList';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;

const CreateDrawForm = Form.create()((props) => {
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
      title="提款"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="提款金额"
        >
          {form.getFieldDecorator('drawCount', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <Input placeholder="请输入"  addonAfter="元" />
          )}
        </FormItem>
      </Form>     
    </Modal>
  );
});


export default class RentDetail extends React.Component {
  constructor(props) {
    super(props);

    this.orderColumns = [{
      title: '时间',
      dataIndex: 'date',
    }, {
      title: '收入情况',
      dataIndex: 'earning',
    }, {
      title: '设备sn',
      dataIndex: 'sn',
    }, {
      title: '分润模式',
      dataIndex: 'profitMode',
    }, {
      title: '设备来源',
      dataIndex: 'from',
    }, {
      title: '设备状态',
      dataIndex: 'deviceState',
    }, {
      title: '群组',
      dataIndex: 'group',
    }];

    this.drawColumns = [{
      title: '提款时间',
      dataIndex: 'date',
    }, {
      title: '提款金额',
      dataIndex: 'count',
    }];

    this.state = {
      dataSource: [],
      count: 0,
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

  handleCreate = () => {
    const { count, dataSource } = this.state;
    const form = this.form;
    const newData = {
        key: count,
        name: '分润1',
        rate: '10%',
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
    const orderColumns = this.orderColumns;
    const drawColumns = this.drawColumns;

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <DescriptionList className={styles.headerList} size="small" col="4">
            <Description term="今日收益">1000元</Description>
            <Description term="本月收益">2000元</Description>
            <Description term="本年收益">50000元</Description>
            <Description term="金额">2000元</Description>
          </DescriptionList>

          <div className={styles.centerButton} style={{ marginBottom: 30, marginTop: 30}} >
            <Button type="primary" onClick={this.showModal}>提款</Button>
          </div>
          <div>
            订单信息
          </div>
          
          <Divider style={{ margin: '10px 0' }} />

          <div>
            <Table bordered dataSource={dataSource} columns={orderColumns} />
          </div>

          <div style={{ marginTop: 50 }} >
            提款记录
          </div>
          
          <Divider style={{ margin: '10px 0' }} />

          <div>
            <Table bordered dataSource={dataSource} columns={drawColumns} />
          </div>               
        </Card>

        <CreateDrawForm
          {...parentMethods}
          visible={visible}
        />
      </PageHeaderLayout>
    );
  }
}