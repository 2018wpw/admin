import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import styles from '../Common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { prd_type } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

let _gProdData = [];

const BatchFormCreate = Form.create()(
  (props) => {
    const {visible, onCancel, onCreate, form} = props;
    const { getFieldDecorator } = form;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        onCreate(fieldsValue);
      });
    };    

    return (
          <Modal
            title="创建批次"
            visible={visible}
            onOk={okHandle}
            onCancel={onCancel}
            okText="创建"
            cancelText="取消"
          >
          <Form className={styles.formItemGap}>
            <FormItem label="批次名称" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入批次名称' }],
              })(
                <Input placeholder="请输入批次名称"></Input>
              )}                
            </FormItem>
            
            <FormItem label="产品类型" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('prodName', {initialValue: '0'}, {
                rules: [{ required: true, message: '请选择产品类型' }],
              })(
                <Select placeholder="请选择产品类型">
                  <Option value="0">{prd_type[0]}</Option>
                  <Option value="1">{prd_type[1]}</Option>
                </Select>
              )}
            </FormItem>              
            <FormItem label="产品型号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('modelID', {
                rules: [{ required: true, message: '请选择产品型号' }],
              })(
                <Select placeholder="请选择产品型号">
                  {
                    _gProdData.map((item, i) => (
                      <Option key={i} value={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>               
              )}
            </FormItem>                  
            <FormItem label="产品描述" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('descr')(
                <TextArea placeholder="请输入产品描述"></TextArea>              
              )}
            </FormItem>
           
          </Form>
          </Modal>
      );
    }
);

const BatchFormEdit = Form.create()(
  (props) => {
    const {visible, onCancel, onCreate, form, editingData } = props;
    const { getFieldDecorator } = form;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        onCreate(fieldsValue, editingData.id);
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      onCancel();
    };

    return (
          <Modal
            title="编辑批次"
            visible={visible}
            onOk={okHandle}
            onCancel={cancelHandle}
          >
          <Form className={styles.formItemGap}>
            <FormItem label="批次名称" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>{editingData.name}</div>            
            </FormItem>
            <FormItem label="产品类型" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>{editingData.prodName}</div>
            </FormItem>              
            <FormItem label="产品型号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>{editingData.modelName}</div>
            </FormItem>                  
            <FormItem label="产品描述" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('descr')(
                <TextArea placeholder={editingData.descr}></TextArea>              
              )}
            </FormItem>          
          </Form>
          </Modal>
      );
    }
);


@connect(({ batchModel, prodModel, loading }) => ({
  batchModel,
  prodModel,
  loading: loading.effects['batchModel/list'],
}))
export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '批次名称',
      dataIndex: 'name',
    }, {
      title: '描述信息',
      dataIndex: 'descr',
    }, {
      title: '产品类型',
      dataIndex: 'prodName',
    }, {
      title: '产品型号',
      dataIndex: 'modelName',
    }, {
      title: '设备数量',
      dataIndex: 'count',
    }, {
      title: '操作',
      dataIndex: 'operation',
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
      visible: false,
      editingData: '',
      editVisible: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'batchModel/list',
    });
    this.props.dispatch({
      type: 'prodModel/list',
    });
  }

  onEditItem = (record) => {
    this.setState({
        editVisible: true,
        editingData: record,
    });
  }  

  onDeleteItem = (record) => {
    this.props.dispatch({
        type: 'batchModel/deleteApi',
        payload: {
          batchID: record.id,
        }
      });
  }

  handleCreate = (values) => {
    this.props.dispatch({
      type: 'batchModel/create',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false
    });
  }

  handleEdit = (values, bacthID) => {
    this.props.dispatch({
      type: 'batchModel/edit',
      payload: {
        ...values,
        batchID: bacthID,
      }
    });
    this.setState({
      editVisible: false
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
        editVisible: false,
      });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    const columns = this.columns;
    const { batchModel, prodModel } = this.props;

    var dataSource = batchModel.batches || [];
    dataSource.map((item, index)=>{
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });

    var prodData = prodModel.models || [];
    prodData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });
    _gProdData = prodData;
    console.log('_gProdData', _gProdData);

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.createButton} type="primary" onClick={this.showModal}>创建批次</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>
        </Card>

        <BatchFormCreate
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        <BatchFormEdit
          ref={this.saveFormRef}
          visible={this.state.editVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleEdit}
          editingData={this.state.editingData}
        />

      </PageHeaderLayout>
    );
  }
}