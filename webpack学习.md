### 1、前言

#### 1.1、webpack出现的契机：

与前端发展密切联系

- web 10.时代  主要是编写静态页面 表达验证与动效

- Web2.0时代   ajax的出现 不仅仅展示页面，还可以交互   管理数据

- 大前端开发时代：

  - 要做的事越来越多   
  - 当下模块开发方式，但不同浏览器支持不同，且不同的模块化方式不一样
  - 开发过程中，还会用es6+  ts  less sass  浏览器默认不能处理
  - 实时监听文件变更，能直接在浏览器上看到更改后的内容
  - 项目的结果还需要打包压缩处理

  因此， webpack就出现了，来帮我们解决这些问题。

#### 1.2、webpack能做什么

- webpack功能：为构建JS应用提供**静态模块打包**工具
  - 打包：将不同类型的资源按模块处理进行打包
  - 静态：打包后，最终**产出静态资源**
  - 模块：webpack默认支持各种模块化开发

- 实验分析：

  - 在public目录下新建index.html

    ```html
    <body>
        <script src="./main.js" type="module"></script> 
    </body>
    ```

  - 新建JS目录下 util.js文件

    ```js
    const sum = (m, n) => {
        return m+n;
    }
    const  square = (m) => {
        return m*2;
    }
    export {sum, square}
    ```

  - 新建JS目录下  api.js

    ```js
    const getInfo = () => {
        return {
            name: 'zcs',
            age: 40
        }
    }
    module.exports = getInfo;
    ```

  - 在入口文件index.js中导入

    ```js
    import {sum, square} from './js/utils.js'
    
    console.log(sum(1, 3));  //这种esmodule的支持需要配置script 中的type为module
    console.log(square(4))
    
    
    //但即使配置了type  commonJS谷歌仍然不支持，此时webpack登场帮我们姐姐
    const getInfo = require('./js/api')  
    console.log(getInfo())
    ```

  - 安装好webpack及cli：

    此时直接执行webpack ，打包时，会自动去src目录下的index.js文件下去查找,进行依赖分析；

    完成编译自动生成了dist文件夹。里面有main.js。他就是打包生成的产物。

    index.html中引入dist下的main.js文件，就可以在浏览器中看到运行结果

#### 1.3、局部webpacK：

假如当前项目在5上的，分享给被人就会有问题。因为别人的跟我的不匹配。如何用局部完成打包操作呢？

- 局部安装 -d的方式  ---执行 npx  webpack 


- 假如在index.js做了修改：想自定义入口文件名字，希望产出文件放在指定目录下：ouputPath
  - 方式1：打包命令行  很麻烦
  - 方式2：配置文件更方便

- 导出配置文件中：

  ```js
  const path = require('path');
  modulex.exports = {
      entry: './src/index.js',
      output: {
          filename: 'build.js',
          path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
      }
  }
  ```

  在package.son中：

  ```js
    "scripts": {
      "build": "webpack"
    }
  ```


- 修改打包配置文件命名：lg.webpack.js

  ```js
  则在package.json中：scripts：{
  	bulid: webpack --config lg.webpack.js
  }
  ```

- 依赖图：

  webpack在打包时会有个依赖关系：基于入口文件：index.js，在里面使用语法导入别的模块，可以通过不同的loader转换。

  - 当你没有被某个模块引入时，webpack打包时不会去找他，在构建依赖图不会去做打包
  - 进一步的，可能模块文件进入了，但是实际没有使用。会有tree  shaking做优化

### 2. loader

#### 2.1、css-loader

- 新建一个login.js文件：

  ```js
  // 模拟登陆逻辑:将来调用时  document.body.appendChild(login())
  function login(){
      const oh2 =  document.createElement('h2');
      oh2.innerHTML = `欢迎来到多啦A梦的世界`;
      oh2.className = 'title';
      return oh2;
  } 
  document.body.appendChild(login())
  ```
  
- 在入口文件index.js中引入login.js

- 执行打包编译：在index.html中引入

  ```html
  <script src="../dist/build.js" type="module"></script>
  ```

- 添加css样式：新建css文件夹，添加login.css， 并在login.js中引入：

  login打包时，入口会先找index.js ---再找login.js  ---再找login.css

  ```js
  import '../css/login.css'
  ```

  - 此时重新打包编译，会报错提示需要loader处理。

- 为什么webpack需要loader？

  默认webpack不能处理css文件，需要有一个人对css文件进行转换，让webapck去执行转换的内容

- loader是什么？

  是一个模块，能够将转成能够识别的模块，导出一个函数，后续会详细讲解

- webpack在工作时，想要处理非JS模块的类型，怎么办？

  loader。需要安装+配置：webapck5中只需要行内loader+配置文件添加loader的方式

  行内loader： 

  ```
  import 'css-loader!../css/login.css'
  ```

  此时不会再报错，但样式不会生效。为什么呢？

  - 这种loader只会让webpack可以识别，但不能将样式在界面生效。3中css生效的方式都不会支持

  配置文件的loader：添加module

  ```js
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
          rules: [{
              test: /\.css$/,
              use: ['css-loader']
              }
          ]
      }
  ```

  - 配置完成之后，可以正常打包，但样式并没有显示出来：

    CSS-loader 只能让we识别css语法，还需要style-loader才能展示  注意配置loader的顺序，默认从右往左，从上往下：

    ```js
    rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
                }
            ]
    ```

  - 此时样式就正常生效了：会生成呢个一个style标签，将样式添加进去

    ```
    <style>.title {  background-color:blue;}</style>
    ```

#### 2.2、Less-loader

-  编写login.less文件：

  ```less
  @bgColor: green;
  @fontSize: 100px;
  
  .title {
      background-color:@bgColor;
      font-size: @fontSize;
  }
  ```

- 使用命令行：只对某个模块进行编译，输出到指定目录下：

  ```js
  npx less ./src/css/login.less  //指定编译
  npx less ./src/css/login.less index.css   //指定编译为index.css文件src目录下
  ```

- 也可以使用配置文件：

  ```js
  {
    test: /\.less$/,
    use: ['style-loader', 'css-loader', 'less-loader']
  }
  ```

#### 2.3、browserslitrc 工作流程

- 要求：
  - 当前开发工程化的方式；
  - 需要考虑兼容性的支持：JS比如ES6  CSS 比如某些选择器
  - 如何实现兼容，要兼容哪些平台。  

- 方式1：配置package.json

  ```
    "browserslist": [
      ">1%",
      "last 2 version",
      "not dead"
    ]
  ```

- 方式2：专门有.browserslistrc

  ```
  在里面写所有的要求
  ```

- 查看兼容的浏览器

  ```
  npx browserslist
  ```

#### 2.4、postcss

- 为什么会有？

  工程化开发css，存在配置项筛选出要兼容的平台。利用这个工具可以

- 是什么？

  可以将css文件处理完成，交给css-loader处理即可。在webpack中，通过javascript转换样式的工具

- 使用：

  - 不支持命令行的方式，除非安装cli

    ```
    npm i postcss-cli -d
    ```

  - 假如我们指定兼容哪些平台，前缀不一样，会自动加前缀，做兼容性处理：autoprefix

    在test.css中

    ```
    .title {
        transition: all 0.5s;
        user-select: none;
    }
    ```

    在login.js中引入文件

    ```
    import '../css/test.css'
    ```

  - 重新打包，可以发现控制台中style标签已经添加了样式内容，但是**并没有为我们自动补齐前缀：**

  - 处理test.css文件

    ```
    npx postcss -o ret.css ./src/css/test.css
    此时下面就生成了ret.css
    ```

    它的生成产物，好像只是复制了一遍，并没做什么。因为postcss它本身只是一个工具，希望它做啥还需要插件拿进来

    ```js
     npm i autoprefixer -d  //安装插件：具体的功能，实现前缀添加
    ```

  - 重新处理test.cs文件

    ```
    npx postcss --use autoprefixer -o ret.css ./src/css/test.css 
    ```

  - 此时产物ret.css就添加了前缀

    ```css
    .title {
        display: grid;
      	color: #12345678;
        transition: all 0.5s; 
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
    }
    ```

- 如果是以配置的方式：

  ```
  npm 安装post-loader
  配置：use: ['style-loader', 'css-loader', 'postcss-loader']
  ```

  - 但是postcss-loader什么也做不了，所以也不会自动添加。

- 配置lg.config.js

```js
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      // 设置参数:希望将来加载的插件:
      options: {
        postcssOptions: {
          plugins: [
            // 插件的功能可以对其夹前缀
            require('autoprefixer')
          ]
        }
      }
		}]
},
```

- 对新的语法做处理：另一个东西：postcss-preset-env

##### postcss-preset-env

这是一个预设，是插件的集合。比如我们在上面定义样式时，写了color: #12345678，这是不同于常见的rgb写法。而autoprefix时不能帮我们做这种新语法。我们还需要去配置里修改，但是这很麻烦。so   postcss-preset-env登场。

- 它里面默认集合了常见的css转换，因此安装+配置即可

  ```js
  添加插件引入：
  plugins: [
    // 插件的功能可以对其夹前缀
    require('autoprefixer'),
    require('postcss-preset-env')
  ]
  ```

- 可以简写为：

  ```js
  plugins: [
    // 插件的功能可以对其夹前缀
    'autoprefixer',
    'postcss-preset-env'  //它有了，不用写autoprefixer
  ]
  plugins: ['postcss-preset-env'  //它有了，不用写autoprefixer]  最终简写
  ```

- 针对CSS文件如此，Less文件也是如此，webpack支持专门搞个文件，设置这些，就不用再copy配一遍，很方便管理配置：新建postcss.config.css（不能随便命名）

  ```js
  module.exports = {
       plugins: [
          require('postcss-preset-env')  //可以简写
          // require('autoprefixer')
       ]
  }
  ```

  lg.config.js中只需要写对应loader：比如匹配css

  ```js
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader'  // 当它读到这里时会自动去找它的配置
    ]
    test: /\.less$/,
      use: [
        'style-loader', 
        'css-loader', 
        'postcss-loader',
        'less-loader'
      ]
  }
  ```

#### 2.5、import loader

- 在test.css文件中：拆解部分login.css文件 给test.css

  ```css
  .title {
      transition: all 0.5s;
      user-select: none;
  }
  ```

- 在login.css文件中导入拆解走的样式：

  ```css
  @import './test.css';
  
  .title {
      color: #12345678;   
      background-color: rgba(155, 118, 70, 0.714);
  }
  ```

- 重新打包，成功。但控制台中发现兼容性的样式并没有，autoprefix配置没问题。so，@import导入的样式无法生效，为什么？

  - 按照loader解析顺序：

    - postcss-loader经过分析配置后，会对生成的css文件生效。

    -  然后，login.css文件@import导入了tetst.css文件。 postcss-loader拿到了login.css的代码后，分析基于筛选条件并不需要做额外处理，so会把代码直接交给了css-loader。

    - css-loader可以处理@import  media url这类问题。此时拿到了test.css文件。此时内部有需要兼容性处理的loader，但此时loader不会再回头找postcss-loader。它直接交给了style-loader处理。
    - 所以我们在页面没有看到那块处理

- 解决：import loader属性，此时就可以看到import的模块进行了兼容性处理

  ```js
  {
    loader: 'css-loader',
      options: {
        importLoaders: 1 //让它遇到import 往前找一个loader
      }
  }
  ```

#### 2.6、file-loader

-  打包图片：比如img的src   background的url引入图片资源


##### img标签实验：

- 定义image.js文件

  ```js
  function packImg(){
      //  比如页面上有标签：设置src属性
      // 容器元素
      const oEle = document.createElement('div');
      return oEle;
  }
  
  document.body.appendChild(packImg());
  ```

- 在入口文件index.js引入：

  ```js
  import './js/Image'   // 引入依赖
  ```

​			重新打包生成，可在控制台中看到标签

- 添加图片，本地img文件夹放了a b两张图，修改img.js，引入图片并打包。此时会报错提示需要合适的laoder

  ```js
  function packImg(){
      //  比如页面上有标签：设置src属性
      // 容器元素
      const oEle = document.createElement('div');
      const oImg = document.createElement('img');
      oImg.src = require('../img/aa.jpeg');
      oEle.appendChild(oImg); 
      return oEle;
  }
  
  document.body.appendChild(packImg());
  ```

- file-loader功能：

  - 能帮我们返回一个js能识别的东西
  - 可以把要处理的 二进制文件拷贝到指定目录。如果我们没有指定，会拷贝到dist目录里

- 安装该loader 并配置：

  ```js
  {
    test: /\.(png|svg|gif|jpeg)$/,
    use: ['file-loader']
  }
  ```

- 此时我的页面显示不正常，控制台报错：

  ```js
  Automatic publicPath is not supported in this browser。
  ```

  修改lg.config.js配置文件的outpath的publicPath

  ```js
  output: {
    publicPath: '/dist/',  
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
  },
  ```

- 此时不报错，控制台会有img，但图片不显示，且src变成了 Object module。在webpack5中，file-loader默认返回的是一个对象，东西放在default中，就必须访问dedault。修改img.js，就ok啦

  ```js
  oImg.src = require('../img/aa.jpeg').default;
  ```

- img.js中不想通过default的方式

  - 方式1：配置file-loader：

  ```js
  {
    test: /\.(png|svg|gif|jpeg)$/,
      use: {
        loader: 'file-loader',
          options: {
            esModule: false  // false不换为esModule
          }
      }
  }
  ```

  - 方式2：通过esModule的导入方式

  ```js
  import oImgSrc  from '../img/aa.jpeg';
  oImg.src = oImgSrc;
  ```

##### background的引入实验

- 修改img.js，重新打包生成可看到dom结构已经生效

  ```js
  const oEle = document.createElement('div');
  const obgImg = document.createElement('div');
  obgImg.className = 'bgbox';
  
  oEle.appendChild(obgImg); 
  return oEle;
  ```

- 新建css文件夹下的img.css

  ```css
  .bgbox {
      width: 500px;
      height: 400px;
      border: 1px solid red;
      background: url('../img/bb.jpeg');
  }
  ```

- 修改img.js：执行打包

  ```
  import '../css/img.css'
  ```

  此时dist下有2个图片：有个是二进制图片，但页面并没有正确显示图片

- 在打包时，在处理img.js时又依赖img.css，so postcsss-loader会去处理，并没又太多变化，又交给css-loader。该loader可以处理bg-img。而css-loader会将bg-img替换为require语法。返回的是esModule，导出加了default。但是我们理想的，是不要你返回esModule，直接返回资源即可：

  -  此时，css-loader配置中更改esModule：此时图片便可正常显示，而且dist下不会有生成中间产物

    ```js
    options: {
      importLoaders: 1, //让它遇到import 往前找一个loader
      esModule: false
    }
    ```

- 修改打包的文件以想要的方式生成：

  ```js
  options: {
    name: '[name].[hash:6].[ext]',
    outputPath: 'img' // 打包到img下面，但一般不这样写
  }
  options: {
    name: 'img/[name].[hash:6].[ext]'  //这样也可以，会自动生成img，图片在这下面
  }
  ```

#### 2.7、url-loader

- ##### 实验

  - 安装  配置：此时图片正常显示，但dist下图片不会生成img。也没图片

    ```js
    {
      test: /\.(png|svg|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
            // options: {
            //     esModule: false  // false不换为esModule
            // }
            options: {
              name: 'img/[name].[hash:6].[ext]',
            }
        }
    }
    ```

- File-loader与url-loader

  - File-loader：将当前图片的名称返回，路径返回，并将要打包的图片资源拷贝到dist目录下。

    - 缺点：在访问静态资源的时候，需要额外发请求

  - 但url-loader：将当前要打包的图片资源以base64的格式加载到代码中，所以不会看到dist目录下，控制台也可以看到。

    - 优点：不需要额外法请求，减少请求次数。

    - 缺点：图片过大时，请求慢，对首屏不好。

  limit属性可以做拆分：大于该值，做拷贝。小于该值，转64

  ```js
  options: {
    name: 'img/[name].[hash:6].[ext]',
    limit: 25*1024
  }
  ```

#### 2.8、asset：

- 在webpack5中，可以通过asset直接配置这两个loader，不需要单独分开配

  ```
  - Asset/reesouse: 可以将目标支援拷贝到指定目录  file-loader
  - asset/inline:   url-loader
  - Asset/source: raw-loader  不常用
  - asset/  设置类似limit等限制
  ```

- 修改配置：lg.config.js，打包后，图片正常显示

  ```js
  {
    test: /\.(png|svg|gif|jpeg)$/,
    type: 'asset/resource',
  }
  ```

- 再修改lg.config.js：

  - 全局方式：全局统一设置：需要找到output配置，打包完成，仍然正常使用，img也生成

    ```js
    output: {
            publicPath: '/dist/',
            filename: 'build.js',
            + assetModuleFilename: "img/[name].[hash:6][ext]", // 不用加. ext会自动加
            path: path.resolve(__dirname, 'dist') //必须为绝对路径，so要path模块
        },
    ```

    但这种配置方式是全局的，将来还有可能处理其他静态资源，比如字体，也会被打包进入这该文件夹

  - 局部的方式：lg.config.js，打包编译即可成功

    ```js
    {
    		test: /\.(png|svg|gif|jpeg)$/,
        type: 'asset/resource',  
        generator: {
            filename: "img/[name].[hash:6][ext]",
        }
    }
    ```

    asset/inline的方式

    ```js
    {
      test: /\.(png|svg|gif|jpeg)$/,
       type: 'asset/inline'    //不会产出图片，且没有generator
    }
    ```

    如果希望做限制，还需要配置parser、generator

    ```js
    {
      test: /\.(png|svg|gif|jpeg)$/,
        type: 'asset',
          generator: {
            filename: "img/[name].[hash:6][ext]",
          },
            parser: {
              dataUrlCondition: {
                maxSize: 3*1024  //此时超过3k的会生成在img，以静态资源的形式引入
        				// 没有3k的会以 data uri的形式引入        
              }
            }
    }
    ```

  - #### asset还可以处理字体：略

    ```js
    {
      test: /\.(ttf|woff2?)$/,
      type: 'asset/resource',
        generator: {
          filename: "font/[name].[hash:3][ext]",
      }
    }
    ```

### 3、插件plugin

插件用来干什么呢？你如说，我们更改了配置项，就需要删除dist目录，重新打包生成编译产物，再运行；再比如我们每次打包完成后，每次都要手动修改，也比较麻烦。插件就能帮我们做这些

- 当有插件时，为什么还会有loader呢？

  核心功能不同

  - 对loader而言，它主要是对特定类型的（非JS）模块进行转换。而loader就承担了这些识别转换的功能。工作的时机就是读取某个特定类型的资源时

  - 而插件，可以做的更多。它同样存在自己的生命周期，我们可以认为打包的过程就是一个完整的流水线，那么当前的插件可以在流水线上的任一时机被插进来。比如说，我们希望在打包开始时做一些事情，或在打包进行到某一时机点做些事情，再比如希望写。而loader并不满足这种需求

#### 3.1、clean-webpack-plugin

自动清除打包目录dist：让你不用每次手动清除

- 实验：

  - 本地安装：clean-webpack-plugin

  - 配置：

    - 一般plugin的书写：添加plugins

    ```js
    plugins: [
         // 将来在这里写的时候，就是一个plugin，
      // 每个plugin本质就是一个类：自己安装的插件 
      class myPlugin {
        // new 的时候会执行的方法
        constructor(){
          
        }
        // 允许传的时候传入参数this等
        apply(){}
      }
    ]
    ```

    配置：lg.config.js配置文件的导出文件

    ```js
    // 导入插件
    const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    在导出配置中：
    plugins: [
            new CleanWebpackPlugin(), // 内部具体实现去看github官网
    ]
    ```

#### 3.2、html-webpack-plugin

- 实验：

  - 本地安装：html-webpack-plugin

  - 配置：lg.config.js配置文件的导出文件

    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    
    plugins: [
      new CleanWebpackPlugin(), 
      new HtmlWebpackPlugin()
    ]
    ```

  - 打包出的index.html 中的title默认：Webpack App。默认的值与该插件中文档规定过有关，我们可以在new的时候传入参数，定义打包生成的index.html的信息

    ```js
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin自定义'
    })
    ```

  - 自定义index.html模板：比如说Vue中所有组件都需要挂载在#app的div上，so需要自定义的样式

    - 新建**public文件夹**，新建index.html文件

      ```js
      <title>
        <%= htmlWebpackPlugin.options.title %>  // 不能随便写或不写，不写传参不生效
        </title>
      </head>
      <div id="app">index.html测试</div>
      ```

    - 修改配置信息：

      ```js
      new HtmlWebpackPlugin({
        title: 'html-webpack-plugin自定义',
        // 希望打打包时找到自己的模板
        template: './public/index.html'
      }),
      ```

- 实验：希望实现像Vue那样的模板，引入资源：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <link>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   // 这里的路径是常量
      <link rel='icon' href="<%= BASE_URL %>"favicon.ico></link>
      <title>
          <%= htmlWebpackPlugin.options.title %>
      </title>
  </head>
  <body>
      <div id="app">index.html测试</div>
  </body>
  </html>
  ```

  - webpack-define-plugin  内置插件：允许我们往插件中填充数据

    ```js
    const {DefinePlugin} = require('webpack')   // 内置
     
    // 内部可以定义常量，就是键值对
    // DefinePlugin配置完成后，会把我们设置的值原封不动拿出去
    // 将来如果我们希望以字符串的形式出去，还需要包一层引号
    new DefinePlugin({
    	BASE_URL: "'./'"   // 会去public目录下去查找
    })
    ```

  - 打包生成结果：

    ```html
    <!doctype html>
    <html lang="en">
    <link>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" href="./" favicon.ico>  // 已生效
    <title>html-webpack-plugin自定义</title>
    <script defer="defer" src="/dist/build.js"></script>
    
    <body>
        <div id="app">index.html测试</div>
    </body>
    </html>
    ```

#### 3.3、babel

- 为什么需要babel？

  虽然目前的脚手架帮助完兼容性处理。但是react会有jsx  ts es6这些对于浏览器默认不能识别。so希望产出为浏览器能够直接使用的，但是这些特性并不是所有浏览器都能识别的。而bbel可坐到

- babel是什么？

  它就是工具，本身不具备任何功能

  index.js

  ```js
  const title = 'front_end';
  
  const foo = () => {
      alert(title)
  }
  
  foo()
  ```

修改配置导出工具

```js
mode: 'development',
output: {
   filename: 'js/build.js',
}
```

- 此时打包产物build.js，一大堆代码。但是可以看出，只是对JS代码做了拷贝 输出一份，没有做处理就，交给浏览器使用。因此我们希望有人能够帮我们做这件事，就是babel

##### babel实验-命令行的方式

- babel是一个微内核结构，核心操作都放在core里，你只需要针对不同语法安装不同的包即可。

  ```js
  npm i @babel/core -d
  ```

- 但默认情况下，我们不能在命令行中安装使用的babel。怎么办呢？还需要安装@babel/cli。这样就可以直接npx babel

  ```
  npm i @babel/cli -d
  ```

  ```
  npx babel src --out-dir build
  src:指定src下的所有文件   build 新建build文件夹，处理后的结果放在这里
  ```

- 打开build的文件夹的main.js文件。与原文件index.js一模一样。为什么babel为什么啥也没做呢？

  因为它只是工具。它只是能完成转换，但是具体啥转换，需要插件支持才可以。比如箭头函数 

  ```js
  npm i @babel/plugin-transform-arrow-functions -d  // 处理箭头函数
  npm i @babel/plugin-transform-block-scoping -d  //处理const
  ```

- 此时执行：

  ```js
  npx babel src --out-dir build --plugins=@babel/plugin-transform-arrow-functions
  
  // 同时完成箭头+const转换
  npx babel src --out-dir build --plugins=@babel/plugin-transform-arrow-functions,@babel/plugin-transform-block-scoping
  ```

- 生成的main.js中箭头函数就转换成了普通函数

  当前每次转换一类，都需要转换，因此提供了**预设。这样就不能每次配置了，它涵盖了大部分ES6的语法**

- 安装preset

  ```
  npm i @babel/preset-env -D
  ```

- 执行：此时就完成了转换

  ```
  npx babel src --out-dir build --presets=@babel/preset-env 
  ```

#### 3.4、babel-loader

##### 实验:-文件配置方式

- 安装：npm i babel-loader -D

- 配置导出文件：

  ```js
  {
    test: /\.js$/,
      use: ['babel-loader']
  }
  ```
  
- 重新打包的dist：什么都没做，如果想做。必须指明插件，指明参数。so 导出文件需要重新配置

  ```js
  {
  	test: /\.js$/,
    use: [{
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-transform-arrow-functions',
            '@babel/plugin-transform-block-scoping' 
          ]
        }
      }]
  }
  ```

- 同样，不想要全家桶式的不用每次专门配置，也可以使用预设，就可以放心大胆用：此时配置方式：

  ```js
  {
    test: /\.js$/,
    use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']   //需要提前安装
        }
      }
   ]
  }
  ```

  - 这里打包出来的文件，会与browserlist支持的兼容想关联的，比如当你配置的希望只兼容支持的浏览器是很高很新版本，此时babel-loader转出来的语法可能就是ES6最新的。

  - 还可以通过presets的参数的形式指定目标兼容：

    此时bebel-loader最终结果会 {targets: 'chrome 91'为主，但只对当前loader有用。建议在browserlist方便管理，且

    ```js
    presets: [
      [
        '@babel/preset-env', 
        {targets: 'chrome 91'}
      ]
    ]
    ```

##### babel专门配置文件

- 方式1：**babel.config.js**（json、cjc、mjs）  现在babel是多包管理的方式，babelcore只是一个微内核，一个仓库下面有很多功能，每个功能一个包。这样的配置方式更适合一些    推荐
- 方式2：babelrc.json （js） 在babel7之前用的较多，那时每个babel下边对应一个仓库，这样更符合

- 实验：

  - lg.config.js

    ```js
    {
      test: /\.js$/,
      use: ['babel-loader',]
    }
    ```

  - babel.config.js

    ```js
    module.exports = {
        presets: ['@babel/preset-env']
    }
    ```

#### 3.5、polyfill

- 在4时，默认不做这些处理，已经加进去了。但这样打包后臃肿。5基于打包优化速度的考虑被移除，需要进行自己安装。

- 是什么？

  填充。

  - 如果你不喜欢打包出来的文件是eval格式，可以在导出文件配置添加devtoo

    ```js
    entry: './src/index.js',
    mode: 'development',
    +devtool: false,
    ```

  - 假如在index.js中写了promise语法，我希望最终打包产出物中，**应该要考虑到**浏览器内部实现了promise，否则不能使用。所以，polyfill就是能够实现这个功能的函数，能够对功能进行填充。preset预设能帮我们做很多事情，但遇到Promise  generator 等更加新的语法时，可能不会做转换。而polyfill就会做这件事。

##### 实验：

- 安装：npm i @babel/ployfill --s

  - 安装后提示：

  - 如果要使用，不建议直接安装了，而是引用core下面的stable   regenerator-runtime

    tc39参与对ecma语法的制定，用core下面的stable是将已经制定的标砖的加载进来。只要引进来，babeloader就可以把功能填充过来。

    当我们需要promise等，其实是基于generator实现等，而 regenerator-runtime引进来也可以进行填充

- 卸载，polfill，安装这两个包：

  ```
  npm i core-js regenerator-runtime
  ```

- 配置babel单独配置文件：

  ```js
  module.exports = {
      // 为什么要给preset-env设置参数呢？
      // babel是工具，本身不干，转换es6语法需要告诉：兼容谁-browserc文件
      // 需要：找人完成真正的兼容  --插件的集合preset-env
      // 问题：preset-env不能完成所有功能转换 --polyfill
      
      presets: [
          // 传参时是以数组，一组组的
          [
              '@babel/preset-env',
              {
   // 取值： false默认、usage（根据用户源代码当中所使用到的新语法  按需填充）看代码不看浏览器
                 // 功能：FALSE：不对当前的JS做poll填充
                 // useBuiltIns: false
                
        //取值： usage（按需填充）：对版本有要求  默认2  如果安得是3 报错 ，so还需配置版本corejs
                  // useBuiltIns: 'usage',
                 //  corejs: 3
                
        //取值： entry: 依据所要兼容的浏览器进行填充 看浏览器不用代码
         // 比如要兼容10款浏览器，它不管代码里用没用  只要10个需要啥就填充啥
         //  安装后 需要手动import引入过来 否则会不生效
              }
          ]
      ]
  }
  ```

  - usage需要注意：开发时可能会用第三方的包，这个包可能也需要polyfill，假如它用了promise，我自己可能也用promise。so  我们需要加配置，去掉node_modules内的东西：

    ```js
    {
      test: /\.js$/,
      exclude: '/node_modules/',   // 不要对包ployfille
      use: ['babel-loader']
    }
    ```

#### 3.6、copy-webpack-plugin

##### 背景：

- 无论是自己使用webpack打包，还是基于脚手架  内部都有一个基于资源拷贝问题：public里面会存放很多资源，但不希望w对其做打包操作。只需要w打包后能够产生一个自定义的静态资源目录：将来可以将静态资源目录在服务器上部署。我们希望能将这部分直接拷贝过去
- 而之前的plugin，只是基于入口文件：src下的index.js生成一个静态HTML文件，但是文件里可能会通过src引入图标，文档等都不能进行处理。so  我们希望对静态资源做拷贝   copy-webpack-plugin

##### 实验

- 安装：npm i copy-webpack-plugin -d

- 配置：lg.config.js的plugin

  ```js
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  
  new CopyWebpackPlugin({
              // patterns是数组，里面可以放很多项配置拷贝项
              patterns: [
                  {
                      from: 'public',
                      // to：默认不写，会自动找output配置中设计的目录
                  }
              ]
          })
  ```

  - 不能直接这样写，因为之前的webpack配置过  将public下的index.html作为模板拷贝到dist目录下，这里又去做了这样类似的事。因此，不是所有的东西都需要拷贝时，可以排除：

    ```js
     {
        from: 'public',
        // to：默认不写，会自动找output配置中设计的目录
        globOptions: {
          ignore: ['index.html']  //忽略不想拷贝的东西
        }
      }
    ```

  - 但仍然有问题：坑，当前 from: 'public',要求必须写**/

  - 遇到版本坑：打包时报错：HookWebpackError: Invalid host defined options  降级到9版本

    https://stackoverflow.com/questions/70080671/copy-webpack-plugin-error-invalid-host-defined-options

#### 3.7、webpack-dev-server

当你的项目开发到一定阶段了，想调试。

- 做法1：

  - npm run build  产出静态资源到dist目录。此时dist下面有index.html，此时将它放在浏览器运行就可以了

  - 这是在使用file协议直接看，只要出现更新后，手动进行更新

    ```
    file:///Users/zhoumoling/kaifa/test/babel/dist/index.html
    ```

- 做法2：使用插件liver server  自动更新 不用手动刷新

  ```
  http://127.0.0.1:5500/dist/index.html
  ```

  此时接着修改代码，我希望能看到最新的修改效果。但是看不到，因为打包产物没有变。

so，希望有人能帮忙做到这样的事情：**当文件下面变更后，能自动帮我们完成编译，结合liver server 将生成的内容展示出来**

首先webapck提供了2种模式：

##### 1、watch命令的方式

- 修改package.json：添加watch

  ```
  "scripts": {
      "build": "webpack --config lg.config.js --watch"
    },
  ```

  - 此时它会监控项目下面的文件，当代码更新时，就能看到最新的结果

##### 2、配置文件方式

- lg.config.js

  ```js
  + watch: true,
  entry: './src/index.js',
  mode: 'development',
  devtool: false,
  ```

  - 默认watch是fasle，这是出于性能的考虑。

##### 不足分析：

分析：当前两种模式能实现更新，但不是效率最优的。跟dev-server比还有不足：

- 这种模式需要watch+dev-server的加持，某个文件发生了改变都会使得webpack**重新编译所有代码**
- CleanWebpackPlugin：每次编译时都会帮我们去重新生成新的dist目录，将产物、静态资源写入。消耗性能
- liver server是vscode生态下的插件，不是webpack的
- 模块化开发需要很多组件，当修改一小部分组件时，全部组件都更新，so不能实现局部刷新。而webpack中给的dev-server能做到

##### webpack-dev-server

- 配置package.json:

  ```
  // 在5以后，这里需要将命令写全
  "serve": "webpack serve"
  // 如果不配置config  否则localhost访问的是当前项目的目录展示
   "serve": "webpack serve  --config lg.config.js"
  ```

- 它同样是跟live server一样开启了一个静态服务，占用端口8080。当前目录下并没有产出dist目录，而是将数据都写入了内存中，内存的操作读写**速度更快**

- 遇到的问题：

  我index.js下写的东西并没有展示出来，修改也不会有所改变，这是为什么呢？

  Content not from webpack is served from '/Users/zhoumoling/kaifa/test/babel/public' directory

  https://stackoverflow.com/questions/42712054/content-not-from-webpack-is-served-from-foo

#### 3.8、webpack-dev-middleware

可以用来追求自由度更高的模式，但在开发阶段使用过的较少：

##### 实验

- 实现逻辑：

  期望浏览器可以访问一个静态资源：比如8080端口，而这个服务是由middleware来开启这个服务。webpack会将其打包之后的内容交给服务器，服务器监听某个端口上的请求，如果浏览器往这个端口上发送了相应的请求，那就可以将这个结果返回给浏览器展示：

- 要解决问题1：怎么样开启一个服务？

  可以node-js。也可以借助框架。express

  ```
  npm i express@4.17.1 -d
  ```

- 要解决的问题2：怎样把webpack打包之后的结果交给server？

  框架中间件

  ```
  npm i webpack-dev-middleware@5.0.0 -d
  ```

```js
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')

// 开启一个服务，帮我们加载中间件
const app = express();

// 让webapck可以打包:这个函数拿到配置参数后，会调用 ... 
// 返回compare对象，它控制weback的打包流程
// 1. 获取配置文件
const config = require('./lg.config.js')
const compiler = webpack(config)
// 2. 打包完成后，将结果交给server
app.use(webpackDevMiddleware(compiler))

app.listen(3000, () => {
    console.log('服务运行在3000端口上')
})
```

#### 3.9、HMR

- 热更新的情况：应该保留不更新的部分，只更新改动的部分。

##### 实验：

- index.html模板：

  ```html
  <body>
      <div id="app">index.html尝试测试
          <input >
      </div>
  </body>
  ```

- src下index.js新建：

  ```js
  module.exports = '期待啦un'
  
  console.log('title.js模块1')
  ```

- 在入口文件中导入：

  ```js
  import'./title'
  ```

- 配置文件：

  ```js
  devServer: {
    // 所有与webpack-dev-server相关的配置写在这里。 这里仍然是全部文件的更新，后面还需要判断
    hot: true,  
  },
  ```

  - 此时，页面填写输入框，然后更新title.js文件内容，会发现页面刷新了，input内输入也丢了
  - 这是不符合模块化更显的预期的

- 修改index.js：

  此时修改title。js内容，会更新，且输入框的内容不会被刷新掉 只是局部更新效果。

  ```js
  import'./title'
  
  // 为true希望给当前的模块开启热更新
  if(module.hot){
      module.hot.accept(['./title.js']) // 还可以有回调函数的写法
  }
  ```

  ```js
  import'./title'
  if(module.hot){
      module.hot.accept(['./title.js'], () => {  // 还可以有回调函数的写法
          console.log('title.js热更新啦')
      })
  }
  ```

##### 坑：

- 当有单独的broswerrc文件时，且mode为开发模式，此时冲突。需要添加target：'web'

### 4、配置信息

- ##### output的publicPath：

  作用：告知本地打包的index.html，将来去哪个地方寻找加载的资源   浏览器补的

  1. 为空字符串' '时，将当前域名+publicPath+filename形式访问资源

     - 当以打开index.html的形式，也就是file协议打开时，index.html的js引用的是main.js，实际是./ 以相对路径形式访问  

     - 当开启der-server访问时，也可以找到加载的资源。怎么做的呢？

       首先是前面域名：http://localhost:8080+'/'(这个是浏览器自动帮我们加的)+filename（我们设置的）

  2. 也可以写成/的形式：此时是以绝对路径的形式访问   自己补

     - 本地打包：<script defer src="/js/build.js"></script>

        报错加载不到资源  此时需要写成./。这样相当于将绝对路径改成相对路径，本地就ok了

       但此时./如果还想dev-server形式，又无法预览。

       - 相对路径，它不知道怎么去找。找不到js下面的build.js

     - dev-server：ok

  ```js
      output: {
          filename: 'js/build.js',
          assetModuleFilename: "img/[name].[hash:6][ext]",
          path: path.resolve(__dirname, 'dist'),
          publicPath: '/',    // 在dev-server开启后要关注的 
      }
  ```

- ##### devServer的publicPath：备注最新的已经没有这个属性了

  作用：用来告知，指定服务的资源放在了本地的哪个地方。因为server工作，本机开启服务时，找资源去哪儿找。

  取值：

  1. 不写，默认 /  代表当前项目或服务所在的目录。

     比如，我们去找这个目录下的build.js肯定可以找到：http://localhost:8080/js/build.js

     

  2. 

  ```
  
  ```

- devServer的proxy设置：

  现在访问的是localhost:4000/index.html

  1. Index.html当中需要使用其他数据，但是数据在另外的端口上面；

  2. 此时会有跨域产生，所以要对接口做代理操作。

  3. 注意：

     一般的项目在开发完成后，部署上线不存在跨域问题。一般是后端解决了，或者部署在同一个地方，或者让同一个应用做数据返回等等方式。而代理主要是开发阶段。

     后端可能在一个接口上，但webpack打包的项目时运行在当前接口上

- 具体做法：

  localhost:4000/index.html  ----  webpack devServer开启了服务转发请求  ---请求另一个服务器

  ```
  
  ```

  
