import { NextApiRequest, NextApiResponse } from 'next';

import fileStream from './fileStream.json';

type TStreamQueueNext = {
  [key in string]: string | TStreamQueueNext;
};

type Data = {
  stream: string | TStreamQueueNext;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let stream: string | TStreamQueueNext = `$$__TEMP__STREAM__$$`;
  if (process.env.NODE_ENV === 'development') {
    stream = fileStream;
  }

  res.status(200).json({ stream });
}
