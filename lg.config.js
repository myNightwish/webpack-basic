const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        publicPath: '/dist/',
        filename: 'build.js',
        // assetModuleFilename: "img/[name].[hash:6][ext]",
        path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
    },
    module: {
        // rules: [
        //     // 会存放多个规则
        //     {   
        //         // 正则：用于匹配文件无类型
        //         test: /\.css$/,
        //         // 用什么规则去处理,数组  use内只有一个时可以直接写loader，升值可以直接写css-loader
        //         use: [
        //             {
        //                 // 表示用的啥loader
        //                 loader: 'css-loader',
        //                 // 在我们使用loader时，需要考虑用户给的配置参数，根据传入的不同
        //                 // options: 
        //                 // query 在5中合并到options中了
        //             }
        //         ]
        //     },
        // ]
        rules: [
            {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1, //让它遇到import 往前找一个loader
                        esModule: false
                    }
                },
                'postcss-loader' // 当它读到这里时会自动去找它的配置
                // {
                    // loader: ,
                    // // 设置参数:希望将来加载的插件:
                    // options: {
                    //     postcssOptions: {
                    //         plugins: [
                    //             // 插件的功能可以对其夹前缀
                    //             'autoprefixer',
                    //             'postcss-preset-env'
                    //         ]
                    //     }
                        
                    // }
                // }
            ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    'postcss-loader',
                    'less-loader'
                ]
            },
            // {
            //     test: /\.(png|svg|gif|jpeg)$/,
            //     use: {
            //         loader: 'file-loader',
            //         // options: {
            //         //     esModule: false  // false不换为esModule
            //         // }
            //         options: {
            //             name: '[name].[hash:6].[ext]',
            //             outputPath: 'img' // 打包到img下面
            //         }
            //     }
            // }
            // {
            //     test: /\.(png|svg|gif|jpeg)$/,
            //     use: {
            //         loader: 'url-loader',
            //         // options: {
            //         //     esModule: false  // false不换为esModule
            //         // }
            //         options: {
            //             name: 'img/[name].[hash:6].[ext]',
            //             limit: 25*1024
            //         }
            //     }
            // }

            // {
            //     test: /\.(png|svg|gif|jpeg)$/,
            //     type: 'asset/resource',
            //     generator: {
            //         filename: "img/[name].[hash:6][ext]",
            //     }
            // }

            // {
            //     test: /\.(png|svg|gif|jpeg)$/,
            //     type: 'asset/inline'
            // }

            {
                test: /\.(png|svg|gif|jpeg)$/,
                type: 'asset',
                generator: {
                    filename: "img/[name].[hash:6][ext]",
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 3*1024
                    }
                }
            },
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset/resource',
                generator: {
                    filename: "font/[name].[hash:3][ext]",
                }
            }
        ]
    }
}