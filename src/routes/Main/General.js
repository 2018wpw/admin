import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
} from 'antd';
import numeral from 'numeral';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import ReactEcharts from 'echarts-for-react';

@connect(({general, loading}) => ({
  general,
  loading: loading.effects[
  'general/getStrainerLinearStatistics',
  'general/getAccountLinearStatistics',
  'general/getDeviceWorkLinearStatistics',
  'general/getDeviceStatistics',
  'general/getAccountStatistics' ],
}) )
export default class General extends Component {
  state = {

  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'general/getStrainerLinearStatistics',
    });
    dispatch({
      type: 'general/getAccountLinearStatistics',
    });
    dispatch({
      type: 'general/getDeviceWorkLinearStatistics',
    });
    dispatch({
      type: 'general/getDeviceStatistics',
    });
    dispatch({
      type: 'general/getAccountStatistics',
    });                
  }

  render() {
    const { general, loading } = this.props;
    const { strainerStatis, accountLinearStatis, deviceWorkStatis, deviceStatis, accountStatis } = general;

    console.log(strainerStatis);
    console.log(accountLinearStatis);
    console.log(deviceWorkStatis);
    console.log(deviceStatis);
    console.log(accountStatis);

    var data = [];
    var d = [];
    if(accountStatis) {
      accountStatis.map( item => {
        d['vaule'] = item.count;
        d['name'] = item.roleName;
        data.push(d);
      })    
    }
    const accountSize = {
        title : {
            text: '账户数量统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['','','','','']
        },
        series : [
            {
                name: '账号数量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data: [...data],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        grid: {
          width: 234,
          height: 195
        }
    };

    var xdata = [];
    var ydata = [];
    if(accountLinearStatis) {
      accountLinearStatis.map( item => {
        xdata.push(item.roleName);
        ydata.push(item.count);
      })    
    }
    const newAccount = {
      title: {
        text: "新增用户线性统计",
        x:'center'
      },
      xAxis: {
          type: 'category',
          data: [...xdata]
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [...ydata],
          type: 'bar',
          barWidth: 15
      }],
      grid: {
        x: 30,
        width: 203
      }
    }; 


    var strainerData = [];
    if(strainerStatis) {
      strainerStatis.map( (item, index) => {
          strainerData.push(item.count);
      })
    }
    const warningCount = {
      title: {
        text: "滤网报警数量",
        x:'center'
      },
      xAxis: {
          type: 'category',
          data: ['初效','中效','高效'],
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [...strainerData],
          type: 'line'
      }],
      grid: {
        x: 30
      }
    };

    
    var deviceCountData = [];
    if(deviceStatis) {
      deviceStatis.map( item => {
        var d = [];        
        d['vaule'] = item.count;
        d['name'] = item.modelName;
        deviceCountData.push(d);
      })    
    }    
    const deviceCount = {
      title: {
        text: "设备数量",
        x:'center'
      },      
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['','','','','']
        },
        series: [
            {
                name:'设备数量',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[...deviceCountData]
            }
        ]
    };

    var onlineData = [];
    var onlineTime =[];
    if(deviceWorkStatis) {
      deviceWorkStatis.map( (item, index) => {
        onlineTime.push(item.time);
        onlineData.push(item.count);
      })
    }
    const onlineStatistics = {
      title: {
        text: "开关机统计",
        x:'center'
      },      
      xAxis: {
          type: 'category',
          data: [...onlineTime]
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [...onlineData],
          type: 'bar',
          barWidth: 15
      }],
      grid: {
        x: 30,
        width: 203
      }
    };


    return(
      <Fragment>
        <Row >
          <Col span="8">
            <Card>
              <ReactEcharts option={accountSize} />
            </Card>
          </Col>
          <Col span="8" >
            <Card>
              <ReactEcharts option={newAccount} />           
            </Card>
          </Col>
          <Col span="8">
            <Card>
              <ReactEcharts option={warningCount} />
            </Card>
          </Col>
        </Row>
        <Row span="8">
          <Col span="8">
            <Card>
              <ReactEcharts option={deviceCount} />            
            </Card>
          </Col>
          <Col span="8">
            <Card>
              <ReactEcharts option={onlineStatistics} />              
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}