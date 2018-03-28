import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '性别',
      dataIndex: 'sex',
    }, {
      title: '年龄',
      dataIndex: 'age',
    }, {
      title: '类型',
      dataIndex: 'type',
    }, {
      title: '联系方式',
      dataIndex: 'tel',
    }, {
      title: '设备信息',
      dataIndex: 'deviceInfo',
    }, {
      title: '相关设备  ',
      dataIndex: 'refDevice',
    }, {
      title: '注册时间',
      dataIndex: 'regTime',
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: '张三',
        sex: '男',
        age: '30',
        type: '管理员',
        tel: '18600000000',
        deviceInfo: "MAC12345",
        refDevice: "M100",
        regTime: "2018-01-01"
      }],
      count: 1,
    };
  }

  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>
      </PageHeaderLayout>
    );
  }
}