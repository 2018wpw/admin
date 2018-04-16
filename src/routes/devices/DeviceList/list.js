import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider,Table } from 'antd';
import StandardTable from 'components/StandardTable';

import styles from './list.less';
import commonStyles from '../../Common.less';

const FormItem = Form.Item;

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

    return (
      <Fragment>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          <Table bordered dataSource={deviceList} columns={columns}/>
      </Fragment>
    );
  }
}