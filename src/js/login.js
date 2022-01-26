// 模拟登陆逻辑:将来调用时  document.body.appendChild(login())
import '../css/login.css'

import '../css/login.less'
import '../css/test.css'

function login(){
    const oh2 =  document.createElement('h2');
    oh2.innerHTML = `欢迎来到多啦A梦的世界`;
    oh2.className = 'title';
    return oh2;
} 

document.body.appendChild(login())