/**
 * @file 隔空投送
 * npm i express multer qrcode-terminal ip body-parser
 * node app.js
 */
const express = require('express');
const multer = require('multer');
const qrcode = require('qrcode-terminal');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const ip = require('ip').address();
const port = 3000;
const ip_port = `http://${ip}:${port}`;

// 设置静态文件夹
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

// 设置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'downloads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fields: [{
      name: 'files'
    },
    {
      name: 'message'
    }
  ]
});

// 设置路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.array('files'), (req, res) => {
  // 打印投送的文字
  console.log(`【${new Date().toLocaleString('zh-CN', {hour12: false})}】投送的文字:${req.body.message}`);
  // 回退并刷新
  res.send(`<script>alert('投送成功');window.history.back();</script>`);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 ${ip_port}`);
  qrcode.generate(ip_port, {
    small: true
  });
});