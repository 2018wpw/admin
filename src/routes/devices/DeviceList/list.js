import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider,Table } from 'antd';
import StandardTable from 'components/StandardTable';

import styles from './list.less';
import commonStyles from '../../Common.less';

const FormItem = Form.Item;

@connect(({ prodModel, loading }) => ({
  prodModel,
  loading: loading.effects['prodModel/list'],
}))
export default class DeviceList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

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
    const dataSource_fake = [{
      key: '1',
      imeimac: 'xx:xx:xx:xx:xx:xx',
      devicecategory: '净化器',
      devicetype: 'M100',
      connectivity: '2G',
      location:'北京昌平区',
      meshalarm:'否',
      meshremaintime:'60',
      batch:'净化器20180111',
      onlinestatus:'在线',
      switchstatus:'开',
      group:'北京市代理',
      pm25:'150',
      CO2:'10',
      humiture:'25',
      hcho:'100',
      timer:'否',
      tvoc:'100',
      lastupdate:'2018/3/24 15:00:00',
      firstupdate:'2018/1/10 01:00:00'
    }];

    const columns = [{
      title: 'IMEI/MAC',
      dataIndex: 'deivceID',
      key: 'deivceID',
    }, {
      title: '设备类型',
      dataIndex: 'devicecategory',
      key: 'devicecategory',
    }, {
      title: '设备型号',
      dataIndex: 'devicetype',
      key: 'devicetype',
    }, {
      title: '连接方式',
      dataIndex: 'connectivity',
      key: 'connectivity',
    }, {
      title: '地理分布',
      dataIndex: 'location',
      key: 'location',
    }, {
      title: '滤网是否提醒',
      dataIndex: 'meshalarm',
      key: 'meshalarm',
    }, {
      title: '滤网剩余时间',
      dataIndex: 'meshremaintime',
      key: 'meshremaintime',
    }, {
      title: '批次',
      dataIndex: 'batch',
      key: 'batch',
    }, {
      title: '在线状态',
      dataIndex: 'onlinestatus',
      key: 'onlinestatus',
    }, {
      title: '开关状态',
      dataIndex: 'switchstatus',
      key: 'switchstatus',
    }, {
      title: '群组',
      dataIndex: 'groupName',
      key: 'group',
    }, {
      title: 'PM.25',
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
      title: '是否定时',
      dataIndex: 'timer',
      key: 'timer',
    }, {
      title: 'TVOC',
      dataIndex: 'tvoc',
      key: 'tvoc',
    }, {
      title: '最后更新时间',
      dataIndex: 'lastupdate',
      key: 'lastupdate',
    }, {
      title: '首次更新时间',
      dataIndex: 'firstupdate',
      key: 'firstupdate',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <div>
              <a href='#/devices/list/detail?deivceID='${...record.deivceID}>详情</a>
            </div>
        );
      },
    }];

    return (
      <Fragment>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          <Table bordered dataSource={dataSource_fake} columns={columns}  scroll={{ x: 1300 }}/>
      </Fragment>
    );
  }
}