import { Table, Input, Icon, Button, Popconfirm, Modal, Form, message, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Common.less';
import { connect } from 'dva';
import { getTime } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

const NewFeedbackCategoryForm = Form.create()((props) => {
  const { newCategoryModalVisible, form, handleNewCategory, hideCategoryModal, editingCategoryData, handleEditCategory } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!editingCategoryData) {
        handleNewCategory(fieldsValue);        
      } else {
        handleEditCategory(fieldsValue);
      }
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    hideCategoryModal();
  };

  return (
    <Modal
      title={editingCategoryData ? '编辑反馈类型' : "新建反馈类型"}
      visible={newCategoryModalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >

      <Form className={styles.formItemGap}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="反馈类型"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入反馈类型' }],
          })(
            <Input placeholder="请输入反馈类型" defaultValue={editingCategoryData ? editingCategoryData.name : ''} />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述信息"
        >
          {form.getFieldDecorator('descr')(
            <TextArea  defaultValue={editingCategoryData ? editingCategoryData.descr : ''}/>
          )}
        </FormItem> 
      </Form>     
    </Modal>
  );
});

@connect(({ feedbackModel, loading }) => ({
  feedbackModel,
  loading: loading.effects['feedbackModel/getCategoryList'],
}))
export default class FeedbackCategory extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',      
    }, {
      title: '反馈类型',
      dataIndex: 'name',
    }, {
      title: '描述',
      dataIndex: 'descr',
    },{
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
          return(
            <div>
              <a onClick={()=>{this.onDeleteCategory(record)}} className={styles.left}>编辑</a>
              <a onClick={()=>{this.onDeleteCategory(record)}} className={styles.right}>删除</a>
            </div>
          );
      },       
    }];

    this.state = {
      newCategoryModalVisible: false,
      editingCategoryData: undefined,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'feedbackModel/getCategoryList',
    });
  }

  onDeleteCategory = (record) => {
    console.log('onDeleteCategory', record);
    const { dispatch } = this.props;
    confirm({
      title: '删除类型',
      content: '确定从列表中删除类型？',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'feedbackModel/deleteCategory',
            payload: {
              id: record.id,
            },
            resolve: resolve,
            reject: reject,
          });
        }).then( resp => {
          message.success('删除成功');
        }).catch((err) => {
          console.log(err);
          message.error('删除失败');
        });        
      },
    });
  }

  onEditCategory = (record) => {
    this.setState({
      editingCategoryData: record,
      newCategoryModalVisible: true,
    });
  }

  handleNewCategory = (values) => {
    console.log('handleNewCategory', values);
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'feedbackModel/createCategory',
        payload: {
          ...values,
        },
        resolve: resolve,
        reject: reject,
      });
    }).then( response => {
      hideCategoryModal();
      message.success('创建成功');
    }).catch( err => {
      console.log('handleNewCategory', err);
      message.error('创建失败');
    });
  }

  handleEditCategory = (values) => {
    console.log('handleNewCategory', values);
    return new Promise((resolve, reject) => {
      this.props.dispatch({
        type: 'feedbackModel/editCategory',
        payload: {
          ...values,
        },
        resolve: resolve,
        reject: reject,
      });
    }).then( response => {
      hideCategoryModal();
      message.success('编辑成功');
    }).catch( err => {
      console.log('handleNewCategory', err);
      message.error('保存失败');
      hideCategoryModal();
    });
  }  

  showCategoryModal = () => {
    this.setState({
      newCategoryModalVisible: true,
      editingCategoryData: undefined,
    });
  }

  hideCategoryModal = () => {
    this.setState({
      newCategoryModalVisible: false,
      editingCategoryData: undefined,
    });
  }
  
  render() {
    const { feedbackModel } = this.props;
    const { categoryList } = feedbackModel;
    categoryList.map((item, index)=>{
      item['key'] = index;
      item['id'] = item.id.toString();
      item['createTime'] = getTime(item.createTime);
    }); 

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>
            <Button className={styles.createButton} type="primary" onClick={this.showCategoryModal}>新增</Button>                    
            <Table bordered dataSource={categoryList} columns={this.columns} />
          </div>          
        </Card>
        <NewFeedbackCategoryForm
          handleNewCategory={this.handleNewCategory}
          hideCategoryModal={this.hideCategoryModal}
          newCategoryModalVisible={this.state.newCategoryModalVisible}
          handleEditCategory={this.handleEditCategory}
          editingCategoryData={this.editingCategoryData}
        />        
      </PageHeaderLayout>
    );
  }
}