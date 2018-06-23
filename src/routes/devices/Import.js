import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col , Divider, Upload, message } from 'antd';
import styles from './Import.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import Popup , { P } from 'react-popup-master';
import { getTime } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;


@connect(({ importModel, batchModel, loading }) => ({
  importModel,
  batchModel,
  loading: loading.effects['importModel/queryImportHistory'],  
}))
@Form.create()
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
      fileList: [],
      uploading: false,
      importBatchData: {
        id: '',
        prodName: '',
        modelName: '',
      }
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
    this.props.dispatch({
      type: 'prodModel/getDeviceTypeList',
    });
    this.props.dispatch({
      type: 'batchModel/list',
    });
    this.props.dispatch({
      type: 'prodModel/list',
    });            
  }

  handleBatchChange = (value, batchData) => {
    for (var i=0; i<batchData.length; i++) {
      if (batchData[i].id === value) {
        this.setState({
          importBatchData: {
            id: batchData[i].id,
            prodName: batchData[i].prodName,
            modelName: batchData[i].modelName,
          }
        });
        break;
      }
    }
  }

  renderSimpleForm(batchData) {
    const options = {
      action: '//common/file/upload',
      onRemove: (file) => {
        console.log('onRemove', file);
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        console.log('beforeUpload', file);
        this.setState(({ fileList }) => ({
          fileList: [file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };    
    const { form } = this.props;
    return (
      <Form>
          <Row gutter={{ md: 4, lg: 8, xl: 8 }}>
              <Col md={7} sm={24}>
                <FormItem label="导入批次">
                  {form.getFieldDecorator('batchID', {
                    rules: [{ required: true, message: '请选择批次' }],
                  })(
                    <Select placeholder="请选择批次" onChange={(value) => {this.handleBatchChange(value, batchData)}}>
                      {batchData.map((item, i) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  )}                
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="产品类型">
                  <div>{this.state.importBatchData.prodName}</div>
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="产品型号">
                  <div>{this.state.importBatchData.modelName}</div>               
                </FormItem>
              </Col> 
              <Col md={7} sm={24}>
                  <FormItem label="设备文件">
                    <Upload {...options}>
                      <Button className={styles.upload}>
                        选择上传 Excel 模板文件
                      </Button>
                    </Upload>
                  </FormItem>
              </Col>              
          </Row>

          <Row>
              <div align="center">
                <Button type="primary" loading = {this.state.uploading} className={styles.button} htmlType="submit" onClick={this.handleImport}>导入</Button>
                <Button type="primary" className={styles.button} >下载模板</Button>
              </div>
          </Row>

      </Form> 
    );
  }

  handleImport = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        console.log(fieldsValue);
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('file', file);
        });
        formData.append('batchID', fieldsValue.batchID);

        this.setState({
          uploading: true,
        });

        return new Promise((resolve, reject) => {
          this.props.dispatch({
            type: 'importModel/importDevice',
            payload: {
              formData: formData,
              resolve: resolve,
              reject: reject,
            }
          });
          this.setState({
            uploading: true,
          });
        })
        .then( res => {
          this.setState({
            uploading: false,
            fileList: [],
            importBatchData: {
              id: '',
              prodName: '',
              modelName: '',
            },
          });
          message.success('导入成功');
        })
        .catch(err => {
          this.setState({
            uploading: false,
          });
          message.error("导入失败:", err);
        });
    });    
  }

  render() {
    const { batchModel, importModel } = this.props;
    var historyData = importModel.records || [];
    historyData.map((item, index)=>{
      item['key'] = index;
      item['importCount'] = item.okCount + item.failCount;
      item['time'] = getTime(item.time);
    });

    var batchData = batchModel.batches || [];
    batchData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();      
    });
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm(batchData)}
          </div>
          
          <div>
            <p className={styles.p}>导入历史记录</p>
            <Divider style={{ margin: '15px 0' }} />
            <Table bordered dataSource={historyData} columns={this.historyColumns} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}