import { Card, Table, Input, Icon, Button, Popconfirm, Modal, Form, Select, Row, Col, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';


const FormItem = Form.Item;

export default class AccountList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
			<Form layouts="vertical" layout="inline">
	            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
	              <Col md={5} sm={24}>
	                <FormItem label="角色">
	                  <div>管理员</div>
	                </FormItem>
	              </Col>
	              <Col  md={5} sm={24}>
	                <FormItem label="用户名">
	                  <div>马玉</div>           
	                </FormItem>
	              </Col>
	              <Col md={5} sm={24}>
	                <FormItem label="联系方式">
	                  <Input placeholder="18600000000"></Input>                
	                </FormItem>
	              </Col>
	              <Col md={9} sm={24}>
	                <FormItem label="地区信息">
	                  <Input placeholder="北京市海淀区中关村海龙大厦109室"></Input>                
	                </FormItem>
	              </Col>
	            </Row>
	            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
	              <Col md={5} sm={24}>
	                <FormItem label="密码">
	                  <Input placeholder="********"></Input>           
	                </FormItem>
	              </Col>
	              <Col  md={5} sm={24}>
	                <FormItem label="联系人">
	                  <Input placeholder="马玉"></Input>          
	                </FormItem>
	              </Col>
	              <Col md={10} sm={24}>
	                <FormItem label="描述信息">
	                  <Input placeholder="xxxxxx"></Input>                
	                </FormItem>
	              </Col>
	            </Row>
	            <FormItem>
	            	<div align="center">
	            		<Button type="primary" className={styles.button} >保存</Button>
	            	</div>
	            </FormItem>
            </Form>           	
          </div>

          <div>
          	银行账号 <span className={styles.subTitle}>该信息是在租赁业务中参与分润时的账户填写，若不填写，则无法提款。</span>
          </div>
      	  
          <Divider style={{ marginBottom: 32 }} />

          <div className={styles.tableListForm}>
			<Form layouts="vertical" layout="inline">
	            <Row  gutter={{ md: 8, lg: 16, xl: 24 }}>
	              <Col md={8} sm={24}>
	                <FormItem label="卡号">
	                  <Input/>
	                </FormItem>
	              </Col>
	              <Col  md={8} sm={24}>
	                <FormItem label="开户支行">
	                  <Input></Input>    
	                </FormItem>
	              </Col>
	              <Col md={8} sm={24}>
	                <FormItem label="收款方用户名">
	                  <Input placeholder="请输入"></Input>                
	                </FormItem>
	              </Col>
	            </Row>
	            <FormItem>
	            	<div align="center">
	            		<Button type="primary" className={styles.button}>确定</Button>
	            	</div>
	            </FormItem>
            </Form>           	
          </div>
			
        </Card>

      </PageHeaderLayout>
    );
  }
}