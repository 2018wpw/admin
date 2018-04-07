import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col } from 'antd';
import styles from './Import.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ importModel, loading }) => ({
  importModel,
  loading: loading.effects['importModel/queryImportHistory'],  
}))
export default class ImportDevices extends React.Component {
  constructor(props) {
    super(props);

    this.historyColumns = [{
      title: '导入时间',
      dataIndex: 'time',
    }, {
      title: '导入数量',
      dataIndex: 'importCount',
    }, {
      title: '成功数',
      dataIndex: 'okCount',
    }, {
      title: '失败数',
      dataIndex: 'failCount',
    }, {
      title: '产品类型',
      dataIndex: 'prodName',
    }, {
      title: '产品型号',
      dataIndex: 'modelName',
    }, {
      title: '批次',
      dataIndex: 'batchName',
    }];


    this.state = {
      visible: false,
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

  componentDidMount() {
    this.props.dispatch({
      type: 'importModel/queryImportHistory',
    });
  }  

  handleCreate = () => {
    const form = this.form;
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
    const { importModel } = this.props;
    var historyData = importModel.records || [];
    historyData.map((item, index)=>{
      item['key'] = index;
      item['importCount'] = item.okCount + item.failCount;
    });

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
            <Table bordered dataSource={historyData} columns={this.historyColumns} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}