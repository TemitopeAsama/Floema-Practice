import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import config from './webpack.config.js';

export default merge(config, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'public')
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
});
