import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider, Tag, DatePicker, Timepicker } from 'antd';
import styles from './list.less';
import React, { PureComponent, Fragment } from 'react';
import DescriptionList from 'components/DescriptionList';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { connectivity, getTime } from '../../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;
const { CheckableTag } = Tag;
const RangePicker = DatePicker.RangePicker;

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

  onAddNewTiming = () => {
    console.log('onAddNewTiming');
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

  onTimeRangeChanged = (dates, dateStrings) => {
    console.log('onTimeRangeChanged', dates, dateStrings);
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
        subtext: "滤网报警数量",
        x:'left',
        y: 'top'
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          color: '#12938a',
      }, {
        data: [202, 300, 190, 193, 1200, 1300, 1300],
        type: 'line',
        color: '#12938a',
      }],
      grid: {
        x: 30
      }
    };

    return(
      <div className={styles.divGap}>
        <div>历史记录</div>
        <Divider className={styles.divider}></Divider>
        <Row>
          <Col span={12}>
            <ReactEcharts option={warningCount} />          
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
            {this.renderHostiry(deviceDetailModel)}
            {this.renderMatch(deviceDetailData)}
            {this.renderBindUserList(deviceDetailModel)}
            {this.renderRentUserList(deviceDetailModel)}
        </div>
      </Fragment>
    );
  }
}