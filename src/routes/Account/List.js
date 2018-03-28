import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col } from 'antd';
import styles from './List.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.dataColumns = [{
      title: '用户名',
      dataIndex: 'userName',
    }, {
      title: '地区',
      dataIndex: 'Zone',
    }, {
      title: '类型',
      dataIndex: 'type',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
    }, {
      title: '上级账号',
      dataIndex: 'superAccount',
    }, {
      title: '联系电话',
      dataIndex: 'tel',
    }, {
      title: '联系人',
      dataIndex: 'contact',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.left}>编辑</a>
              <a href="#" className={styles.right}>修改密码</a>
            </Popconfirm>
        );
      },
    }];


    this.state = {
      visible: false,
      dataSource: [{
        key: '0',
        userName: '张三',
        Zone: '北京',
        type: '我是谁',
        createTime: '2018-01-01',
        tel: '18600000000',
        superAccount: '上级',
        contact: '李四'
      }],
      dataCount: 1,
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
    const { historyCount, dataSource } = this.state;
    const form = this.form;
    const newData = {
        key: historyCount,
        importTime: '2018-01-01',
        importCount: '9',
        successCount: '8',
        failCount: '1',
        type: '产品类型1',
        model: 'M100',
        times: '5'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      dataCount: dataCount + 1,
      visible: false
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  renderSimpleForm() {
    return (
      <Form layouts="vertical" layout="inline">
            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
              <Col md={6} sm={24}>
                <FormItem label="用户名">
                  <Input placeholder="请输入用户名"></Input>
                </FormItem>
              </Col>
              <Col  md={6} sm={24}>
                <FormItem label="地区">
                  <Input placeholder="请输入地区"></Input>             
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="产品型号">
                  <Input placeholder="请输入手机号"></Input>                
                </FormItem>
              </Col> 
              <Col md={6} sm={24}>
                <FormItem>
                  <div layout="inline">
                    <Button type="primary" className={styles.button}>查询</Button>
                    <Button type="primary" className={styles.button}>添加</Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
      </Form> 
    );
  }

  render() {
    const { dataSource } = this.state;
    const dataColumns = this.dataColumns;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>

          <div>
            <Table bordered dataSource={dataSource} columns={dataColumns} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}