import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';
import RentSubForm from './RentSubForm'

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;


const CreateProfitForm = Form.create()((props) => {
  const { visible, form, handleCreate, handleModalVisible, handleEdit, profitList, formData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(formData === null) {
        handleCreate(fieldsValue);
      } else {
        handleEdit(fieldsValue);
      }
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible();
  };
  return (
    <Modal
      title="创建租赁关系"
      okText='创建'
      cancelText='取消'      
      visible={visible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <RentSubForm
        profitList={profitList}
        form={form}
        formData={formData}
      />  
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
            <div>
              <a onClick={()=>{this.onEdit(record)}} className={styles.left}>编辑</a>
              <a onClick={()=>{this.onDelete(record)}} className={styles.right}>删除</a>
            </div>  
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

  onDelete = (record) => {
    console.log('onDelete', record);
    const { dispatch } = this.props;
    confirm({
      title: '删除租赁关系',
      content: '确定从租赁列表中删除此配置？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'rent/deleteRent',
            payload: {
              profitID: record.id,
              resolve: resolve,
              reject: reject,
            }
          });
        })
        .catch((err) => alert("接口未实现"));        
      },
      onCancel() {},
    });
  } 

  onEdit = (record) => {
    console.log('onEdit', record);
    this.showModal(record);
  }

  handleCreate = (values) => {
    this.props.dispatch({
      type: 'rent/createRent',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
      formData: null,
    });
  }
  handleEdit = (values) => {
    this.props.dispatch({
      type: 'rent/editRent',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
      formData: null,
    });
  }
  showModal = (formData) => {
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'rent/getProfitList',
        payload: {
          resolve: resolve,
          reject: reject,
        },
      });
    })
    .then( res => {
      this.setState({
        visible: true,
        formData: formData,
        profitList: res.data || [],
      });
    })
    .catch( err => {
      console.log(err);
    });
  }


  handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
  }

  handleModalVisible = () => {
    this.setState({
      visible: false,
    });
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
      handleEdit:this.handleEdit,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={()=>this.showModal(null)} className={styles.createButton}>创建租赁关系</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <CreateProfitForm
          {...parentMethods}
          visible={visible}
          profitList={this.state.profitList}
          formData={this.state.formData}
        />
      </PageHeaderLayout>
    );
  }
}