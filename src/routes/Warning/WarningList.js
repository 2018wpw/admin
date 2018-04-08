import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ warning, loading }) => ({
  warning,
  loading: loading.effects['warning/listAlarmRecords'],
}))
export default class WarningList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'MAC/IMEI',
      dataIndex: 'deviceID',
    }, {
      title: '告警类型',
      dataIndex: 'alarmType',
    }, {
      title: '发生时间',
      dataIndex: 'time',
    },  {
      title: '所属群组',
      dataIndex: 'groupName',
    }];

    this.state = {

    };
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.props.dispatch({
      type: 'warning/listAlarmRecords',
    });
  }

  render() {
    const columns = this.columns;
    const { warning } = this.props;
    var dataSource = warning.records || [];
    dataSource.map((item, index)=>{
      item['key'] = index;
      
    }); 

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