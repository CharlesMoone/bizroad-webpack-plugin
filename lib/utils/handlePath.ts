import { IBizroadOptions } from '../types';

export const handlePath = (path: string, { context }: IBizroadOptions) => path.split(context).reverse()[0];
