import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider, Upload, message } from 'antd';
import styles from '../Common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { getTime, upload_url } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;
const Option = Select.Option;

const CreateUpgradePackageForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCratePackage, form, uploading, handleUpload, onBeforeUpload, fileList, onRemoveFile, uploadedFileID } = props;

    const options = {
      action: '//common/file/upload',
      onRemove: (file) => {
        console.log('onRemove', file);
        onRemoveFile(file);
      },
      beforeUpload: (file) => {
        onBeforeUpload(file);
        return false;
      },
      fileList: fileList,
    };    

    const okHandler = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        if (uploadedFileID === '') {
          message.error("请先上传升级包");
          return;
        }        
        form.resetFields();
        console.log(fieldsValue);
        onCratePackage(fieldsValue);
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      onCancel();
    };

    const onUploadClick = () => {
      handleUpload();
    };

    return (
      <Modal
        title="创建升级包"
        visible={visible}
        onOk={okHandler}
        onCancel={cancelHandle}
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
              <Input type='number' placeholder="请输入版本号" />
            )}
          </FormItem>

          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品类型"
          >
            {form.getFieldDecorator('prodID', {
              rules: [{ required: true, message: '请输选择产品类型' }],
            })(
              <Select placeholder="请选择产品类型">
              {
                deviceTypeData.map((item, index) => (
                  <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
                ))
              }  
              </Select>          
            )}
          </FormItem> 
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="产品型号"
          >
            {form.getFieldDecorator('modelID', {
              rules: [{ required: true, message: '请输选择产品型号' }],
            })(
              <Select placeholder="请选择产品型号">
              {
                prodModelData.map((item, index) => (
                  <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
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
                    <Upload {...options}>
                      <Button>{uploadedFileID === '' ? '选择升级包' : '已上传'}</Button>
                    </Upload>
                  </Col>
                  <Col md={6} sm={24}>
                    <Button 
                        type='primary'
                        loading={uploading}
                        onClick={onUploadClick}
                    >
                      上传
                    </Button>                    
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
                  <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
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
let prodModelData;

@connect(({ upgrade, loading, prodModel, batchModel }) => ({
  upgrade,
  prodModel,
  batchModel,
}))
export default class UpgradeList extends React.Component {
  constructor(props) {
    super(props);
    this.packageColumns = [{
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

  state = {
      visible: false,
      uploading: false,
      fileList: [],
      upgradeVisible: false,
      deviceID: '',
      uploadedFileID: '',
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
      type: 'prodModel/getProdList',
    });
    this.props.dispatch({
      type: 'prodModel/list',
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
        .catch((err) => {
          console.log(err)          
          if (err.errCode === 3) {
            message.error('没有权限执行该操作');
          }
        });
      },
      onCancel() {},
    });
  }

  resetState = () => {
      this.setState({
        visible: false,
        upgradeVisible: false,
        fileList: [],
        uploadedFileID: '',
      });    
  }  

  handleCreatePackage = (values) => {
    this.props.dispatch({
      type: 'upgrade/createOTAPackage',
      payload: {
        modelID: values.modelID,
        verFW: values.verFW,
        packageFileID: this.state.uploadedFileID,
        descr: values.descr,
        prodID: values.prodID,
      }
    });
    this.resetState();  
  }

  showCreateUpgradeModal = () => {
    this.setState({
      visible: true,
    }); 
  }

  handleCancel = (e) => {
    console.log(e);
    this.resetState()
  }

  beforeUpload = (file) => {
    console.log('beforeUpload', file);
    this.setState({
      fileList: [file],
    });
  }

  onRemoveFile = (file) => {
    this.setState(({ fileList }) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
    });    
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    this.setState({
      uploading: true,
    });
    return new Promise((resolve, reject) => {
        this.props.dispatch({
            type: 'upgrade/uploadPackage',
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
            uploadedFileID: res.fileID,
          });
          message.success('上传成功');
      })
      .catch(err => {
        this.setState({
            uploading: false,
        });
        message.error("上传失败:", err);
    });   
  }

  render() {
    const { upgrade, prodModel, batchModel } = this.props;
    var packageDataSource = upgrade.packages || [];
    packageDataSource.map((item, index)=>{
      item['key'] = index;
      item['id'] = item.id.toString();
    });
  
    var historyData = upgrade.records || [];
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
      item['startTime'] = getTime(item.startTime);
      item['endTime'] = getTime(item.endTime);
    });

    const { deviceTypeList } = prodModel;
    deviceTypeData = deviceTypeList || [];

    prodModelData = prodModel.models || [];
    prodModelData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });

    batchData = batchModel.batches || [];
    batchData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.createButton} type="primary" onClick={this.showCreateUpgradeModal}>创建升级包</Button>
            <Table bordered dataSource={packageDataSource} columns={this.packageColumns} />
            <div style={{ marginTop: 50 }} >
              升级记录
            </div>          
            <Divider style={{ margin: '10px 0' }} />            
            <Table bordered dataSource={historyData} columns={this.historyColumns} />
          </div>
        </Card>

        <CreateUpgradePackageForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCratePackage={this.handleCreatePackage}
          onBeforeUpload={this.beforeUpload}
          handleUpload={this.handleUpload}
          fileList={this.state.fileList}
          onRemoveFile={this.onRemoveFile}
          uploadedFileID={this.state.uploadedFileID}
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