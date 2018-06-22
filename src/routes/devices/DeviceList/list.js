import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider,Table } from 'antd';
import StandardTable from 'components/StandardTable';
import deviceListGroup from '../../../assets/deviceListGroup.png';
import deviceListDelete from '../../../assets/deviceListDelete.png';

import styles from './list.less';
import commonStyles from '../../Common.less';

const FormItem = Form.Item;
let selectedRowsParam = null;

@connect(({ deviceDetailModel, loading }) => ({
  deviceDetailModel,
  loading: loading.effects['deviceDetailModel/getDeviceList'],
}))
export default class DeviceList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'deviceDetailModel/getDeviceList',
    });
  }  


  renderSimpleForm() {
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="所属群组">
                <Select placeholder="请选择">
                  <Option value="0">代理</Option>
                  <Option value="1">代理</Option>
                </Select>

            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="连接方式">
                <Select placeholder="请选择">
                  <Option value="0">2G</Option>
                  <Option value="1">wifi</Option>
                </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="设备型号">
                <Select placeholder="请选择">
                  <Option value="0">M100</Option>
                  <Option value="1">M200</Option>
                </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="MAC/IMEI">
                <Input placeholder="请输入" />
            </FormItem>  
          </Col>
        </Row>

        <Row  gutter={{ md: 8, lg: 24, xl: 48 }} >
          <Col md={6} sm={24}>
            <FormItem label="地理位置">
                <Select placeholder="请选择">
                  <Option value="0">北京</Option>
                  <Option value="1">上海</Option>
                </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否提醒">
                <Select placeholder="请选择">
                  <Option value="0">是</Option>
                  <Option value="1">否</Option>
                </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="在线状态">
                <Select placeholder="请选择">
                  <Option value="0">在线</Option>
                  <Option value="1">离线</Option>
                </Select>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属批次">
                <Input placeholder="请输入" />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col md={6} sm={24}>  
            <FormItem label="设备类型">
                <Select placeholder="请选择">
                  <Option value="0">净化器</Option>
                  <Option value="1">检测仪</Option>
                </Select>
            </FormItem>                    
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="剩余时间">
                <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="开关状态">
                <Select placeholder="请选择">
                  <Option value="0">开</Option>
                  <Option value="1">关</Option>
                </Select>
            </FormItem>            
          </Col>
          <Col md={6} sm={24}>
            <FormItem className={commonStyles.centerButton}>
              <Button type='primary' style={{width: 120}}>发布</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
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

    const { deviceDetailModel } = this.props;
    const { deviceList } = deviceDetailModel;
    console.log('getDeviceList', deviceList);

    if (deviceList) {
      deviceList.map((item, index) => {
        item['key'] = item.deviceID;
        item['deviceID'] = item.deviceID;
      });
    }

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

    console.log(deviceListGroup);

    return (
      <Fragment>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          <Table rowSelection={rowSelection} bordered dataSource={deviceList} columns={columns} scroll={{x:2500}}/>
              <div style={{verticalCenter: 'middle'}}>
                <span><img style={{ width: 15, height: 15}} src={deviceListGroup} alt="group"/> <a href="">分配群组</a></span>
                <span style={{marginRight: 20, marginLeft: 50}} ><img style={{ width: 15, height: 15 }} src={deviceListDelete} alt="delete"/> <a onClick={this.middleSet}>删除群组</a></span>
              </div>
      </Fragment>
    );
  }
}