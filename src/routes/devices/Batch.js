import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col } from 'antd';
import styles from './Batch.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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
            title="创建批次"
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

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '批次名称',
      dataIndex: 'name',
    }, {
      title: '描述信息',
      dataIndex: 'description',
    }, {
      title: '产品类型',
      dataIndex: 'type',
    }, {
      title: '产品型号',
      dataIndex: 'model',
    }, {
      title: '设备数量',
      dataIndex: 'count',
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
        name: '批次名称 0',
        model: 'M100',
        description: '我是描述信息',
        count: '100',
        type: '产品类型1'
      }],
      count: 1,
      visible: false
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
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  handleCreate = () => {
    const { count, dataSource } = this.state;
    const form = this.form;
    const newData = {
        key: count,
        name: '批次名称 0',
        model: 'M100',
        description: '我是描述信息',
        count: '100',
        type: '产品类型1'
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
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <PageHeaderLayout>
        <div>
          <Button className={styles.button} type="primary" onClick={this.showModal}>创建批次</Button>
          <Table bordered dataSource={dataSource} columns={columns} />
        </div>

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