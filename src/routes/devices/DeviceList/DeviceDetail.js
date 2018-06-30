import { Card, Table, Input, Button, Modal, Form, Select, Row, Col, Divider, Tag, TimePicker, Checkbox } from 'antd';
import { Radio } from 'antd';
import styles from './list.less';
import React, { PureComponent, Fragment } from 'react';
import DescriptionList from 'components/DescriptionList';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { connectivity, getTime, airSpeed, ventilationMode } from '../../../utils/utils';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Description } = DescriptionList;
const { CheckableTag } = Tag;
const RadioGroup = Radio.Group;

const AddNewTimingFormModal = Form.create()((props) => {
  const { timingModalVisible, form, handleAddNewTiming, handleCloseTimingModal } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAddNewTiming(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleCloseTimingModal();
  };
  const onCheckBoxChanged = (value) => {
    console.log('onCheckBoxChanged', value);
  }
  const auxiliaryHeatOptions = ['关', '开'];


  return (
    <Modal
      title="添加新定时"
      visible={timingModalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="时间"
        >
          {form.getFieldDecorator('startTime', {
            rules: [{ required: true, message: '请选择时间' }],
          })(
            <TimePicker format='HH:mm'></TimePicker>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="重复"
        >
          {form.getFieldDecorator('repetition', {
            rules: [{ required: true, message: '请选择日期' }],
          })(
            <Checkbox.Group style={{ width: '100%' }} onChange={onCheckBoxChanged}>
              <Row>
                <Col span={8}><Checkbox value="1">星期一</Checkbox></Col>
                <Col span={8}><Checkbox value="2">星期二</Checkbox></Col>
                <Col span={8}><Checkbox value="3">星期三</Checkbox></Col>
                <Col span={8}><Checkbox value="4">星期四</Checkbox></Col>
                <Col span={8}><Checkbox value="5">星期五</Checkbox></Col>
                <Col span={8}><Checkbox value="6">星期六</Checkbox></Col>
                <Col span={8}><Checkbox value="7">星期日</Checkbox></Col>
                <Col span={8}><Checkbox value="0">永不</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="档位"
        >
          {form.getFieldDecorator('airSpeed', {
            rules: [{ required: true, message: '请选择档位' }],
          })(
            <Select placeholder="请选择档位">
              {airSpeed.map((item, index) => (
                <Option key={index} value={index}>{item}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="新风"
        >
          {form.getFieldDecorator('ventilationMode', {
            rules: [{ required: true, message: '请选择新风' }],
          })(
          <Select placeholder="请选择新风">
            {ventilationMode.map((item, index) => (
              <Option key={index} value={index}>{item}</Option>
            ))}
          </Select>            
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="热辅"
        >
          {form.getFieldDecorator('auxiliaryHeat', {
            rules: [{ required: true, message: '请选择新风' }],
          })(
            <RadioGroup>
              <Radio value='0'>关</Radio>
              <Radio value='1'>开</Radio>            
            </RadioGroup>
          )}
        </FormItem>         
      </Form>     
    </Modal>
  );
});

class RemoteTag extends React.Component {
  state = { checked: false };

  onChange = () => {
    const { onCheckChange } = this.props;
    onCheckChange();
  }

  render() {
    const { checkState } = this.props;
    return <CheckableTag {...this.props} checked={checkState} onChange={this.onChange} />;
  }
}

let deviceID = '';

@connect(({ deviceDetailModel, loading }) => ({
  deviceDetailModel,
}))
export default class DeviceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        hideOnSinglePage: true
      },
      timingModalVisible: false,
    };

    this.matchColumns = [{
      title: '设备名称',
      dataIndex: 'deviceName',
      width: '35%',
    }, {
      title: 'MAC/IMEI',
      dataIndex: 'deviceID',
      width: '40%',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '25%',
      render: (text, record) => {
        return (
            <div>
              <a className={styles.right} onClick={() => {alert("alert")}}>解除配对</a>
              <a className={styles.left} onClick={() => {alert("alert")}}>启动/关闭联动</a>
            </div>
        );
      },
    }];

    this.bindUserListColumns = [{
      title: '用户名称',
      dataIndex: 'userName',      
    }, {
      title: '性别',
      dataIndex: 'sex',
    }, {
      title: '联系方式',
      dataIndex: 'phone',
    }, {
      title: '地址',
      dataIndex: 'addrDetail'
    }, {
      title: '权限',
      dataIndex: 'permission'
    }, {
      title: '是否控制',
      dataIndex: 'control'
    }];

    this.rentUserListColumns = [{
      title: '用户名称',
      dataIndex: 'userName',      
    }, {
      title: '性别',
      dataIndex: 'sex',
    }, {
      title: '联系方式',
      dataIndex: 'phone',
    }, {
      title: '地址',
      dataIndex: 'addrDetail'
    }, {
      title: '使用时长',
      dataIndex: 'usingTime'
    }, {
      title: '费用',
      dataIndex: 'fee'
    }, {
      title: '时间',
      dataIndex: 'time'
    }];

    this.timingColumns = [{
      title: '时间',
      dataIndex: 'time',      
    }, {
      title: '重复',
      dataIndex: 'repeat',
    }, {
      title: '功能',
      dataIndex: 'function',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (text, record) => {
        return (
            <div>
              <a className={styles.right} onClick={() => {alert("alert")}}>编辑</a>
              <a className={styles.left} onClick={() => {alert("alert")}}>删除</a>
            </div>
        );
      },
    }];

    this.airLevelColumns = [{
      title: '项目',
      dataIndex: 'name',
      width: '10%',
    }, {
      title: '标准',
      dataIndex: 'strandard',
    }, {
      title: '轻度污染',
      dataIndex: 'mild',
    }, {
      title: '中度污染',
      dataIndex: 'medium',
    }, {
      title: '严重污染',
      dataIndex: 'heavily',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        return (
            <div>
              <a className={styles.right} onClick={() => {alert("alert")}}>编辑</a>
            </div>
        );
      },
    }];

    this.smartParasCumns = [{
      title: '项目',
      dataIndex: 'name',
      width: '10%',
    }, {
      title: '静音',
      dataIndex: 'mute',
    }, {
      title: '舒适',
      dataIndex: 'comfort',
    }, {
      title: '标准',
      dataIndex: 'standard',
    }, {
      title: '强力',
      dataIndex: 'strong',
    }, {
      title: '飓风',
      dataIndex: 'typhoon',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        return (
            <div>
              <a className={styles.right} onClick={() => {alert("alert")}}>编辑</a>
            </div>
        );
      },
    }];

    this.strainerParasCumns = [{
      title: '项目',
      dataIndex: 'name',
      width: '10%',
    }, {
      title: '初效滤网',
      dataIndex: 'initialStrainer',
    }, {
      title: '除TVOC复合滤网',
      dataIndex: 'tvocStrainer',
    }, {
      title: '除菌滤网',
      dataIndex: 'bacteriaStrainer',
    }, {
      title: '除甲醛',
      dataIndex: 'ch2oStrainer',
    }, {
      title: '超高效滤网',
      dataIndex: 'hightStrainer',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        return (
            <div>
              <a className={styles.right} onClick={() => {alert("alert")}}>编辑</a>
            </div>
        );
      },
    }];    

    var query = this.props.location.search;
    var arr = query.split('=');//?id=1    
    deviceID = arr[1];
    console.log('device detail page props', query, arr);     
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'deviceDetailModel/listRentUsers',
      payload: {
        deviceID: deviceID,
      }
    });
    this.props.dispatch({
      type: 'deviceDetailModel/listBoundUsers',
      payload: {
        deviceID: deviceID,
      }      
    });
    this.props.dispatch({
      type: 'deviceDetailModel/getDeviceDetailInfo',
      payload: {
        deviceID: deviceID,
      }      
    });
    this.props.dispatch({
      type: 'deviceDetailModel/getTimingList',
      payload: {
        deviceID: deviceID,
      }      
    });
    this.props.dispatch({
      type: 'deviceDetailModel/getDevAirLevelList',
      payload: {
        deviceID: deviceID,
      }      
    });
  }  

  renderDeviceDetailForm(deviceDetailData) {
    var strainer = ['初效', '中效', '高效'];
    var deviceStatus = deviceDetailData.deviceStatus;
    var deviceData = deviceDetailData.deviceData;
    var model = deviceDetailData.model;
    return(
      <div>
        <div>设备基础信息</div>
        <Divider className={styles.divider}></Divider>
        <div style={{marginLeft: 180}}>
          <DescriptionList style={{ marginBottom: 24 }} col={5}>
            <Description term="设备名称">{deviceDetailData.deviceName}</Description>
            <Description term="设备状态">{deviceStatus.online ? '在线' : '离线'}</Description>
            <Description term="是否开启定时">{deviceStatus.timing ? '是' : '否'}</Description>
            <Description term="设备类型">{model.prodInfo.name + ''}</Description>
            <Description term="CO2值">{deviceData.co2 + ''}</Description>
            <Description term="群组">{deviceDetailData.groupName + ''}</Description>
            <Description term="TVOC">{deviceData.tvoc + ''}</Description>
            <Description term="设备型号">{model.name}</Description>
            <Description term="滤网提醒">{deviceStatus.strainerAlarm ? '是' : '否'}</Description>
            <Description term="是否租赁">{deviceDetailData.rent ? '是' : '否'}</Description>
            <Description term="MAC地址">{deviceDetailData.deivceID}</Description>
            <Description term="位置">{deviceDetailData.addrDetail}</Description>
            <Description term="链接方式">{connectivity[model.connWay]}</Description>
            <Description term="PM2.5">{ deviceData.pm25 + ''}</Description>
            <Description term="甲醛值">{ deviceData.ch2o + ''}</Description>
            <Description term="温度">{ deviceData.temp + ''}</Description>
            <Description term="档位状态">{ deviceStatus.airSpeed } 档</Description>
            <Description term="滤网状态">{strainer[deviceStatus.strainerStatus.length]}</Description>
            <Description term="湿度">{deviceData.humidity + ''}</Description>
          </DescriptionList>          
        </div>
      </div>
    )
  }

  renderStrainerSetting(deviceDetailData, devSmartParasListData) {
    const itemList = ['风机转速', 'PM2.5', 'CO2', '甲醛', 'TVOC'];
    const itemLevel = ['mute', 'comfort', 'standard', 'strong', 'typhoon'];
    devSmartParasListData.map((item, index) => {
      item['name'] = itemList[index];
      item['id'] = index;
      item[itemLevel[index]] = item.rpm + '转/分钟';
      item[itemLevel[index]] = item.pm25Min + ' - ' + item.pm25Max;
      item[itemLevel[index]] = item.co2Min + ' - ' + item.co2Max;
      item[itemLevel[index]] = item.ch2oMin + ' - ' + item.ch2oMax;
      item[itemLevel[index]] = item.tvocMin + ' - ' + item.tvocMax;
    });
    return(
      <div style={{marginBottom: 24}}>
        <div>滤网寿命参数设置</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={devSmartParasListData} columns={this.strainerParasCumns} pagination={this.state.pagination} />
      </div>
    );
  }  

  renderSmartParasSetting(deviceDetailData, devSmartParasListData) {
    const itemList = ['风机转速', 'PM2.5', 'CO2', '甲醛', 'TVOC'];
    const itemLevel = ['mute', 'comfort', 'standard', 'strong', 'typhoon'];
    devSmartParasListData.map((item, index) => {
      item['name'] = itemList[index];
      item['id'] = index;
      item[itemLevel[index]] = item.rpm + '转/分钟';
      item[itemLevel[index]] = item.pm25Min + ' - ' + item.pm25Max;
      item[itemLevel[index]] = item.co2Min + ' - ' + item.co2Max;
      item[itemLevel[index]] = item.ch2oMin + ' - ' + item.ch2oMax;
      item[itemLevel[index]] = item.tvocMin + ' - ' + item.tvocMax;
    });
    return(
      <div style={{marginBottom: 24}}>
        <div>智能模式运行参数设置</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={devSmartParasListData} columns={this.smartParasCumns} pagination={this.state.pagination} />
      </div>
    );
  }

  renderDevAirLevel(deviceDetailData, devAirLevelListData) {
    const itemList = ['PM2.5', 'CO2', '甲醛', 'TVOC'];
    const itemLevel = ['standard', 'mild', 'medium', 'heavily'];
    var columnsData = [];
    devAirLevelListData.map((item, index) => {
      item['name'] = itemList[index];
      item['id'] = index;
      item[itemLevel[index]] = item.pm25Min + ' - ' + item.pm25Max;
      item[itemLevel[index]] = item.co2Min + ' - ' + item.co2Max;
      item[itemLevel[index]] = item.ch2oMin + ' - ' + item.ch2oMax;
      item[itemLevel[index]] = item.tvocMin + ' - ' + item.tvocMax;
    });
    return(
      <div style={{marginBottom: 24}}>
        <div>空气质量等级参数设置</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={devAirLevelListData} columns={this.airLevelColumns} pagination={this.state.pagination} />
      </div>      
    );
  }

  onPowerOnChanged = () => {
    console.log('onPowerOnChanged');
  }

  handleCloseTimingModal = () => {
    this.setState({
      timingModalVisible: false,
    });
  }

  handleAddNewTiming = (values) => {
    console.log('handleAddNewTiming', values);
  }

  onAddNewTiming = () => {
    console.log('onAddNewTiming');
    this.setState({
      timingModalVisible: true,
    });
  }

  renderTimingForm(deviceDetailData, timingListData) {   
    var deviceStatus = deviceDetailData.deviceStatus;
    timingListData.map(item=> {
      item['id'] = item.id.toString();
      item['deviceID'] = item.deivceID.toString();
      item['groupID'] = item.groupID.toString();
      item['startTime'] = getTime(item.startTime);
    });
    return(
      <div style={{marginBottom: 24}}>
        <div> 定时: 
            <RemoteTag style={{marginLeft: 30}} checkState={deviceStatus.powerOn === true} onCheckChange={this.onPowerOnChanged} >开</RemoteTag>
            <RemoteTag checkState={deviceStatus.powerOn !== true} onCheckChange={this.onPowerOnChanged} >关</RemoteTag>         
        </div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={timingListData} columns={this.timingColumns} pagination={this.state.pagination} />
        <div className={styles.buttonCenter} >
          <Button type='primary' onClick={this.onAddNewTiming}>添加新定时</Button>        
        </div>
      </div>
    );
  }

  renderRemoteForm(deviceDetailData) { 
    var  deviceStatus = deviceDetailData.deviceStatus;
    var  airSpeed = deviceStatus.airSpeed;
    var  fanMode = deviceStatus.fanMode;
    var  powerOn = deviceStatus.powerOn;
    var  ventilationMode = deviceStatus.ventilationMode;

    return(
      <div className={styles.divGap}>
        <div>远程控制</div>
        <Divider className={styles.divider}></Divider>
        <Form layout="inline" className={styles.tableListForm}>
          <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <FormItem label="设备状态">
              <RemoteTag checkState={powerOn === true}>开</RemoteTag>
              <RemoteTag checkState={powerOn === false}>关</RemoteTag>
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="新风">
              <RemoteTag checkState={ventilationMode === 0}>低效</RemoteTag>
              <RemoteTag checkState={ventilationMode === 1}>高效</RemoteTag>
              <RemoteTag checkState={ventilationMode === 2}>关闭</RemoteTag>
            </FormItem>
          </Col>                                            
        </Row>
        <Row>
          <Col md={12} sm={24}>
            <FormItem label="风速档位">
              <RemoteTag checkState={airSpeed === 0}>自动挡</RemoteTag>
              <RemoteTag checkState={airSpeed === 1}>静音档</RemoteTag>
              <RemoteTag checkState={airSpeed === 2}>舒适档</RemoteTag>              
              <RemoteTag checkState={airSpeed === 3}>标准档</RemoteTag>
              <RemoteTag checkState={airSpeed === 4}>强力档</RemoteTag>
              <RemoteTag checkState={airSpeed === 5}>飓风档</RemoteTag>
            </FormItem>
          </Col>          
          <Col md={12} sm={24}>
            <FormItem label="升级">
              <RemoteTag>升级</RemoteTag>
            </FormItem>
          </Col>        
        </Row>       
      </Form>
    </div>
    )
  }

  renderHostiry(deviceDetailModel) {
    const warningCount = {
      title: {
        subtext: "PM2.5",
        x:'left',
        y: 'top'
      },
      legend: {
        left: 0,
        top: 30,
        bottom: 20,
        data:[ {name: '室外', icon: 'react'},{name: '室内', icon: 'react'}],
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          name: '室外',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          color: '#c23531',
      }, {
        name: '室内',
        data: [202, 300, 190, 193, 1200, 1300, 1300],
        type: 'line',
        color: '#12938a',
      }],
      grid: {
        x: 30,
        y: 80,
      }
    };

    return(
      <div className={styles.divGap}>
        <div>历史记录</div>
        <Divider className={styles.divider}></Divider>
        <Row>
          <Col span={12}>
          <div>
            <div className={styles.echartTag}>
              <RemoteTag>DAY</RemoteTag>            
              <RemoteTag>WEEK</RemoteTag>
              <RemoteTag>MONTH</RemoteTag>
            </div>
            <ReactEcharts option={warningCount} />
          </div>
          </Col>
          <Col span={12}>
            <ReactEcharts option={warningCount} />          
          </Col>          
        </Row>
        <Row>
          <Col span={12}>
            <ReactEcharts option={warningCount} />          
          </Col>
          <Col span={12}>
            <ReactEcharts option={warningCount} />          
          </Col>          
        </Row>        
      </div>
    )
  }

  renderMatch(deviceDetailData) {
    var matchDeviceInfo = deviceDetailData.matchDeviceInfo;
    matchDeviceInfo.map(item=>{
      item['key'] = item.deviceID.toString();
      item['deviceID'] = item.deviceID.toString();
    })
    return(
      <div className={styles.divGap}>
        <div>已配对设备列表</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={matchDeviceInfo} columns={this.matchColumns} pagination={this.state.pagination} />
      </div>
    )
  }

  renderBindUserList(deviceDetailModel) {
    var dataSource = deviceDetailModel.bindUsers;    
    return(
      <div className={styles.divGap}>
        <div>绑定用户列表</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={dataSource} columns={this.bindUserListColumns} pagination={this.state.pagination} />        
      </div>
    )
  }

  renderRentUserList(deviceDetailModel) {
    var dataSource = deviceDetailModel.rentUsers;
    return(
      <div className={styles.divGap}>
        <div>使用用户列表</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={dataSource} columns={this.rentUserListColumns} pagination={this.state.pagination} />        
      </div>
    )
  }

  render() {
    const { deviceDetailModel } = this.props;
    const { deviceDetailData } = deviceDetailModel;
    const { timingListData } = deviceDetailModel;
    const { devAirLevelListData } = deviceDetailModel;
    const { devSmartParasListData } = deviceDetailModel;
    return (
      <Fragment>
        <div>
            {this.renderDeviceDetailForm(deviceDetailData)}
            {this.renderRemoteForm(deviceDetailData)}
            {this.renderTimingForm(deviceDetailData, timingListData)}
            {this.renderDevAirLevel(deviceDetailData, devAirLevelListData)}
            {this.renderSmartParasSetting(deviceDetailData, devSmartParasListData)}
            {this.renderStrainerSetting(deviceDetailData, devSmartParasListData)}
            {this.renderHostiry(deviceDetailModel)}
            {this.renderMatch(deviceDetailData)}
            {this.renderBindUserList(deviceDetailModel)}
            {this.renderRentUserList(deviceDetailModel)}
        </div>
        <AddNewTimingFormModal
          timingModalVisible={this.state.timingModalVisible}
          handleAddNewTiming={this.handleAddNewTiming}
          handleCloseTimingModal={this.handleCloseTimingModal}
        />
      </Fragment>
    );
  }
}