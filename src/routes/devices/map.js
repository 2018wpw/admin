import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmap'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Card, Divider, Icon, Form, List, Checkbox } from 'antd';
import styles from './Map.less';


const CreateFloatList = Form.create()((props) => {
	const { expanded, handleExpand, handleCheckState, dataSource } = props;

	const arrow = expanded ? 'down' : 'right';
	return(
		<div className={styles.list}>
			<div className={styles.listTitle} onClick={()=> {handleExpand(!expanded)}}>
				<div>
					设备列表 <Icon type={arrow}></Icon>
				</div>
			</div>

			<div className={ expanded ? styles.show : styles.hiden}>
				<Divider style={{ margin: '0' }} />
			    <List
			      dataSource={dataSource}
			      renderItem={
			      	item => (
			      		<List.Item>
							<Checkbox style={{marginRight: 10}}/>
			      			{item}
			      		</List.Item>
			      	)
			      }
			    />
			</div>
			
		</div>
	)
}); 


export default class DeviceMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  	expanded: false,
		}
	}

  handleExpand = (flag) => {
  	this.setState({
  		expanded: flag,
  	})
  }

  handleCheckState = () => {
  	//TODO
  }

  render(){
  	const { handleExpand } = this.props;
  	    
  	const parentMethods = {
      handleExpand: this.handleExpand,
      handleCheckState: this.handleCheckState,
    };

    const dataSource = [
    	"M100", "M200","M100", "M200",
    ];

	return(
		<PageHeaderLayout title='设备地图'>
			<Card>
				<Map 
				  center={{lng: 116.402544, lat: 39.928216}}
				  zoom="11"
				  style={{height: 500}}
				  enableScrollWheelZoom='true'>
				    <Marker position={{lng: 116.402544, lat: 39.928216}} />
				    <NavigationControl /> 
				</Map>

				<CreateFloatList
					{...parentMethods}
					expanded={this.state.expanded}
					dataSource={dataSource}
				/>
			</Card>
		</PageHeaderLayout>
	);
  }
}