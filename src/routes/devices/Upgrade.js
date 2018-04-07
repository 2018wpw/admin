import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider, Upload, message } from 'antd';
import styles from '../Common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { uploadFileUrl } from '../../services/common';

const FormItem = Form.Item;
const { TextArea } = Input;

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
              <Select placeholder="请选择">
                <Select.Option value="0">M100</Select.Option>
                <Select.Option value="1">M200</Select.Option>
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


@connect(({ upgrade, loading }) => ({
  upgrade,
}))
export default class UpgradeList extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      visible: false,
      uploading: false,
      selectedFile: '',      
    };

    this.columns = [{
        title: '升级包',
        dataIndex: 'id',
      }, {
        title: '描述信息',
        dataIndex: 'descr',
      }, {
        title: '版本号',
        dataIndex: 'verFW',
      }, {
        title: '产品类型',
        dataIndex: 'prodName',
      },  {
        title: '产品型号',
        dataIndex: 'modelName',
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
  }

  onDelete = (key) => {

  }

  handleCreatePackage = () => {
    
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
    const { upgrade } = this.props;
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
      item['batchName'] = item.target.batchInfo.batchName;
      item['success'] = item.result.okCount;
      item['fail'] = item.result.failCount;
      item['uncomplete'] = item.result.inprogressCount;
    });

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.createButton} type="primary" onClick={this.showCreateUpgradeModal}>创建升级包</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
            <p>升级记录</p>
            <Divider/>
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
      </PageHeaderLayout>
    );
  }
}