import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col } from 'antd';
import styles from './Import.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.historyColumns = [{
      title: '导入时间',
      dataIndex: 'importTime',
    }, {
      title: '导入数量',
      dataIndex: 'importCount',
    }, {
      title: '成功数',
      dataIndex: 'successCount',
    }, {
      title: '失败数',
      dataIndex: 'failCount',
    }, {
      title: '产品类型',
      dataIndex: 'type',
    }, {
      title: '产品型号',
      dataIndex: 'model',
    }, {
      title: '批次',
      dataIndex: 'times',
    }];


    this.state = {
      visible: false,
      historyData: [{
        key: '0',
        importTime: '2018-01-01',
        importCount: '9',
        successCount: '8',
        failCount: '1',
        type: 'M100',
        model: 'M100',
        times: '5'
      }],
      historyCount: 1,
    };
  }
  onCellChange = (key, dataIndex) => {
    return (value) => {
      const historyData = [...this.state.historyData];
      const target = historyData.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ historyData });
      }
    };
  }

  handleCreate = () => {
    const { historyCount, historyData } = this.state;
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
      historyData: [...historyData, newData],
      historyCount: historyCount + 1,
      visible: false
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  renderSimpleForm() {
    return (
      <Form layouts="vertical" layout="inline">
            <Row  gutter={{ md: 4, lg: 8, xl: 8 }}>
              <Col md={5} sm={24}>
                <FormItem label="导入批次">
                  <Select placeholder="请选择"  style={{ width: '100%' }}>
                    <Option value="0">1</Option>
                    <Option value="1">2</Option>
                  </Select>                  
                </FormItem>
              </Col>
              <Col  md={5} sm={24}>
                <FormItem label="产品类型">
                  <Select placeholder="请选择"  style={{ width: '100%' }}>
                    <Option value="0">M100</Option>
                    <Option value="1">M200</Option>
                  </Select>                  
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="产品型号">
                  <Select placeholder="请选择"  style={{ width: '100%' }}>
                    <Option value="0">M100</Option>
                    <Option value="1">M200</Option>
                  </Select>                  
                </FormItem>
              </Col> 
              <Col md={9} sm={24}>
                <FormItem label="设备文件">
                  <div layout="inline" className={styles.upload}>
                    <Button className={styles.upload}>选择上传设备文件</Button>
                    <span style={{ color: 'red' }}>*</span>文件格式: Excel 模板
                  </div>
                </FormItem>
              </Col>
            </Row>
      </Form> 
    );
  }

  render() {
    const { historyData } = this.state;
    const columns = this.columns;
    const historyColumns = this.historyColumns;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          
          <div align="center">
            <Button type="primary" className={styles.button} >导入</Button>
            <Button type="primary"  className={styles.button} >下载文件</Button>
          </div> 

          <div>
            <p className={styles.p}>导入历史记录</p>
            <hr className={styles.line} />
            <Table bordered dataSource={historyData} columns={historyColumns} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}