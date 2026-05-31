# 清辞集

一个用 Next.js 16 App Router 构建的诗词歌赋收集展示网站。前台用于典雅展示诗词，后台用于录入和维护作品。

## 本地启动

```bash
npm run dev
```

打开 `http://localhost:3000` 查看网站。未配置 Supabase 时，前台会显示内置示例诗词，方便先预览页面。

## Supabase 配置

1. 在 Supabase 新建项目。
2. 打开 SQL Editor，执行 `supabase/schema.sql`。
3. 复制 `.env.example` 为 `.env.local`，填入：

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY` 只在服务端后台写入时使用，不要暴露给浏览器或提交到仓库。

## 后台入口

后台地址是 `http://localhost:3000/admin`。

登录密码来自 `.env.local` 中的 `ADMIN_PASSWORD`。登录成功后可以新增、编辑作品，并切换发布状态。只有 `published = true` 的作品会出现在前台。

## 数据结构

核心表为 `poetry_works`：

- `slug`：作品详情页 URL 别名。
- `title`、`author`、`dynasty`、`genre`：基础信息。
- `content`：正文，使用换行分隔诗句。
- `notes`：注释。
- `appreciation`：赏析。
- `tags`：标签数组。
- `featured`：是否首页精选。
- `published`：是否发布到前台。

## 常用命令

```bash
npm run lint
npm run build
```
