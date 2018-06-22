import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { getTime } from '../../utils/utils';

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
      dataIndex: 'nickName',
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
      dataIndex: 'phone',
    },{
      title: '注册时间',
      dataIndex: 'regTime',
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
    }, ];
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'account/queryUserList',
    });
  }  

  render() {
    const { account } = this.props;
    var dataSource = account.users || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
      item['deviceName'] = item.devices.deviceName;
      item['regTime'] = getTime(item.regTime);
    });

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