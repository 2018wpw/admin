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
  loading: loading.effects['general/fetch'],
}) )
export default class General extends Component {
  state = {

  };

  componentDidMount() {
    this.props.dispatch({
      type: 'general/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'general/clear',
    });
  }

  render() {
    const { general, loading } = this.props;
    const accountSize = {
        title : {
            text: '账户数量统计',
            subtext: '1000',
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
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ],
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


    const newAccount = {
      title: {
        text: "新增用户线性统计",
        x:'center'
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 15
      }],
      grid: {
        x: 30,
        width: 203
      }
    };

    const warningCount = {
      title: {
        text: "滤网报警数量",
        x:'center'
      },
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
      }],
      grid: {
        x: 30
      }
    };


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
                name:'访问来源',
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
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
            }
        ]
    };

    const onlineStatistics = {
      title: {
        text: "开关机统计",
        x:'center'
      },      
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
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