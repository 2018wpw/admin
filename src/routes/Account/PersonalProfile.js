import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';
import { connect } from 'dva';


const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/queryUserInfo'],
}))
export default class PersonalProfile extends React.Component {
  state = {
  	editingBankInfo: false,
  	editingUserInfo: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'account/queryUserInfo',
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  editBankInfo = (e) => {
  	e.preventDefault();
  	this.setState({editingBankInfo: true});
    this.props.dispatch({
      type: 'account/editBankInfo',
      payload: {
        bankCardNo: e.target[0].value,
        bankName: e.target[1].value,
        bankCardOwner: e.target[2].value,
      },
    });
  }

  editUserInfo = (e) => {
  	e.preventDefault();
  	this.setState({editingUserInfo: true});
    this.props.dispatch({
      type: 'account/editUserInfo',
      payload: {
        phone: e.target[0].value,
        addrDetail: e.target[1].value,
        userPwd: e.target[2].value,
        contact: e.target[3].value,
        descr: e.target[4].value,
      },      
    });  	
  }

  render() {
    const { account, loading } = this.props;
    const { userInfo, bankInfo, role, userCompleted, bankCompleted } = account;

    var editingUser = this.state.editingUserInfo;
    if (this.state.editingUserInfo) {
    	if (userCompleted) {
    		editingUser = false;
    	}
    }
    var editingBank = this.state.editingBankInfo;
    if (this.state.editingBankInfo) {
    	if (bankCompleted) {
    		editingBank = false;
    	}
    }

    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableListForm}>
			<Form layouts="vertical" layout="inline" onSubmit={this.editUserInfo}>
	            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
	              <Col md={5} sm={24}>
	                <FormItem label="角色">
	                  <div>{role.name}</div>
	                </FormItem>
	              </Col>
	              <Col  md={5} sm={24}>
	                <FormItem label="用户名">
	                  <div>{userInfo.name}</div>           
	                </FormItem>
	              </Col>
	              <Col md={5} sm={24}>
	                <FormItem label="联系方式">
	                  <Input defaultValue={userInfo.phone}></Input>                
	                </FormItem>
	              </Col>
	              <Col md={9} sm={24}>
	                <FormItem label="地区信息">
	                  <Input defaultValue={userInfo.addrDetail}></Input>                
	                </FormItem>
	              </Col>
	            </Row>
	            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
	              <Col md={5} sm={24}>
	                <FormItem label="密码">
	                  <Input defaultValue="********"></Input>           
	                </FormItem>
	              </Col>
	              <Col  md={5} sm={24}>
	                <FormItem label="联系人">
	                  <Input defaultValue={userInfo.contact}></Input>          
	                </FormItem>
	              </Col>
	              <Col md={10} sm={24}>
	                <FormItem label="描述信息">
	                  <Input defaultValue={userInfo.descr}></Input>                
	                </FormItem>
	              </Col>
	            </Row>
	            <FormItem>
	            	<div align="center">
	            		<Button 
		            		type="primary" 
		            		className={styles.button} 
		  	              	loading={editingUser}
		  	              	type="primary"
		  	              	htmlType="submit"
	            		>
	            			保存
	            		</Button>
	            	</div>
	            </FormItem>
            </Form>           	
          </div>

          <div>
          	银行账号 <span className={styles.subTitle}>该信息是在租赁业务中参与分润时的账户填写，若不填写，则无法提款。</span>
          </div>
      	  
          <Divider style={{ marginBottom: 32 }} />

          <div className={styles.tableListForm}>
			<Form layouts="vertical" layout="inline" onSubmit={this.editBankInfo}>
	            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
	              <Col md={8} sm={24}>
	                <FormItem label="卡号">
	                  <Input name='bankCardNo' defaultValue={bankInfo.bankCardNo} />
	                </FormItem>
	              </Col>
	              <Col  md={8} sm={24}>
	                <FormItem label="开户支行">
	                  <Input name='bankName' defaultValue={bankInfo.bankName}></Input>    
	                </FormItem>
	              </Col>
	              <Col md={8} sm={24}>
	                <FormItem label="收款方用户名">
	                  <Input name='bankCardOwner' defaultValue={bankInfo.bankCardOwner}></Input>                
	                </FormItem>
	              </Col>
	            </Row>
	            <FormItem>
	            	<div align="center">
	            		<Button
		            		type="primary" 
		            		className={styles.button} 
		  	              	loading={editingBank}
		  	              	type="primary"
		  	              	htmlType="submit"
	            		>
	            		 确定
	            		</Button>
	            	</div>
	            </FormItem>
            </Form>           	
          </div>
			
        </Card>

      </PageHeaderLayout>
    );
  }
}