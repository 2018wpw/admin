import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card, Divider, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import DescriptionList from 'components/DescriptionList';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;

const CreateDrawForm = Form.create()((props) => {
  const { visible, form, handleDraw, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleDraw(fieldsValue);
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
          {form.getFieldDecorator('amount', {
            rules: [{ required: true, message: '请输入提款额度' }],
          })(
            <Input placeholder="请输入"  addonAfter="元" />
          )}
        </FormItem>
        <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="提款密码"
          >
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input placeholder="请输入密码" />
            )}
            <div className={styles.tipText}>提款密码与登录密码一致</div>
        </FormItem>        
      </Form>     
    </Modal>
  );
});

@connect(({ rent, loading }) => ({
  rent,
  loading: loading.effects['rent/listWithdrawRecords', 'rent/listRentOrders', 'rent/queryRentIncome'],
}))
export default class RentDetail extends React.Component {
  constructor(props) {
    super(props);

    this.orderColumns = [{
      title: '时间',
      dataIndex: 'time',
    }, {
      title: '收入情况',
      dataIndex: 'income',
    }, {
      title: 'MAC/IMEI',
      dataIndex: 'deviceID',
    }, {
      title: '分润模式',
      dataIndex: 'profitName',
    }, {
      title: '设备来源',
      dataIndex: 'owner',
    }, {
      title: '设备状态',
      dataIndex: 'rentState',
    }, {
      title: '群组',
      dataIndex: 'groupName',
    }];

    this.drawColumns = [{
      title: '提款时间',
      dataIndex: 'time',
    }, {
      title: '提款金额',
      dataIndex: 'amount',
    }, {
      title: '提款状态',
      dataIndex: 'drawState',
    }];

    this.state = {
      dataSource: [],
      count: 0,
      visible: false,
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'rent/listWithdrawRecords',
    });
    this.props.dispatch({
      type: 'rent/listRentOrders',
    });
    this.props.dispatch({
      type: 'rent/queryRentIncome',
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

  handleDraw = (values) => {
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'rent/withdraw',
        payload: {
          ...values,
          resolve: resolve,
          reject: reject,
        }
      });      
    })
    .then((res) => {
      this.setState({
        visible: false
      });
      message.success(res);
    })
    .catch((err) => console.log(err));
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
    const { visible } = this.state;
    const orderColumns = this.orderColumns;
    const drawColumns = this.drawColumns;
    const { rent } = this.props;

    const { records, orders, rentIncome } = rent;
    const ordersData = orders || [];
    ordersData.map( (item, index) => {
      item['key'] = index;
      item['rentState'] = item.rentStatus === 0 ? '租赁中' : '租赁完成';
    });

    const drawRecords = records || [];
    drawRecords.map( (item, index) => {
      drawRecords['key'] = index;
      if(item.status === 0) {
        item['drawState'] = '进行中';
      } else if(item.status === 1) {
        item['drawState'] = '已完成';
      } else {
        item['drawState'] = '失败';
      }
    });

    var totalIncome = rentIncome ? rentIncome.totalIncome : '';
    var YearIncome =  rentIncome ? rentIncome.YearIncome : '';
    var todayIncome =  rentIncome ? rentIncome.todayIncome : '';
    var balance =  rentIncome ? rentIncome.balance : '';
    var monthIncome =  rentIncome ? rentIncome.monthIncome : '';

    const parentMethods = {
      handleDraw: this.handleDraw,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <DescriptionList className={styles.headerList} size="small" col="4">
            <Description term="今日收益">{todayIncome}元</Description>
            <Description term="本月收益">{monthIncome}元</Description>
            <Description term="本年收益">{YearIncome}元</Description>
            <Description term="金额">{balance}元</Description>
          </DescriptionList>

          <div className={styles.centerButton} style={{ marginBottom: 30, marginTop: 30}} >
            <Button type="primary" onClick={this.showModal}>提款</Button>
          </div>
          <div>
            订单信息
          </div>
          
          <Divider style={{ margin: '10px 0' }} />

          <div>
            <Table bordered dataSource={ordersData} columns={orderColumns} />
          </div>

          <div style={{ marginTop: 50 }} >
            提款记录
          </div>
          
          <Divider style={{ margin: '10px 0' }} />

          <div>
            <Table bordered dataSource={drawRecords} columns={drawColumns} />
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