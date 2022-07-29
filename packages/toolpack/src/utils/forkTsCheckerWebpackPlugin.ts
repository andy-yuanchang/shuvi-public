import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { Issue } from 'fork-ts-checker-webpack-plugin/lib/issue';
import { createCodeFrameFormatter } from 'fork-ts-checker-webpack-plugin/lib/formatter/CodeFrameFormatter';

export { Issue, createCodeFrameFormatter, ForkTsCheckerWebpackPlugin };
