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

    var accountCount = 0;
    accountStatis.map( item => {
      item['name'] = item.roleName;
      item['value'] = item.count;
      accountCount = accountCount + item.count
    })
    const accountStatisData = {
        title : {
            text: '账户数量统计',
            x:'left',
            subtext: '账户数量：' + accountCount,
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
                data: accountStatis,
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

    var deviceCount = 0;
    var deviceSeriesData = [];
    deviceStatis.map( (item, index) => {
      item['value'] = item.count;
      item['name'] = item.modelName;
      deviceCount = deviceCount + item.count;
    });
    const deviceStatisData = {
      title: {
        text: "设备数量统计",
        x:'left',
        subtext: '总设备数量：' + deviceCount,
      },
      tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
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
            data: deviceStatis,
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
              <ReactEcharts option={accountStatisData} />
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
              <ReactEcharts option={deviceStatisData} />            
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