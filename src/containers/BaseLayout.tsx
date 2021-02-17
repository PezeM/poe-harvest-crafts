import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const { Header, Content, Footer, Sider } = Layout;

interface Props {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<Props> = ({ children }) => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const location = useLocation();

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
        <Menu theme='dark' mode='inline' selectedKeys={[location.pathname]}>
          <Menu.Item key={ROUTES.MAIN} icon={<UserOutlined />}>
            <Link to={ROUTES.MAIN}>
              Main page
            </Link>
          </Menu.Item>
          <Menu.Item key={ROUTES.SETTINGS} icon={<UploadOutlined />}>
            <Link to={ROUTES.SETTINGS}>
              Settings
            </Link>
          </Menu.Item>
          <Menu.Item key='dupa' icon={<UploadOutlined />}>
            <Link to='dupa'>
              Settings
            </Link>
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
