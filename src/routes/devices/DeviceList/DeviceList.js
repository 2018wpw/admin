import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Menu, DatePicker, message,Table, Cascader, Modal } from 'antd';
import StandardTable from 'components/StandardTable';
import deviceListGroup from '../../../assets/deviceListGroup.png';
import deviceListDelete from '../../../assets/deviceListDelete.png';
import styles from './list.less';
import commonStyles from '../../Common.less';
import { connectivity, prd_type } from '../../../utils/utils';
import { getChinaAddr } from '../../../utils/authority';

const FormItem = Form.Item;
const Option = Select.Option;
let selectedRowsParam = [];
let _gGroupListData = [];
let _gProdModelData;
const CascaderOptions = getChinaAddr();
let _gBatchData;
let _gAccountData;


const AssignGroupForm = Form.create()((props) => {
  const { assignGroupFormVisible, form, handleAssignGroup, handleCancelAssignForm, groupAssigning } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAssignGroup(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleCancelAssignForm();
  };
  return (
    <Modal
      title='分配群组'
      visible={assignGroupFormVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      okText='分配'
      cancelText='取消'
      confirmLoading={groupAssigning}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label='群组'
        >
            {form.getFieldDecorator('groupID', {
              rules: [{ required: true, message: '请选择群组' }],                
              })(
                <Select placeholder="请选择群组">
                  {
                    _gGroupListData.map((item, index) => (
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


@connect(({ deviceDetailModel, group, prodModel, batchModel, account, loading }) => ({
  deviceDetailModel,
  group,
  prodModel,
  batchModel,
  account,
  loading: loading.effects['deviceDetailModel/getDeviceList'],
}))
@Form.create()
export default class DeviceList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    searching: false,
    assignGroupFormVisible: false,
    groupAssigning: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'deviceDetailModel/getDeviceList',
    });
    this.props.dispatch({
      type: 'group/queryList',
    });
    this.props.dispatch({
      type: 'prodModel/list',
    });
    this.props.dispatch({
      type: 'batchModel/list',
    });
    this.props.dispatch({
      type: 'account/queryAccountList',
    });
  };

  onSearch = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('search data', fieldsValue);
      form.resetFields();
      var selAccountIDs = undefined;
      if (fieldsValue.selAccountIDs) {
        selAccountIDs = '';
        fieldsValue.selAccountIDs.map(item=>{
          selAccountIDs = selAccountIDs + item + ',';
        });
      }
      var addrCode = undefined;
      if (fieldsValue.addrCode) {
        fieldsValue.addrCode.map(item=>{
          addrCode = item;
        });        
      }
      this.setState({
        searching: true,
      });
      return new Promise((resolve, reject) => {
          this.props.dispatch({
              type: 'deviceDetailModel/getDeviceList',
              payload: {
                ...fieldsValue,
                selAccountIDs: selAccountIDs,
                addrCode: addrCode,
              },
              resolve: resolve,
              reject: reject,
          });
        })
        .then(res => {
            this.setState({
              searching: false,
            });
        })
        .catch((err) => {
            console.log(err);
            this.setState({
              searching: false,
            });
        });
      });
  };

  onAssginGroup = () => {
    if (selectedRowsParam.length === 0) {
      message.warning("请选择要分配的设备");
      return;
    }
    this.setState({
      assignGroupFormVisible: true,
    });
  }

  onDeleteGroup = () => {
    if (selectedRowsParam.length === 0) {
      message.warning("请选择要分配的设备");
      return;
    }    
  }

  handleAssignGroup = (values) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      return new Promise((resolve, reject) => {
        var devices = [];
        selectedRowsParam.map(item => {
          devices.push(item.deviceID);
        });
        this.props.dispatch({
          type: 'group/addDevices',
          payload: {
            groupID: values.groupID,
            devices: devices,
          },
          resolve: resolve,
          reject: reject,
        });
      })
      .then(res => {
          this.setState({
            groupAssigning: false,
            assignGroupFormVisible: false,
          });
          form.resetFields();
      })
      .catch(err => {
          this.setState({
              groupAssigning: false,
              assignGroupFormVisible: false,
            });
          form.resetFields();
          var text = err;
          if (err === 0x320) {
            text = '有些设备不存在或者型号与群组不匹配';
          } else if (err === 0x31e) {
            text = '不允许一个群组分配给多个租赁关系';
          } else if (err === 0x31f) {
            text = '不允许一个群组分配给多个子帐号';
          } else if (err === 0x321) {
            text = '设备正在租赁中';
          }
          message.error(text);
      });
    });
  };

  handleCancelAssignForm = () => {
    this.setState({
      assignGroupFormVisible: false,
      groupAssigning: false,
    });
  }

  onAddrChange = (value) => {
    console.log(value);
  };

  renderSimpleForm() {
    const { form } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="MAC/IMEI">
              {form.getFieldDecorator('deviceID')(
                <Input placeholder="请输入" />              
              )}
            </FormItem>  
          </Col>
          <Col md={8} sm={24}>  
            <FormItem label="设备类型">
              {form.getFieldDecorator('prodID')(
                <Select placeholder="请选择">
                  <Option value="0">{prd_type[0]}</Option>
                  <Option value="1">{prd_type[1]}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备型号">
              {form.getFieldDecorator('modelID')(
                <Select placeholder="请选择设备型号">
                  {
                    _gProdModelData.map((item, index) => (
                      <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
                    ))
                  }  
                </Select>          
              )}
            </FormItem>
          </Col>
        </Row>

        <Row  gutter={{ md: 8, lg: 24, xl: 48 }} >
          <Col md={8} sm={24}>
            <FormItem label="所属群组">
              {form.getFieldDecorator('groupID')(
                <Select placeholder="请选择群组">
                  {
                    _gGroupListData.map((item, index) => (
                      <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
                    ))
                  }  
                </Select>          
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="连接方式">
              {form.getFieldDecorator('connWay')(
                <Select placeholder="请选择连接方式">
                  <Option value="0">{connectivity[0]}</Option>
                  <Option value="1">{connectivity[1]}</Option>
                </Select>              
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="批次">
              {form.getFieldDecorator('batchID')(
                <Select placeholder="请选择批次">
                  {
                    _gBatchData.map((item, index) => (
                      <Select.Option key={index} value={item.id}>{item.name}</Select.Option>                  
                    ))
                  }  
                </Select>               
              )}            
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="设备名称">
              {form.getFieldDecorator('devName')(
                <Input placeholder="请输入设备名称" />              
              )}
            </FormItem>
          </Col>          
          <Col md={8} sm={24}>
            <FormItem label="滤网是否提醒">
              {form.getFieldDecorator('strainerAlarm')(
                <Select placeholder="请选择">
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="在线状态">
              {form.getFieldDecorator('online')(
                <Select placeholder="请选择">
                  <Option value="0">离线</Option>
                  <Option value="1">在线</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="滤网剩余时间">
              {form.getFieldDecorator('strainerReaminingTime')(
                <Input placeholder="请输入" />              
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="位置">
              {form.getFieldDecorator('addrCode')(
                <Cascader options={CascaderOptions} onChange={this.onAddrChange} changeOnSelect placeholder='请选择' />
              )}                
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开关状态">
              {form.getFieldDecorator('powerOn')(
                <Select placeholder="请选择">
                  <Option value="0">开</Option>
                  <Option value="1">关</Option>
                </Select>
              )}            
            </FormItem>            
          </Col>          
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="账号">
              {form.getFieldDecorator('selAccountIDs')(
                <Select 
                  placeholder="点击选择账号(可多选)"
                  mode='multiple'>
                  {_gAccountData.map(item=> (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))}
                </Select>                
              )}
            </FormItem>
          </Col>          
          <Col md={8} sm={24}>
            <FormItem className={commonStyles.centerButton}>
              <Button type='primary' style={{width: 120}} htmlType='submit' loading={this.state.searching} onClick={this.onSearch}>查询</Button>
            </FormItem>
          </Col>          
        </Row>        
      </Form>
    );
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    const columns = [{
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },{
      title: 'IMEI/MAC',
      dataIndex: 'deviceID',
      key: 'deviceID',
    }, {
      title: '设备类型',
      dataIndex: 'devicecategory',
      key: 'devicecategory',
    }, {
      title: '设备型号',
      dataIndex: 'devicetype',
      key: 'devicetype',
    },{
      title: '链接方式',
      dataIndex: 'connectivity',
      key: 'connectivity',     
    }, {
      title: '地理分布',
      dataIndex: 'location',
      key: 'location',
    }, {
      title: '批次',
      dataIndex: 'batch',
      key: 'batch',
    }, {
      title: '群组',
      dataIndex: 'groupName',
      key: 'groupName',
    }, {
      title: '滤网是否提醒',
      dataIndex: 'meshalarm',
      key: 'meshalarm',
    }, {
      title: '滤网剩余时间',
      dataIndex: 'meshremaintime',
      key: 'meshremaintime',
    }, {
      title: '在线状态',
      dataIndex: 'onlinestatus',
      key: 'onlinestatus',
    }, {
      title: '新风状态',
      dataIndex: 'ventilationstatus',
      key: 'ventilationstatus',
    }, {
      title: '开关状态',
      dataIndex: 'switchstatus',
      key: 'switchstatus',
    }, {
      title: '是否定时',
      dataIndex: 'timer',
      key: 'timer',
    }, {
      title: 'PM2.5',
      dataIndex: 'pm25',
      key: 'pm25',
    }, {
      title: '二氧化碳',
      dataIndex: 'CO2',
      key: 'CO2',
    }, {
      title: '温湿度',
      dataIndex: 'humiture',
      key: 'humiture',
    }, {
      title: '甲醛值',
      dataIndex: 'hcho',
      key: 'hcho',
    }, {
      title: 'TVOC',
      dataIndex: 'tvoc',
      key: 'tvoc',
    }, {
      title: '上传时间',
      dataIndex: 'uploadtime',
      key: 'uploadtime',
    }, {
      title: '更新时间',
      dataIndex: 'updatetime',
      key: 'updatetime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        var url = '#/devices/list/detail?deviceID=' + record.deviceID;
        return (
            <div>
              <a href={url}>详情</a>
            </div>
        );
      },
    }];

    const { deviceDetailModel, group, prodModel, batchModel, account, form } = this.props;
    const { deviceList } = deviceDetailModel;

    if (deviceList) {
      deviceList.map((item, index) => {
        item['key'] = item.deviceID;
        item['deviceID'] = item.deviceID;
      });
    }
    if (group.groups) {
      _gGroupListData = group.groups;
      _gGroupListData.map((item, index) => {
        item['key'] = item.id.toString();
        item['id'] = item.id.toString();
      });
    }
    _gProdModelData = prodModel.models || [];
    _gProdModelData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedRowsParam = selectedRows;
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    _gBatchData = batchModel.batches || [];
    _gBatchData.map(item => {
      item['key'] = item.id.toString();
      item['id'] = item.id.toString();
    });

    _gAccountData = account.accounts || [];
    _gAccountData.map((item, index) => {
      item['key'] = index;
      item['id'] = item.id.toString();
    });

    return (
      <Fragment>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          <Table rowSelection={rowSelection} bordered dataSource={deviceList} columns={columns} scroll={{x:2500}}/>
          <div style={{verticalCenter: 'middle'}}>
                <span><img style={{ width: 15, height: 15}} src={deviceListGroup} alt="group"/> <a onClick={this.onAssginGroup}>分配群组</a></span>
                <span style={{marginRight: 20, marginLeft: 50}} ><img style={{ width: 15, height: 15 }} src={deviceListDelete} alt="delete"/> <a onClick={this.onDeleteGroup}>删除群组</a></span>
          </div>

          <AssignGroupForm
            form={form}
            assignGroupFormVisible={this.state.assignGroupFormVisible}
            handleAssignGroup={this.handleAssignGroup}
            groupAssigning={this.state.groupAssigning}
            handleCancelAssignForm={this.handleCancelAssignForm}
          />
      </Fragment>
    );
  }
}