
// import oImgSrc  from '../img/aa.jpeg';
import '../css/img.css'
function packImg(){
    //  比如页面上有标签：设置src属性
    // 容器元素
    const oEle = document.createElement('div');
    const oImg = document.createElement('img');
    // oImg.src = require('../img/aa.jpeg').default;
    // oImg.width = 600;
    // oImg.src = require('../img/aa.jpeg')
    // oImg.src = oImgSrc;
    const obgImg = document.createElement('div');
    obgImg.className = 'bgbox';
    const obgImg2 = document.createElement('div');
    obgImg2.className = 'bgbox2';
    oEle.appendChild(obgImg); 
    oEle.appendChild(obgImg2); 
    return oEle;
}

document.body.appendChild(packImg());