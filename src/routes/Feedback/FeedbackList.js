import { Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';
import { getTime } from '../../utils/utils';

const FormItem = Form.Item;

@connect(({ feedbackModel, loading }) => ({
  feedbackModel,
  loading: loading.effects['feedbackModel/getIssueList'],
}))
export default class FeedbackList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
    }, {
      title: '反馈类型',
      dataIndex: 'categoryName',
    }, {
      title: '照片',
      dataIndex: 'images',
    },{
      title: '用户',
      dataIndex: 'userName',
    }, {
      title: '描述',
      dataIndex: 'descr',
    },{
      title: '是否处理',
      dataIndex: 'processDone',
    }];

    this.state = {

    };
  }

  componentDidMount() {
    console.log('FeedbackList', 'componentDidMount');
    this.props.dispatch({
      type: 'feedbackModel/getIssueList',
    });
  }

  render() {
    const { feedbackModel } = this.props;
    const { issueList } = feedbackModel;
    issueList.map((item, index)=>{
      item['key'] = index;
      item['id'] = item.id.toString();
      item['createTime'] = getTime(item.createTime);
    }); 

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Table bordered dataSource={issueList} columns={this.columns} />
          </div>          
        </Card>
      </PageHeaderLayout>
    );
  }
}