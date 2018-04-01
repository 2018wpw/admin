import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider, Tag } from 'antd';
import styles from './list.less';
import React, { PureComponent, Fragment } from 'react';
import DescriptionList from 'components/DescriptionList';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;
const { CheckableTag } = Tag;


const ProductFormCreate = Form.create()(
  (props) => {
    const {visible, onCancel, onCreate, form} = props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
          <Modal
            title="创建批次"
            visible={visible}
            onOk={onCreate}
            onCancel={onCancel}
            okText="创建"
            cancelText="取消"
          >
          <Form layout="vertical" layout="inline">
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="产品类型" >
                  <Select placeholder="请选择" style={{ width: 300 }}>
                    <Option value="0">M100</Option>
                    <Option value="1">M200</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="产品型号">
                  <Input placeholder="请输入" style={{ width: 300 }}></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col md={24} sm={24}>
                <FormItem label="描述信息">
                  <TextArea placeholder="请输入" style={{ width: 300 }}></TextArea>
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col md={24} sm={24}>
                <FormItem label="是否带PM2.5">
                  <Select placeholder="请选择" style={{ width: 275 }}>
                    <Option value="0">是</Option>
                    <Option value="1">否</Option>
                  </Select> 
                </FormItem>  
              </Col>
            </Row>            
          </Form>
          </Modal>
      );
    }
);

class RemoteTag extends React.Component {
  state = { checked: false };
  handleChange = (checked) => {
    this.setState({ checked });
  }
  render() {
    return <CheckableTag {...this.props} checked={this.state.checked} onChange={this.handleChange} />;
  }
}

export default class DeviceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      matchData: [{
        name: "手机",
        macimei: "aa:bb:cc:dd:ee",
      }],
      pagination: {
        hideOnSinglePage: true
      },
    };

    this.matchColumns = [{
      title: '设备名称',
      dataIndex: 'name',
    }, {
      title: 'MAC/IMEI',
      dataIndex: 'macimei',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <div>
              <a className={styles.right} onClick={() => {alert("alert")}}>解除配对</a>
              <a className={styles.left} onClick={() => {alert("alert")}}>启动</a>
            </div>
        );
      },
    }];

    this.bindUserListColumns = [{
      title: '用户名称',
      dataIndex: 'name',      
    }, {
      title: '性别',
      dataIndex: 'sex',
    }, {
      title: '联系方式',
      dataIndex: 'tel',
    }, {
      title: '地址',
      dataIndex: 'address'
    }, {
      title: '权限',
      dataIndex: 'permission'
    }, {
      title: '是否控制',
      dataIndex: 'control'
    }];

    this.usingUserListColumns = [{
      title: '用户名称',
      dataIndex: 'name',      
    }, {
      title: '性别',
      dataIndex: 'sex',
    }, {
      title: '联系方式',
      dataIndex: 'tel',
    }, {
      title: '地址',
      dataIndex: 'address'
    }, {
      title: '使用时长',
      dataIndex: 'permission'
    }, {
      title: '费用',
      dataIndex: 'cost'
    }, {
      title: '时间',
      dataIndex: 'time'
    }];    
  }

  handleCreate = () => {
    const { count, dataSource } = this.state;
    const form = this.form;
    const newData = {
        key: count,
        package: '升级包0',
        description: '我是描述信息',
        version: '100',
        type: '产品类型1',
        model: '产品型号1',
        time: '2018-01-01'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      visible: false
    });
  }

  showModal = () => {
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

  onSubmit = (e) => {

  }

  saveFormRef = (form) => {
    this.form = form;
  }


  renderBasicForm() {
    return(
      <div>
        <div>设备基础信息</div>
        <Divider className={styles.divider}></Divider>
        <div style={{marginLeft: 200}}>
          <DescriptionList style={{ marginBottom: 24 }} col={4}>
            <Description term="设备名称">小明的设备</Description>
            <Description term="设备状态">在线</Description>
            <Description term="是否开启定时">是</Description>
            <Description term="设备类型">净化器</Description>
            <Description term="CO2值">200</Description>
            <Description term="群组">北京代理</Description>
            <Description term="TVOC">100</Description>
            <Description term="设备型号">M200</Description>
            <Description term="滤网提醒">是</Description>
            <Description term="是否租赁">是</Description>
            <Description term="MAC地址">10000000</Description>
            <Description term="位置">北京市朝阳区</Description>
            <Description term="链接方式">wifi</Description>
            <Description term="PM2.5">200</Description>
            <Description term="甲醛值">200</Description>
            <Description term="温度">20</Description>
            <Description term="档位状态">自动挡</Description>
            <Description term="滤网状态">是</Description>
            <Description term="湿度">20</Description>
          </DescriptionList>          
        </div>
      </div>
    )
  }

  renderRemoteForm() {
    return(
      <div className={styles.divGap}>
        <div>远程控制</div>
        <Divider className={styles.divider}></Divider>
        <Form layout="inline" className={styles.tableListForm}>
          <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={5} sm={24}>
            <FormItem label="设备状态">
              <RemoteTag>开</RemoteTag>
              <RemoteTag>关</RemoteTag>
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="模式">
              <RemoteTag>全循环</RemoteTag>
              <RemoteTag>大循环</RemoteTag>
              <RemoteTag>自循环</RemoteTag>              
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="定时">
              <RemoteTag>1档</RemoteTag>
              <RemoteTag>2档</RemoteTag>
              <RemoteTag>4档</RemoteTag>
              <RemoteTag>8档</RemoteTag>
              <RemoteTag>关闭</RemoteTag>
            </FormItem>
          </Col>                           
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>  
          <Col md={5} sm={24}>
            <FormItem label="升级">
              <RemoteTag>升级</RemoteTag>
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="新风">
              <RemoteTag>低效</RemoteTag>
              <RemoteTag>高效</RemoteTag>
              <RemoteTag>关闭</RemoteTag>
            </FormItem>
          </Col> 

          <Col md={12} sm={24}>
            <FormItem label="风速档位">
              <RemoteTag>自动挡</RemoteTag>
              <RemoteTag>静音档</RemoteTag>
              <RemoteTag>舒适档</RemoteTag>              
              <RemoteTag>标准档</RemoteTag>
              <RemoteTag>强力档</RemoteTag>
              <RemoteTag>飓风档</RemoteTag>
            </FormItem>
          </Col>                                          
        </Row>
        </Form>
      </div>
    )
  }

  renderHostiry() {
    return(
      <div className={styles.divGap}>
        <div>历史记录</div>
        <Divider className={styles.divider}></Divider>
      </div>
    )
  }

  renderMatch() {
    return(
      <div className={styles.divGap}>
        <div>已配对</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={this.state.matchData} columns={this.matchColumns} pagination={this.state.pagination} />
      </div>
    )
  }

  renderBindUserList() {
    return(
      <div className={styles.divGap}>
        <div>绑定用户列表</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={this.state.matchData} columns={this.bindUserListColumns} pagination={this.state.pagination} />        
      </div>
    )
  }

  renderUsingUserList() {
    return(
      <div className={styles.divGap}>
        <div>使用用户列表</div>
        <Divider className={styles.divider}></Divider>
        <Table bordered dataSource={this.state.matchData} columns={this.usingUserListColumns} pagination={this.state.pagination} />        
      </div>
    )
  }

  render() {
    const { dataSource, historyData } = this.state;
    const columns = this.columns;
    const historyColumns = this.historyColumns;
    const query = this.props.location.search;
    const arr = query.split('&');//?id=1
    return (
      <Fragment>
        <div>
            {this.renderBasicForm()}
            {this.renderRemoteForm()}
            {this.renderHostiry()}
            {this.renderMatch()}
            {this.renderBindUserList()}
            {this.renderUsingUserList()}
        </div>
      </Fragment>
    );
  }
}