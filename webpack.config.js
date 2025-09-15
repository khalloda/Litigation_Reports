const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      main: './src/js/main.js',
      admin: './src/js/admin.js',
      dashboard: './src/js/dashboard.js',
      rtl: './src/scss/rtl.scss'
    },
    
    output: {
      path: path.resolve(__dirname, 'public/assets'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/assets/'
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'),
                    require('postcss-rtl')({
                      // RTL plugin for automatic RTL CSS generation
                      onlyDirection: 'rtl'
                    })
                  ]
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [require('autoprefixer')]
                }
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[contenthash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]'
          }
        }
      ]
    },
    
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css'
      }),
      
      new HtmlWebpackPlugin({
        template: './src/templates/base.html',
        filename: '../templates/compiled/base.html',
        inject: false,
        templateParameters: {
          isProduction: isProduction
        }
      }),
      
      // RTL-specific CSS extraction
      new MiniCssExtractPlugin({
        filename: isProduction ? 'rtl.[contenthash].css' : 'rtl.css'
      })
    ],
    
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            }
          },
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 3000,
      hot: true,
      open: true,
      proxy: {
        '/': {
          target: 'http://lit.local',
          changeOrigin: true,
          secure: false
        }
      }
    },
    
    resolve: {
      extensions: ['.js', '.scss', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@js': path.resolve(__dirname, 'src/js'),
        '@scss': path.resolve(__dirname, 'src/scss'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@fonts': path.resolve(__dirname, 'src/fonts')
      }
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};
