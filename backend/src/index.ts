import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { weiboRouter } from './routes/weibo';
import { douyinRouter } from './routes/douyin';
import { bilibiliRouter } from './routes/bilibili';
import { zhihuRouter } from './routes/zhihu';
import { baiduRouter } from './routes/baidu';
import { toutiaoRouter } from './routes/toutiao';
import { kr36Router } from './routes/36kr';
import { huxiuRouter } from './routes/huxiu';
import { doubanRouter } from './routes/douban';
import { hupuRouter } from './routes/hupu';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weibo', weiboRouter);
app.use('/api/douyin', douyinRouter);
app.use('/api/bilibili', bilibiliRouter);
app.use('/api/zhihu', zhihuRouter);
app.use('/api/baidu', baiduRouter);
app.use('/api/toutiao', toutiaoRouter);
app.use('/api/36kr', kr36Router);
app.use('/api/huxiu', huxiuRouter);
app.use('/api/douban', doubanRouter);
app.use('/api/hupu', hupuRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PulseHub Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend served at: http://localhost:${PORT}/`);
});
