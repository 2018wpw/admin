import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';
import SelectRato from 'components/Widget';
import ProfitSubForm from './ProfitSubForm';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;


const ProfitForm = Form.create()((props) => {
  const { visible, form, handleCreate, handleModalVisible, roleList, formData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log('modal submit', fieldsValue);
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible();
  };

  const { getFieldDecorator } = form;

  return (
    <Modal
      title="创建分润模式"
      visible={visible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <ProfitSubForm
        form={form}
        formData={formData}
        roleList={roleList}
      />
    </Modal>
  );
});

@connect(({ rent, loading, account }) => ({
  rent,
  account,
  loading: loading.effects['rent/listProfitMode'],
}))
export default class ProfitMode extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '角色比例',
      dataIndex: 'roleRatios',
    }, , {
      title: '分润模式描述',
      dataIndex: 'descr',
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
      count: 0,
      visible: false,
      formData: true,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'rent/listProfitMode',
    });
  }

  onEdit = (record) => {
    console.log('onEdit', record);
    this.showModal(record);
  }

  onDelete = (record) => {
    console.log('onDelete', record);
    const { dispatch } = this.props;
    confirm({
      title: '删除分润模式',
      content: '确定从分润列表中删除此配置？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'rent/deleteProfitMode',
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

  handleEdit = (values) => {
    this.props.dispatch({
      type: 'rent/editProfitMode',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
      formData: null,
    });
  }

  handleCreate = (values) => {
    this.props.dispatch({
      type: 'rent/createProfitMode',
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
        type: 'account/getRoleList',
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
        roleList: res.roles,
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
      if(item.ratios && item.ratios.length !== 0) {
        item['roleRatios'] = '';
        item.ratios.map( (j) => {
          item['roleRatios'] += j.roleName + j.ratio + '% ';
        })
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
            <Button type="primary" onClick={()=> this.showModal(null)} className={styles.createButton}>创建分润模式</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <ProfitForm
          {...parentMethods}
          visible={visible}
          roleList={this.state.roleList}
          formData={this.state.formData}
        />
      </PageHeaderLayout>
    );
  }
}