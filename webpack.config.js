var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var host = '127.0.0.1';
var port = '8063';
var publicPath = 'http://' + host + ':' + port + '/';

module.exports = {
    //页面入口文件配置，可传入字符串、数组、对象三种格式
    entry: {
        index: './src/index',
    },
    output: {
        path: path.resolve(__dirname, './output'),
        filename: 'js/[name].bundle.js',
        publicPath: publicPath
    },
    module: {
        //加载器配置
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader?minimize'
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'sass-loader']
            })
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 500,
                    name: 'images/[name].[ext]?[hash]'
                }
            }]
        }, {
            test: /\.(html)$/,
            loader: 'html-loader?attrs=img:src'
        }, {
            test: /\.(js)$/,
            exclude: /(node_modules|lib)/,
            use: [
                "babel-loader",
                "eslint-loader"
            ],
        }]
    },
    //插件项
    plugins: [
        // 启用作用域提升（scope hoisting）
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 部分 loader 配置信息
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        autoprefixer({
                            browsers: ['last 10 versions', 'Android >= 4.0'],
                            //是否美化属性值 默认：true 
                            cascade: true,
                            //是否去掉不必要的前缀 默认：true 
                            remove: false
                        }),
                        cssnano({
                            preset: ['default', {
                                discardComments: {
                                    removeAll: true,
                                },
                            }]
                        })
                    ];
                }
            }
        }),
        // 代码热替换
        new webpack.HotModuleReplacementPlugin(),
        // 允许错误不打断程序
        new webpack.NoEmitOnErrorsPlugin(),
        // 单独抽离 CSS
        new ExtractTextPlugin("./css/[name].bundle.css"),
        // 生成最终HTML
        new HtmlWebpackPlugin({
            filename: 'html/index.html',
            template: './src/html/index.html',
            inject: false,
            hash: true,
            minify: {
                // 移除HTML中的注释
                // removeComments: true,
                // 删除空白符与换行符   
                collapseWhitespace: false,
                // 删除空白属性
                removeEmptyAttributes: true,
                sortAttributes: true,
                sortClassName: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                trimCustomFragments: true
            }
        }),
        // 打包模块大小追踪
        new BundleAnalyzerPlugin()
    ],
    // 直接在源代码上进行查看和调试，打包速度效率降低 -- source-map
    // sourceMap 是 blunde 后的代码，无法调试，但打包速度效率最高 -- eval
    devtool: 'cheap-source-map',
    devServer: {
        host: host,
        port: port,
        // gzip
        compress: true,
        // 不跳转
        historyApiFallback: false,
        // 实时刷新
        inline: true,
        // 隐藏 webpack 包 bundle 信息，错误和警告仍然会显示。
        noInfo: false
    }
};

if (process.env.NODE_ENV === "production") {
    module.exports.plugins = (module.exports.plugins || []).concat([
        // JS 压缩插件
        new webpack.optimize.UglifyJsPlugin({
            ecma: 6,
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
                reduce_vars: true
            }
        }),
        // CommonsChunkPlugin 分包
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: './js/vendor.common.js',
            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
            ),
        })
    ]);

    module.exports.devtool = "eval";
}