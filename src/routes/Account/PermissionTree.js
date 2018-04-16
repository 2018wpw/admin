import React from 'react';
import ReactDOM from 'react-dom';
import { Tree, Row, Col } from 'antd';

 const TreeNode = Tree.TreeNode;

 const accountNode = [{
    title: '账号操作权限',
    key: 'account',
    children: [
      { title: '创建角色', key: 'account-create-role' },
      { title: '删除角色', key: 'account-delete-role' },
      { title: '创建账户', key: 'account-create-account' },
      { title: '删除账户', key: 'account-delete-account' },
      { title: '查看用户信息', key: 'account-browse-user' },
    ],
  }];
  const deviceNode = [{
    title: '设备操作权限',
    key: 'device',
    children: [
      { title: '导入设备列表', key: 'device-import' },
      { title: '分配设备', key: 'device-assgin' },
      { title: '绑定设备', key: 'device-bind' },
      { title: '删除账户', key: 'device-delete' },
      { title: '解绑设备', key: 'device-unbind' },
    ],
  }];
  const batchNode = [{
    title: '批次权限',
    key: 'batch',
    children: [
      { title: '创建批次', key: 'batch-create' },
      { title: '删除批次', key: 'batch-delete' },
      { title: '编辑批次', key: 'batch-edit' },
      { title: '查询批次', key: 'batch-get' },
    ],
  }];
  const prodNode = [{
    title: '批产品权限',
    key: 'prod',
    children: [
      { title: '创建产品类型', key: 'prod-create' },
      { title: '删除产品类型', key: 'prod-delete' },
      { title: '编辑产品类型', key: 'prod-edit' },
      { title: '查询产品类型', key: 'prod-get' },
    ],
  }];
  const upgradeNode = [{
    title: '升级权限',
    key: 'upgrade',
    children: [
      { title: '上传升级包', key: 'upgrade-upload' },
      { title: '下载升级包', key: 'upgrade-download' },
      { title: '升级设备', key: 'upgrade-upgrade' },
      { title: '查询升级记录', key: 'upgrade-get' },
    ],
  }]; 
  const profitNode = [{
    title: '分润模式',
    key: 'profit',
    children: [
      { title: '创建分润模式', key: 'profit-create' },
      { title: '匹配分润模式', key: 'profit-match' },
      { title: '删除分润模式', key: 'profit-delete' },
    ],
  }];
  const rentNode = [{
    title: '租赁权限',
    key: 'rent',
    children: [
      { title: '创建租赁关系', key: 'rent-create' },
      { title: '删除租赁关系', key: 'rent-delete' },
      { title: '查看租赁关系', key: 'rent-get-rent' },
      { title: '订单查询', key: 'rent-get-order' },
      { title: '分润查询', key: 'rent-get-profit' },
    ],
  }];    
  const groupNode = [{
    title: '群组权限',
    key: 'group',
    children: [
      { title: '创建群组', key: 'group-create' },
      { title: '删除群组', key: 'group-delete' },
      { title: '查询群组设备', key: 'group-get' },
    ],
  }];
  const strainerNode = [{
    title: '群组权限',
    key: 'strainer',
    children: [
      { title: '滤网报警设置', key: 'strainer-create' },
      { title: '重置滤网', key: 'strainer-delete' },
      { title: '查询滤网列表状态', key: 'strainer-get' },
    ],
  }];


export default class PermissionTree extends React.Component {
  state = {
    expandedKeys: ['account', 'group'],
    autoExpandParent: true,
    checkedKeys: ['group'],
    selectedKeys: [],
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  render() {
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
      >
      	{this.renderTreeNodes(accountNode)}
      </Tree>
    );
  }
}