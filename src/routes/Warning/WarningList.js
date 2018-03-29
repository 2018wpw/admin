import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class WarningList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'sn',
      dataIndex: 'sn',
    }, {
      title: '警报类型',
      dataIndex: 'type',
    }, {
      title: '发生时间',
      dataIndex: 'time',
    },  {
      title: '所属群组',
      dataIndex: 'time',
    }];

    this.state = {
      dataSource: [],
      count: 0,
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