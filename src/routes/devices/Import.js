import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col , Divider} from 'antd';
import styles from './Import.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import Popup , { P } from 'react-popup-master';

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

  renderSimpleForm(batchData, deviceTypeData, modelData) {
    console.log('renderSimpleForm', batchData, deviceTypeData, modelData);

    const { form } =this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layouts="vertical" layout="inline">
            <Row  gutter={{ md: 4, lg: 8, xl: 8 }}>
              <Col md={5} sm={24}>
                <FormItem label="导入批次">
                  {getFieldDecorator('batchID')(
                    <Select placeholder="请选择批次"  style={{ width: 120 }}>
                      {batchData.map((item, i) => (
                         <Option value={item.id}>{item.name}</Option>
                      ))}  
                    </Select>                                      
                  )}                
                </FormItem>
              </Col>
              <Col  md={5} sm={24}>
                <FormItem label="产品类型">
                  {getFieldDecorator('prodID')(
                    <Select placeholder="请选择产品类型"  style={{ width: 120 }}>
                      {deviceTypeData.map((item, i) => (
                         <Option value={item.id}>{item.name}</Option>
                      ))}                  
                    </Select> 
                  )}                
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="产品型号">
                  {getFieldDecorator('modelID')(
                    <Select placeholder="请选择产品型号"  style={{ width: 120 }}>
                      {modelData.map((item, i) => (
                         <Option value={item.id}>{item.name}</Option>
                      ))}                  
                    </Select>                    
                  )}                
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
          //
          P.loading('Importing...');
        })
        .then( res => {
          P.loaded();
        })
        .catch(err => console.log(err));
      });    
  }

  render() {
    const { importModel, prodModel, batchModel } = this.props;
    var historyData = importModel.records || [];
    historyData.map((item, index)=>{
      item['key'] = index;
      item['importCount'] = item.okCount + item.failCount;
    });

    const { deviceTypeList } = prodModel;
    var deviceTypeData = deviceTypeList || [];
    var batchData = batchModel.batches || [];
    var modelData = prodModel.models || [];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Popup></Popup>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm(batchData, deviceTypeData, modelData)}
          </div>
          
          <div align="center">
            <Button onClick={this.onImport} type="primary" className={styles.button} >导入</Button>
            <Button type="primary"  className={styles.button} >下载模板</Button>
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