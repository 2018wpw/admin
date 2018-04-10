import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import styles from './Product.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

const ProductFormCreate = Form.create()(
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
            title="创建产品类型"
            visible={visible}
            onOk={okHandle}
            onCancel={onCancel}
            okText="创建"
            cancelText="取消"
          >
          <Form className={styles.formItemGap}>
            
            <FormItem label="产品类型" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('prodID', {
                rules: [{ required: true, message: '请选择产品类型' }],
              })(
                <Select placeholder="请选择产品类型">
                  <Option value="0">是</Option>
                  <Option value="1">否</Option>
                </Select>               
              )}
            </FormItem>              
            <FormItem label="产品型号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请选择产品型号' }],
              })(
                <Input placeholder='请输入产品型号'></Input>               
              )}
            </FormItem>                  
           
            <FormItem label="图片信息" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('imageID')(
                <span>
                  <Button style={{width: '70%'}}>选择图片文件</Button>
                  <Button  style={{marginLeft: '5%'}} type='primary'>上传</Button>
                </span>
              )}                
            </FormItem>

            <FormItem label="链接方式" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('connWay', {initialValue: '0'},)(
                <Select placeholder="请选择链接方式">
                  <Option value="0">WIFI</Option>
                  <Option value="1">2G</Option>
                </Select>               
              )}
            </FormItem>
            <FormItem label="是否带PM2.5" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('withDetector', {initialValue: '0'}, )(
                <Select placeholder="请选择产品型号">
                  <Option value="0">是</Option>
                  <Option value="1">否</Option>
                </Select>               
              )}
            </FormItem>    
            <FormItem label="描述信息" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('descr')(
                <TextArea placeholder="请输入描述信息"></TextArea>              
              )}
            </FormItem>                                    
          </Form>
          </Modal>
      );
    }
);


const ProductFormEdit = Form.create()(
  (props) => {
    const {editVisible, onCancel, onCreate, form, editData} = props;
    const { getFieldDecorator } = form;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        onCreate(fieldsValue);
      });
    };    
    console.log('edit form ', editData);

    return (
          <Modal
            title="编辑产品类型"
            visible={editVisible}
            onOk={okHandle}
            onCancel={onCancel}
          >
          <Form className={styles.formItemGap}>
            
            <FormItem label="产品类型" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>
                {editData.prodInfo.name}
              </div>
            </FormItem>              
            <FormItem label="产品型号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>
                {editData.name}
              </div>
            </FormItem>                  
           
            <FormItem label="图片信息" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('imageID')(
                <span>
                  <Button style={{width: '70%'}}>{editData.imageID}</Button>
                  <Button  style={{marginLeft: '5%'}} type='primary'>上传</Button>
                </span>
              )}                
            </FormItem>

            <FormItem label="链接方式" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>
                {editData.connWay === 0 ? 'WIFI' : '2G'}
              </div>
            </FormItem>
            <FormItem label="是否带PM2.5" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              <div>
                {editData.connWay === 1 ? '是' : '否'}
              </div>            
            </FormItem>    
            <FormItem label="描述信息" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
              {form.getFieldDecorator('descr')(
                <TextArea placeholder={editData.descr}></TextArea>              
              )}
            </FormItem>                                    
          </Form>
          </Modal>
      );
    }
);


@connect(({ prodModel, loading }) => ({
  prodModel,
  loading: loading.effects['prodModel/list'],
}))
export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '产品类型',
      dataIndex: 'prodName',
    }, {
      title: '产品型号',
      dataIndex: 'name',
    }, {
      title: '描述信息',
      dataIndex: 'descr',
    }, {
      title: '图片信息',
      dataIndex: 'imageID',
    }, {
      title: '链接方式',
      dataIndex: 'connWay',
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
      editVisible: false,
      editData: {
        prodInfo: '',
      },
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'prodModel/list',
    });
  }

  onEditItem = (record) => {
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'prodModel/query',
        payload: {
          modelID: record.id,
          resolve,
          reject,
        }
      });
    }).then(res => {
      console.log(res);
      this.setState({
        editVisible: true,
        editData: res,
      });
    })
    .catch((err) => {
      console.log(err);
    })
  }  

  handleEdit = (values) => {
    this.props.dispatch({
      type: 'prodModel/edit',
      payload: {
        ...values,
      }
    });
    this.setState({
      editVisible: false
    });
  }  

  onDeleteItem = (record) => {
    this.props.dispatch({
        type: 'prodModel/deleteApi',
        payload: {
          modelID: record.id,
        }
      });
  }

  handleCreate = (values) => {
    this.props.dispatch({
      type: 'prodModel/create',
      payload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
    });
  }

  handleEdit = (values) => {
    this.props.dispatch({
      type: 'prodModel/edit',
      payload: {
        ...values,
      }
    });
    this.setState({
      editVisible: false,
    });
  }

  showCreateModal = () => {
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

  onSubmit = (e) => {

  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    const columns = this.columns;
    const { prodModel } = this.props;
    var dataSource = prodModel.models || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
      item['prodName'] = item.prodInfo.name;
    });     
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.button} type="primary" onClick={this.showCreateModal}>创建产品类型</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <ProductFormCreate
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />

        <ProductFormEdit
          ref={this.saveFormRef}
          editVisible={this.state.editVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleEdit}
          editData={this.state.editData}
        />
                    
      </PageHeaderLayout>
    );
  }
}