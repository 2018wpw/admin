import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider, Upload, message } from 'antd';
import styles from '../Common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { uploadFileUrl } from '../../services/common';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

const CreateUpgradePackageForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCratePackage, form, selectedFile, uploading, handleUpload, beforeUpload } = props;
    const { getFieldDecorator } = form;
    const options = {
      action: 'ReactUploadFile',
      beforeUpload: (file) => {
        beforeUpload(file);
        return false;
      },
      fileList: selectedFile === '' ? [] : new Array(selectedFile),
    };

    const onCreate = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        onCratePackage(fieldsValue);
      });
    }

    return (
      <Modal
        title="创建升级包"
        visible={visible}
        onOk={onCreate}
        onCancel={() => onCancel()}
        okText="创建"
        cancelText="取消"
      >
        <Form className={styles.formItemGap}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="版本号"
          >
            {form.getFieldDecorator('verFW', {
              rules: [{ required: true, message: '请输入版本号' }],
            })(
              <Input placeholder="请输入版本号" />
            )}
          </FormItem>

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品类型"
          >
            {form.getFieldDecorator('modelID', {
              rules: [{ required: true, message: '请输选择类型' }],
            })(
              <Select placeholder="请输选择类型">
              {
                deviceTypeData.map((item, index) => (
                  <Select.Option value={item.id}>{item.name}</Select.Option>                  
                ))
              }  
              </Select>          
            )}
          </FormItem> 

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="上传升级包"
          >
            {form.getFieldDecorator('packageFileID', {
              rules: [
                { required: true, message: '请先上传升级包'},
                {
                  validator(rule, values, callback) {
                    //TODO
                    callback();
                  }
                }
              ],
            })(
              <Row>
                <Col md={18} sm={24}>
                  <Upload {...options} >
                    <Button>选择升级包</Button>
                  </Upload>  

                </Col>
                <Col md={6} sm={24}>
                  <Button 
                    type='primary'
                    loading={uploading}
                    onClick={handleUpload}
                  >上传</Button>              
                </Col>
              </Row>
            )}

          </FormItem>                    

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述信息"
          >
            {form.getFieldDecorator('descr')(
              <Input.TextArea placeholder="请输入描述信息" />
            )}
          </FormItem>      
        </Form>   
      </Modal>
    );
});

const StartUpgradeForm = Form.create()(
  (props) => {
    const { visible, onCancel, handleUpgrade, form, deviceID } = props;
    const onOk = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpgrade(fieldsValue, deviceID);
      });
    };
    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };
    return (
      <Modal
        title="升级"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="升级"
        cancelText="取消"      
      >
        <Form className={styles.formItemGap}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="批次"
          >
            {form.getFieldDecorator('batchID', {
              rules: [{ required: true, message: '请输选择批次' }],
            })(
              <Select placeholder="请输选择批次">
              {
                batchData.map((item, index) => (
                  <Select.Option value={item.id}>{item.name}</Select.Option>                  
                ))
              }
              </Select>
            )}
          </FormItem>      
        </Form>      
       
      </Modal>
    );
});

let deviceTypeData;
let batchData;

@connect(({ upgrade, loading, prodModel, batchModel }) => ({
  upgrade,
  prodModel,
  batchModel,
}))
export default class UpgradeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      uploading: false,
      selectedFile: '',
      upgradeVisible: false,
      deviceID: '',
    };

    this.columns = [{
        title: '升级包',
        dataIndex: 'id',
        key: 'id',        
      }, {
        title: '描述信息',
        dataIndex: 'descr',
        key: 'descr', 
      }, {
        title: '版本号',
        dataIndex: 'verFW',
        key: 'verFW', 
      }, {
        title: '产品类型',
        dataIndex: 'prodName',
        key: 'prodName', 
      },  {
        title: '产品型号',
        dataIndex: 'modelName',
        key: 'modelName', 
      }, {
        title: '上传时间',
        dataIndex: 'uploadTime',
        key: 'uploadTime', 
      }, {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
          <div>
              <a onClick={()=>this.onUpgrade(record)} className={styles.left}>升级</a>
              <a onClick={()=>this.onDeleteItem(record)} className={styles.right}>删除</a>            
          </div>
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
        dataIndex: 'batchName',
    }];
  }  


  componentDidMount() {
    this.props.dispatch({
      type: 'upgrade/quryOTAPackages',
    });
    this.props.dispatch({
      type: 'upgrade/quryOTAHistory',
    });
    this.props.dispatch({
      type: 'batchModel/list',
    });
    this.props.dispatch({
      type: 'prodModel/getDeviceTypeList',
    });          
  }

  handleUpgrade = (values, deviceID) => {
    this.props.dispatch({
      type: 'upgrade/requestOTA',
      payload: {
        deviceID: deviceID,
        ...values,
      },
    });
    this.setState({
      upgradeVisible: false
    });
  }  

  onUpgrade = (record) => {
    this.setState({
      upgradeVisible: true,
      deviceID: record.id,
    });    
  }

  onDeleteItem = (record) => {
    const { dispatch } = this.props;
    confirm({
      title: '删除升级包',
      content: '确定从列表中删除此升级包？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'upgrade/deleteOTAPackage',
            payload: {
              packageID: record.id,
              resolve: resolve,
              reject: reject,
            }
          });
        })
        .catch((err) => console.log(err));        
      },
      onCancel() {},
    });
  }

  handleCreatePackage = (values) => {
    this.props.dispatch({
      type: 'upgrade/createOTAPackage',
      palyload: {
        ...values,
      }
    });
    this.setState({
      visible: false,
    });    
  }

  showCreateUpgradeModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
        upgradeVisible: false,
      });
  }

  beforeUpload = (file) => {
    this.setState({
      selectedFile: file,
    });
  }

  handleUpload = () => {
    this.setState({
      uploading: true,
    });
    this.props.dispatch({
      type: 'upgrade/uploadPackage',
      payload: {
        file: this.state.selectedFile,
      }
    }).then( () => {
      console.log('handleUpload', 'ok');
      this.setState({
        uploading: false,
        selectedFile: '',
      });
    });  
  }

  render() {
    const columns = this.columns;
    const { upgrade, prodModel, batchModel } = this.props;
    var dataSource = upgrade.packages || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
    });
  
    var historyData = upgrade.records || [];
    const historyColumns = this.historyColumns;
    historyData.map((item, index)=>{
      item['key'] = index;
      var count = item.result.failCount + item.result.inprogressCount + item.result.okCount;
      item['deviceCount'] = count;
      if (item.target.batchInfo) {
        item['batchName'] = item.target.batchInfo.batchName;        
      }
      item['success'] = item.result.okCount;
      item['fail'] = item.result.failCount;
      item['uncomplete'] = item.result.inprogressCount;
    });

    const { deviceTypeList } = prodModel;
    deviceTypeData = deviceTypeList || [];
    batchData = batchModel.batches || [];
    console.log('deviceTypeData', deviceTypeData);
    console.log('batchData', batchData);

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.createButton} type="primary" onClick={this.showCreateUpgradeModal}>创建升级包</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
            <div style={{ marginTop: 50 }} >
              升级记录
            </div>          
            <Divider style={{ margin: '10px 0' }} />            
            <Table bordered dataSource={historyData} columns={historyColumns} />
          </div>
        </Card>

        <CreateUpgradePackageForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCratePackage={this.handleCreatePackage}
          beforeUpload={this.beforeUpload}
          handleUpload={this.handleUpload}
          selectedFile={this.state.selectedFile}
        />

        <StartUpgradeForm
          ref={this.saveFormRef}
          visible={this.state.upgradeVisible}
          onCancel={this.handleCancel}
          handleUpgrade={this.handleUpgrade}
          deviceID={this.state.deviceID}
        />

      </PageHeaderLayout>
    );
  }
}