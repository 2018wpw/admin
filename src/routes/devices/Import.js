import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col , Divider, Upload, message } from 'antd';
import styles from './Import.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import Popup , { P } from 'react-popup-master';
import { getTime } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;


@connect(({ importModel, prodModel, batchModel, loading }) => ({
  importModel,
  prodModel,
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

  renderSimpleForm(prodData, batchData, deviceTypeData, props) {
    const { form } = props;
    return (
      <Form layouts="vertical" layout="inline">
          <Row gutter={{ md: 4, lg: 8, xl: 8 }}>
              <Col md={5} sm={24}>
                <FormItem label="导入批次">
                  {form.getFieldDecorator('batchID', {
                    rules: [{ required: true, message: '请选择批次' }],
                  })(
                    <Select placeholder="请选择批次">
                      {batchData.map((item, i) => (
                        <Option  key={item.id} value={item.id}>{item.name}</Option>
                      ))}  
                    </Select>                                      
                  )}                
                </FormItem>
              </Col>
              <Col  md={5} sm={24}>
                <FormItem label="产品类型">
                  {form.getFieldDecorator('prodID', {
                    rules: [{ required: true, message: '请选择产品类型' }],
                  })(
                    <Select placeholder="请选择产品类型">
                      {deviceTypeData.map((item, i) => (
                        <Option  key={item.id} value={item.id}>{item.name}</Option>
                      ))} 
                    </Select>               
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="产品型号">
                  {form.getFieldDecorator('modelID', {
                    rules: [{ required: true, message: '请选择产品型号' }],
                  })(
                    <Select placeholder="请选择产品型号">
                      {prodData.map((item, i) => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))}                  
                    </Select>                    
                  )}                
                </FormItem>
              </Col> 
              <Col md={9} sm={24}>
                  <FormItem label="设备文件">
                    <Upload showUploadList={false} {...this.props}>
                      <Button className={styles.upload}>
                        选择上传设备文件
                      </Button>
                      <span style={{ color: 'red' }}>*</span>文件格式: Excel 模板
                    </Upload>
                  </FormItem>
              </Col>              
          </Row>

          <Row>
              <Col md={12} sm={24}>
                <Button type="primary" loading = {this.state.uploading} className={styles.formButton} htmlType="submit" onClick={this.onImport}>导入</Button>
              </Col>    
              <Col md={12} sm={24}>
                <Button type="primary" loading = {this.state.uploading} className={styles.formButton}>下载模板</Button>
              </Col>                           
          </Row>

      </Form> 
    );
  }

  onImport = () => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        console.log(fieldsValue);
        return new Promise((resolve, reject) => {
          this.props.dispatch({
            type: 'importModel/importDevice',
            payload: {
              ...fieldsValue,
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
           });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            uploading: false,
          });
          message.error("导入失败");
        });
    });    
  }

  render() {
    const props = {
      ...this.props,
      action: '//admin/device/importDevices',
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
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    }

    const { importModel, prodModel, batchModel } = props;
    var historyData = importModel.records || [];
    historyData.map((item, index)=>{
      item['key'] = index;
      item['importCount'] = item.okCount + item.failCount;
      item['time'] = getTime(item.time);
    });

    const { deviceTypeList } = prodModel;
    var deviceTypeData = deviceTypeList || [];
    deviceTypeData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });
    var batchData = batchModel.batches || [];
    batchData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();      
    });
    var prodData = prodModel.models || [];
    prodData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();      
    });

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm(prodData, batchData, deviceTypeData, props)}
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