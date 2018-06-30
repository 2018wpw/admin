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
  Tag,
} from 'antd';
import numeral from 'numeral';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTime } from '../../utils/utils';
import ReactEcharts from 'echarts-for-react';
import styles from '../Common.less';

const { CheckableTag } = Tag;

class RemoteTag extends React.Component {

  onChange = () => {
    const { onCheckChange } = this.props;
    onCheckChange();
  }

  render() {
    const { checked } = this.props;
    return <CheckableTag {...this.props} checked={checked} onChange={this.onChange} />;
  }
}

//seriesData输出结果
//xAxisData 间隔
function formatData(dataSource, xAxisData, seriesData) {
  var index = 0;
  for (var i = 0; i < dataSource.length; i++) {
    var size = parseInt(xAxisData[index]);
    if (i < size) {
      seriesData[index] = seriesData[index] + dataSource[i].value;
    } else {
      index++;      
    }
  }
}

@connect(({general, loading}) => ({
  general,
  loading: loading.effects[
  'general/getStrainerLinearStatistics',
  'general/getAccountLinearStatistics',
  'general/getDeviceWorkLinearStatistics',
  'general/getDeviceStatistics',
  'general/getAccountStatistics' ],
}))
export default class General extends Component {
  state = {
    workStatisTag: 0,
    accountStatisTag: 0,
    strainerStatisTag: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'general/getStrainerLinearStatistics',
      payload: {
        type: this.state.strainerStatisTag,
        endTime: undefined,
      }
    });
    dispatch({
      type: 'general/getAccountLinearStatistics',
      payload: {
        type: this.state.accountStatisTag,
        endTime: undefined,
      }
    });
    dispatch({
      type: 'general/getDeviceWorkLinearStatistics',
      payload: {
        type: this.state.workStatisTag,
        endTime: undefined,
      }
    });
    dispatch({
      type: 'general/getDeviceStatistics',
    });
    dispatch({
      type: 'general/getAccountStatistics',
    });                
  }

  onWorkStatisTagChanged = (value, id) => {
    console.log('onWorkStatisTagChanged', value, id);
    this.setState({
      workStatisTag: id,
    });
    this.props.dispatch({
      type: 'general/getDeviceWorkLinearStatistics',
      payload: {
        type: id,
        endTime: undefined,
      }
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
            subtext: '总账户数量：' + accountCount,
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

    accountLinearStatis.map( item => {
      var subAccountStatis = item.accountStatis;
      subAccountStatis.map(subitem => {
        item['name'] = item.roleName;
        item['value'] = item.count;
      });
    });
    var legendData = [
      {name: '超级管理员', icon: 'react'},
      {name: '管理员', icon: 'react'},
      {name: '代理商', icon: 'react'}, 
      {name: '客户', icon: 'react'}, 
      {name: '普通用户', icon: 'react'}
    ];
    const newAccountStatisData = {
      title: {
        text: "新增用户线性统计",
        x:'left',
        y: 'top'
      },
      legend: {
        left: 0,
        top: 30,
        bottom: 20,
        data: legendData,
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          name: '室外',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          color: '#c23531',
      }, {
        name: '室内',
        data: [202, 300, 190, 193, 1200, 1300, 1300],
        type: 'line',
        color: '#12938a',
      }],
      grid: {
        x: 30,
        y: 80,
      }
    };


    var strainerData = [];
    if(strainerStatis) {
      strainerStatis.map( (item, index) => {
          strainerData.push(item.count);
      })
    }
    const strainerStatiData = {
      title: {
        text: "滤网报警数量",
        x:'left',
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

    deviceWorkStatis.map((item, index) => {
      item['value'] = item.count;
    });
    var xAxisData = [];
    var seriesData = [];
    //24hour
    if (this.state.workStatisTag === 0) {
      seriesData = [0, 0, 0, 0, 0, 0];
      xAxisData = ['4', '8', '12', '16', '20', '24'];
      formatData(deviceWorkStatis, xAxisData, seriesData);
    } 
    //30day
    else if (this.state.workStatisTag === 1) {
      xAxisData = ['6', '12', '18', '24', '30'];
      seriesData = [0, 0, 0, 0, 0];
      formatData(deviceWorkStatis, xAxisData, seriesData);
    } 
    //1year
    else {
      xAxisData = ['2', '4', '6', '8', '10', '12'];
      seriesData = [0, 0, 0, 0, 0, 0];
      formatData(deviceWorkStatis, xAxisData, seriesData);
    }
    const workStatisData = {
      color: ['#3398DB'],      
      title: {
        text: "开关机统计",
        x:'left'
      },
      xAxis: {
          type: 'category',
          data : xAxisData,
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          name:'开机数量',
          data: seriesData,
          type: 'bar',
          barWidth: 15
      }],
      tooltip : {
        trigger: 'axis',
      },      
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
              <div className={styles.echartTag}>
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 0)}} checked={this.state.accountStatisTag === 0}>24小时</RemoteTag>            
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 1)}} checked={this.state.accountStatisTag === 1}>30天</RemoteTag>
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 2)}} checked={this.state.accountStatisTag === 2}>1年</RemoteTag>
              </div>            
              <ReactEcharts option={newAccountStatisData} />           
            </Card>
          </Col>
          <Col span="8">
            <Card>
              <div className={styles.echartTag}>
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 0)}} checked={this.state.strainerStatisTag === 0}>24小时</RemoteTag>            
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 1)}} checked={this.state.strainerStatisTag === 1}>30天</RemoteTag>
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 2)}} checked={this.state.strainerStatisTag === 2}>1年</RemoteTag>
              </div>            
              <ReactEcharts option={strainerStatiData} />
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
              <div className={styles.echartTag}>
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 0)}} checked={this.state.workStatisTag === 0}>24小时</RemoteTag>            
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 1)}} checked={this.state.workStatisTag === 1}>30天</RemoteTag>
                <RemoteTag onCheckChange={(value) => {this.onWorkStatisTagChanged(value, 2)}} checked={this.state.workStatisTag === 2}>1年</RemoteTag>
              </div>
              <ReactEcharts option={workStatisData} />              
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}