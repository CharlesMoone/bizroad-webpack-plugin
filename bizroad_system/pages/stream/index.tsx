/**
 * types
 */
import { NextPage } from 'next';
import { SetStateAction } from 'react';
import { SankeySeriesOption } from 'echarts/charts';
import { TooltipComponentOption } from 'echarts/components';

/**
 * modules
 */
// import Head from 'next/head';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Form, Layout, Select, Button } from 'antd';
import * as echarts from 'echarts';

import MenuLayout from '../../components/MenuLayout';

type TStreamQueueNext = {
  [key in string]: TStreamQueueNext;
};

type TStreamQueue = {
  from: string | null;
  next: TStreamQueueNext;
};

type TStreamLink = {
  source: string | number;
  target: string | number;
  value: number;
};

type TStreamNode = {
  name: string | number;
};

type ECOption = echarts.ComposeOption<TooltipComponentOption | SankeySeriesOption>;

type TFormCollectionValue = {
  searchContent: string;
};

const handleStreamData = async () => {
  const { stream: point }: { stream: string | TStreamQueueNext } = await (
    await fetch('/api/stream/getAllFileStream')
  ).json();

  if (typeof point === 'string') {
    return { links: [], nodes: [], existSet: new Set<string>() };
  }

  let queue: TStreamQueue[] = [{ from: null, next: point }];
  let links: TStreamLink[] = [];
  let nodes: TStreamNode[] = [];
  let existSet = new Set<string>();

  do {
    const data: TStreamQueue | undefined = queue.shift();

    if (!data) break;

    if (!data.next) continue;
    const from = data.from;
    Object.entries(data.next).forEach(([k, v]) => {
      if (from) {
        links.push({ source: from, target: k, value: 1 });
      }
      !existSet.has(k) && (existSet.add(k), nodes.push({ name: k }));
      queue.push({ from: k, next: v });
    });
  } while (queue.length);

  return { links, nodes, existSet };
};

const pathHitRender = (links: TStreamLink[], path: string[]) => {
  const nodes = new Set<string | number>();
  const filterLinks = links.filter((link) => {
    if (path.includes(link.source.toString()) || path.includes(link.target.toString())) {
      nodes.add(link.source);
      nodes.add(link.target);
      return true;
    } else {
      return false;
    }
  });

  return {
    nodes: Array.from(nodes).map<TStreamNode>((node) => ({ name: node })),
    links: filterLinks,
  };
};

const updateStreamOptions = (links: TStreamLink[], nodes: TStreamNode[]): SetStateAction<ECOption> => {
  return {
    tooltip: {
      show: false,
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'sankey',
        animation: true,
        data: nodes,
        links: links,
        label: {
          borderWidth: 120,
          overflow: 'breakAll',
        },
        emphasis: {
          focus: 'adjacency',
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#aaa',
        },
        lineStyle: {
          color: 'source',
          curveness: 0.5,
        },
      },
    ],
  };
};

const StreamFile: NextPage<{}> = () => {
  const [form] = Form.useForm();
  const sanKeyRef = useRef<HTMLDivElement>(null);
  const [option, setOption] = useState<ECOption>({});
  const [links, setLinks] = useState<TStreamLink[]>([]);
  const [nodes, setNodes] = useState<TStreamNode[]>([]);
  const [selectFileNames, setSelectFileNames] = useState<string[]>([]);
  const [existSet, setExistSet] = useState<Set<string>>(new Set());
  const [chart, setChart] = useState<echarts.ECharts>();

  const handleDidMount = async () => {
    const { links: _links, nodes: _nodes, existSet: _existSet } = await handleStreamData();
    setLinks(_links);
    setNodes(_nodes);
    setExistSet(_existSet);

    sanKeyRef.current && setChart(echarts.init(sanKeyRef.current));
  };

  useEffect(() => {
    handleDidMount();
  }, []);

  const handleChartClick = useCallback(
    ({ name }: { name: string }) => {
      const mergeSelectFileNameSet = new Set(selectFileNames);
      mergeSelectFileNameSet.add(name);
      const mergeSelectFileName = Array.from(mergeSelectFileNameSet);

      if (selectFileNames.length === mergeSelectFileNameSet.size) {
        return;
      }

      const { nodes: _nodes, links: _links } = pathHitRender(links, mergeSelectFileName);
      setSelectFileNames(mergeSelectFileName);
      setOption(updateStreamOptions(_links, _nodes));
    },
    [links, selectFileNames],
  );

  useEffect(() => {
    chart?.on('click', handleChartClick);
    return () => {
      chart?.off('click', handleChartClick);
    };
  }, [handleChartClick]);

  useEffect(() => {
    if (chart) {
      chart.setOption(option);
    }
  }, [option]);

  const onFinish = useCallback(
    (value: TFormCollectionValue) => {
      const { nodes: _nodes, links: _links } = pathHitRender(links, [value.searchContent]);
      setSelectFileNames([value.searchContent]);

      setOption(updateStreamOptions(_links, _nodes));
    },
    [links],
  );

  return (
    <MenuLayout>
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          name="searchContent"
          rules={[{ required: true, message: 'the PATH can not be EMPTY!' }]}
          label="Path"
        >
          <Select showSearch allowClear placeholder="please choose a path" style={{ width: '488px' }}>
            {Array.from(existSet).map((listOption) => (
              <Select.Option key={listOption} value={listOption}>
                {listOption}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          )}
        </Form.Item>
      </Form>

      <Layout.Content style={{ flex: 1, marginTop: '20px' }}>
        <div ref={sanKeyRef} style={{ height: '100%' }}></div>
      </Layout.Content>
    </MenuLayout>
  );
};

export default StreamFile;
