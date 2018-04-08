import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;


const CreateProfitForm = Form.create()((props) => {
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
      title="创建租赁关系"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分润模式"
        >
          {form.getFieldDecorator('profitMode', {
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
          label="米微"
        >
          {form.getFieldDecorator('miwei', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <Input placeholder="请输入"  addonAfter="%" />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="客户"
        >
          {form.getFieldDecorator('custom', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Input placeholder="请输入"  addonAfter="%" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="代理"
        >
          {form.getFieldDecorator('proxy', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Input placeholder="请输入"  addonAfter="%" />
          )}
        </FormItem>     
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="价格"
        >
          {form.getFieldDecorator('price', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Input placeholder="请输入"   addonAfter="元"/>
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
          <TextArea/>
        </FormItem>            
      </Form>     
    </Modal>
  );
});

@connect(({ rent, loading }) => ({
  rent,
  loading: loading.effects['rent/listRent'],
}))
export default class RentRelate extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '分润模式',
      dataIndex: 'profitName',
    }, {
      title: '各账号分润详情',
      dataIndex: 'detail',
    },  {
      title: '价格',
      dataIndex: 'price',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.editHref}>编辑</a>
              <a href="#" className={styles.deleteHref}>删除</a>
            </Popconfirm>
        );
      },
    }];

    this.state = {
      dataSource: [],
      count: 0,
      visible: false,
    };
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.props.dispatch({
      type: 'rent/listRent',
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
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  handleCreate = () => {
    const { count, dataSource } = this.state;
    const form = this.form;
    const newData = {
        key: count,
        name: '分润1',
        rateMode: '1',
        detail: 'miwei 5%, daili 10%',
        price: '1元/小时'
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
    const { visible } = this.state;
    const columns = this.columns;

    const { rent } = this.props;
    var dataSource = rent.data || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
      if(item.prices) {
        var prices = '';
        item.prices.map((j) => {
          var p = j.price + "元/" + j.time + "分钟,";
          prices += p;
        })
        item['price'] = prices;
      }
      if(item.accounts) {
        var accounts = '';
        item.accounts.map((j) => {
          var p = j.userName  + j.ratio + "%,";
          accounts += p;
        })
        item['detail'] = accounts;        
      }
    });     

    const parentMethods = {
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={this.showModal} className={styles.createButton}>创建租赁关系</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <CreateProfitForm
          {...parentMethods}
          visible={visible}
        />
      </PageHeaderLayout>
    );
  }
}