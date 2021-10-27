/**
 * types
 */
import { NextPage } from 'next';
import { MenuInfo } from 'rc-menu/lib/interface';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';

import styles from '../styles/components/Menu.module.css';

type Props = {};

const handleMappingActiveKey = (pathname: string) => {
  let activeKey = '';
  switch (pathname) {
    case '/stream':
      activeKey = 'stream';
      break;
    case '/package':
      activeKey = 'package';
      break;
    default:
      break;
  }

  return activeKey;
};

const MenuLayout: NextPage<Props> = ({ children }) => {
  const router = useRouter();
  const defaultActiveKey = useMemo(() => handleMappingActiveKey(router.pathname), [router.pathname]);
  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  const handleActiveKey = ({ key }: MenuInfo) => {
    setActiveKey(key);
  };

  return (
    <Layout className={styles.layout}>
      <Layout.Header>
        <div className={styles.logo} />
        <Menu
          theme="dark"
          defaultSelectedKeys={[defaultActiveKey]}
          activeKey={activeKey}
          mode="horizontal"
          onClick={handleActiveKey}
        >
          <Menu.Item key="stream">
            <Link href="/stream">检索</Link>
          </Menu.Item>
          <Menu.Item key="package">
            <Link href="/package">展示图</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className={styles.layoutContent}>
        <div className={styles.siteLayoutContent}>{children}</div>
      </Layout.Content>
      <Layout.Footer className={styles.layoutFooter}>create by charlesMoone</Layout.Footer>
    </Layout>
  );
};

export default MenuLayout;
