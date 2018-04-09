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

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
          <Modal
            title="创建产品类型"
            visible={visible}
            onOk={onCreate}
            onCancel={onCancel}
            okText="创建"
            cancelText="取消"
          >
          <Form layout="vertical" layout="inline">
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="产品类型" >
                  <Select placeholder="请选择" style={{ width: 300 }}>
                    <Option value="0">M100</Option>
                    <Option value="1">M200</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="产品型号">
                  <Input placeholder="请输入" style={{ width: 300 }}></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="描述信息">
                  <TextArea placeholder="请输入" style={{ width: 300 }}></TextArea>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="图片信息" layout="inline">
                  <Button className={styles.upload}>选择图片文件</Button>
                  <Button type="primary">上传</Button>
                </FormItem>                
              </Col>
            </Row>
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="链接方式">
                  <Select placeholder="请选择" style={{ width: 300 }}>
                    <Option value="0">wifi</Option>
                    <Option value="1">2g</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col md={24} sm={24}>
                <FormItem label="是否带PM2.5">
                  <Select placeholder="请选择" style={{ width: 275 }}>
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                  </Select> 
                </FormItem>  
              </Col>
            </Row>            
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
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.left}>编辑</a>
              <a href="#" className={styles.right}>删除</a>
            </Popconfirm>
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        type: '产品类型 0',
        model: 'M100',
        description: '我是描述信息',
        image: '我是图片信息',
        connectivity: 'wifi'
      }],
      count: 1,
      visible: false
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'prodModel/list',
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
        type: '产品类型',
        model: 'M00',
        description: '我是描述信息',
        image: '我是图片信息',
        connectivity: '2g'
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
            <Button className={styles.button} type="primary" onClick={this.showModal}>创建产品类型</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>

        <ProductFormCreate
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        >
          
        </ProductFormCreate>
      </PageHeaderLayout>
    );
  }
}