import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import styles from './Product.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '产品类型',
      dataIndex: 'type',
    }, {
      title: '产品型号',
      dataIndex: 'model',
    }, {
      title: '描述信息',
      dataIndex: 'description',
    }, {
      title: '图片信息',
      dataIndex: 'image',
    }, {
      title: '链接方式',
      dataIndex: 'connectivity',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#" className={styles.left}>编辑</a>
              <a href="#" className={styles.right}>删除</a>
            </Popconfirm>
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        type: '产品类型 0',
        model: 'M100',
        description: '我是描述信息',
        image: '我是图片信息',
        connectivity: 'wifi'
      }],
      count: 1,
    };
  }
  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
        key: count,
        type: '产品类型',
        model: 'M00',
        description: '我是描述信息',
        image: '我是图片信息',
        connectivity: '2g'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <PageHeaderLayout>
          <div>
            <Button className={styles.button} type="primary" onClick={this.handleAdd}>创建产品类型</Button>
            <Table bordered dataSource={dataSource} columns={columns} />
          </div>
      </PageHeaderLayout>
    );
  }
}