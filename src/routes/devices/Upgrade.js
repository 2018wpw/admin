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
      title: '升级包',
      dataIndex: 'package',
    }, {
      title: '描述信息',
      dataIndex: 'description',
    }, {
      title: '版本号',
      dataIndex: 'version',
    }, {
      title: '产品类型',
      dataIndex: 'type',
    },  {
      title: '产品型号',
      dataIndex: 'model',
    }, {
      title: '上传时间',
      dataIndex: 'uploadTime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.left}>升级</a>
              <a href="#" className={styles.right}>删除</a>
            </Popconfirm>
        );
      },
    }];

    this.historyColumns = [{
      title: '开始时间',
      dataIndex: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
    }, {
      title: '设备数量',
      dataIndex: 'deviceCount',
    }, {
      title: '成功',
      dataIndex: 'success',
    }, {
      title: '失败',
      dataIndex: 'fail',
    }, {
      title: '未完成',
      dataIndex: 'uncomplete',
    }, {
      title: '批次',
      dataIndex: 'times',
    }];


    this.state = {
      dataSource: [{
        key: '0',
        package: '升级包0',
        description: '我是描述信息',
        version: '100',
        type: '产品类型1',
        model: '产品型号1',
        uploadTime: '2018-01-01'
      }],
      count: 1,
      visible: false,
      historyData: [{
        key: '0',
        startTime: '2018-01-01',
        endTime: '2018-01-01',
        deviceCount: '100',
        success: 'YES',
        fail: 'NO',
        uncomplete: 'NO',
        times: '5'
      }],
      historyCount: 1,
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
        package: '升级包0',
        description: '我是描述信息',
        version: '100',
        type: '产品类型1',
        model: '产品型号1',
        time: '2018-01-01'
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
    const { dataSource, historyData } = this.state;
    const columns = this.columns;
    const historyColumns = this.historyColumns;

    return (
      <PageHeaderLayout>
        <div>
          <Button className={styles.button} type="primary" onClick={this.showModal}>创建升级包</Button>
          <Table bordered dataSource={dataSource} columns={columns} />
          <p className={styles.p}>升级记录</p>
          <Table bordered dataSource={historyData} columns={historyColumns} />
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