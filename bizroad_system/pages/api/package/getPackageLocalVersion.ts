import { NextApiRequest, NextApiResponse } from 'next';
import process from 'child_process';

type Data = {
  version: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  process.exec(`cd .. && npm ls ${req.query.packageName}`, (_, stdout) => {
    res.status(200).json({ version: stdout });
  });
}
