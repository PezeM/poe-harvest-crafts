import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

interface Props {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<Props> = ({ children }) => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  return (
    <Layout style={{
      minHeight: '100vh'
    }}>
      <Sider
        collapsible
        collapsed={siderCollapsed}
        onCollapse={() => setSiderCollapsed(!siderCollapsed)}
      >
        <div className='logo' />
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']}>
          <Menu.Item key='1' icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key='2' icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key='3' icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
          <Menu.Item key='4' icon={<UploadOutlined />}>
            nav 4
          </Menu.Item>
          <Menu.Item key='5' icon={<UploadOutlined />}>
            nav 5
          </Menu.Item>
          <Menu.Item key='6' icon={<UploadOutlined />}>
            nav 6
          </Menu.Item>
          <Menu.Item key='7' icon={<UploadOutlined />}>
            nav 7
          </Menu.Item>
          <Menu.Item key='8' icon={<UploadOutlined />}>
            nav 8
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header className='site-layout-background' style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div className='site-layout-background' style={{ padding: 24 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Footer</Footer>
      </Layout>
    </Layout>
  );
};
