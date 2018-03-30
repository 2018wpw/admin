import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmap'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Card } from 'antd';
import styles from './Map.less';

export default class DeviceMap extends React.Component {


  render(){
	return(
		<PageHeaderLayout>
			<Card>
				<Map center={{lng: 116.402544, lat: 39.928216}} zoom="11" style={{height: 600}}>
				    <Marker position={{lng: 116.402544, lat: 39.928216}} />
				    <NavigationControl /> 
				    <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
				</Map>
			</Card>
		</PageHeaderLayout>
	);
  }
}