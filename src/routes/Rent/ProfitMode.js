import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';
import SelectRato from 'components/Widget';

const FormItem = Form.Item;
const { TextArea } = Input;


const CreateProfitForm = Form.create()((props) => {
  const { visible, form, handleCreate, handleModalVisible, roleList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };
  const checkSelectedRole = (rule, value, callback) => {
    console.log('checkSelectedRole', value);
    if(value.number > 0) {
      callback();
      return;
    }
    callback('分润比例大于0');
  };

  const { getFieldDecorator } = form;

  return (
    <Modal
      title="创建分润模式"
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入分润模式名称' }],
          })(
            <Input placeholder="请输入分润模式名称" />          
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色比例"
        >
          {getFieldDecorator('roleItem', {
            initialValue: { number: 0, currency: 'rmb' },
            rules: [{ required: true}],
          })(
            <SelectRato
              methodName='添加角色'
              addMethod={()=>{ console.log('add click')}}
              roleList={roleList || []}
            />
          )}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分润模式描述"
        >
          {getFieldDecorator('descr')(
            <TextArea/>
          )}
        </FormItem> 
      </Form>     
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
    this.props.dispatch({
      type: 'rent/listProfitMode',
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
  handleCreate = (values) => {
    this.props.dispatch({
      type: 'rent/createProfitMode',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
    });
  }

  showModal = () => {
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
            <Button type="primary" onClick={this.showModal} className={styles.createButton}>创建分润模式</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <CreateProfitForm
          {...parentMethods}
          visible={visible}
          roleList={this.state.roleList}
        />
      </PageHeaderLayout>
    );
  }
}