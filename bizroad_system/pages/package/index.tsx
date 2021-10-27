/**
 * types
 */
import { NextPage } from 'next';

type TPackageFormRequest = {
  packageName?: string;
};

type TPackageFormResponse = {
  version: string;
};

/**
 * modules
 */
import { useState } from 'react';
import { Form, Button, Input } from 'antd';

import MenuLayout from '../../components/MenuLayout';

const PackageHandle: NextPage<{}> = () => {
  const [versionInfo, setVersionInfo] = useState<string>('');

  const onFinish = async ({ packageName }: TPackageFormRequest) => {
    try {
      const res: TPackageFormResponse = await (
        await fetch(`/api/package/getPackageLocalVersion?packageName=${packageName}`)
      ).json();
      setVersionInfo(res.version);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MenuLayout>
      <Form name="Package" labelCol={{ span: 4 }} autoComplete="off" onFinish={onFinish}>
        <Form.Item label="Package Name" name="packageName">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item>
      </Form>
      <pre>
        <code>{versionInfo}</code>
      </pre>
    </MenuLayout>
  );
};

export default PackageHandle;
