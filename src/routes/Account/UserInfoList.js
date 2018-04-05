import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/queryUserList'],
}))
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
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'account/queryUserList',
    });
  }  

  render() {
    const { account } = this.props;
    var dataSource = account.users;
    const { loading } = this.props;
    const columns = this.columns;

    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={loading}>
          <div>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>          
        </Card>
      </PageHeaderLayout>
    );
  }
}