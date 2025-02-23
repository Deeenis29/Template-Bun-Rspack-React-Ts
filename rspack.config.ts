import type { Configuration } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';

const browsersTargets = [
  'chrome >= 87',
  'edge >= 88',
  'firefox >= 78',
  'safari >= 14'
];

const config: Configuration = {
  entry: {
    main: './src/main.tsx',
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    isDev ? new ReactRefreshPlugin() : undefined, 
    new rspack.ProgressPlugin({}),
  ].filter(Boolean), 
  experiments: {
    css: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
        resourceQuery: { not: [/react/] } // Evita conflictos con react-svg
      },
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: browsersTargets
              },
            },
          },
        ],
      },
    ],
  },
};

export default config;
