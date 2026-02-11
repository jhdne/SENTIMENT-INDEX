# 📤 手动上传到 GitHub 指南

本文档说明如何手动将项目上传到 GitHub 仓库。

---

## 方法1：使用 GitHub 网页界面（最简单）

### 步骤1：创建新仓库

1. 访问：https://github.com/new
2. 填写信息：
   - **Repository name**: `SENTIMENT-INDEX`
   - **Description**: `实时加密货币市场情绪分析仪表板`
   - **Public** 或 **Private**（根据需要选择）
   - ❌ 不要勾选 "Add a README file"
   - ❌ 不要勾选 "Add .gitignore"
   - ❌ 不要勾选 "Choose a license"
3. 点击 "Create repository"

### 步骤2：上传文件

在新创建的仓库页面：

1. 点击 "uploading an existing file"
2. 将项目文件夹中的所有文件拖拽到上传区域
   - 或点击 "choose your files" 选择文件
3. 等待文件上传完成
4. 在底部填写提交信息：
   ```
   feat: 接入BWEnews WebSocket实时数据源
   ```
5. 点击 "Commit changes"

### 步骤3：验证上传

刷新页面，确认所有文件都已上传：
- ✅ App.tsx
- ✅ components/ 文件夹
- ✅ package.json
- ✅ README.md
- ✅ API_CONFIG.md
- ✅ 等等...

---

## 方法2：使用 GitHub Desktop（推荐）

### 步骤1：下载并安装

访问：https://desktop.github.com/

### 步骤2：登录 GitHub

打开 GitHub Desktop，登录你的 GitHub 账号

### 步骤3：添加本地仓库

1. File → Add Local Repository
2. 选择项目文件夹：`d:\visual machine\AI开发的项目\SENTIMENT INDEX`
3. 如果提示 "This directory does not appear to be a Git repository"
   - 点击 "create a repository"
   - Repository name: `SENTIMENT-INDEX`
   - 点击 "Create Repository"

### 步骤4：发布到 GitHub

1. 点击 "Publish repository"
2. 填写信息：
   - **Name**: `SENTIMENT-INDEX`
   - **Description**: `实时加密货币市场情绪分析仪表板`
   - 取消勾选 "Keep this code private"（如果想公开）
3. 点击 "Publish repository"

### 步骤5：推送更改

1. 在左下角输入提交信息：
   ```
   feat: 接入BWEnews WebSocket实时数据源
   ```
2. 点击 "Commit to main"
3. 点击 "Push origin"

---

## 方法3：使用命令行

### 前置要求

- 已安装 Git
- 已配置 GitHub 账号

### 步骤1：初始化仓库

在项目目录打开终端（PowerShell 或 Git Bash）：

```bash
git init
```

### 步骤2：添加文件

```bash
git add .
```

### 步骤3：提交

```bash
git commit -m "feat: 接入BWEnews WebSocket实时数据源"
```

### 步骤4：添加远程仓库

先在 GitHub 网页创建空仓库（参考方法1的步骤1），然后：

```bash
git remote add origin https://github.com/jhdne/SENTIMENT-INDEX.git
```

### 步骤5：推送

```bash
git branch -M main
git push -u origin main
```

如果要求输入用户名和密码：
- **Username**: `jhdne`
- **Password**: 使用 Personal Access Token（不是GitHub密码）

#### 如何获取 Personal Access Token：

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 将 token 作为密码使用

---

## 📁 需要上传的文件清单

确保以下文件都已上传：

### 核心文件
- ✅ App.tsx
- ✅ index.tsx
- ✅ index.html
- ✅ package.json
- ✅ tsconfig.json
- ✅ vite.config.ts

### 组件文件
- ✅ components/Dashboard.tsx
- ✅ components/DetailView.tsx
- ✅ components/Header.tsx
- ✅ components/SentimentChart.tsx
- ✅ components/SentimentKLine.tsx

### 配置文件
- ✅ types.ts
- ✅ constants.ts
- ✅ .gitignore
- ✅ .env.local（可选，建议不上传）

### 文档文件
- ✅ README.md
- ✅ API_CONFIG.md
- ✅ UPLOAD_TO_GITHUB.md

---

## ⚠️ 注意事项

### 不要上传的文件

以下文件/文件夹**不应该**上传到 GitHub：

- ❌ `node_modules/` - 依赖包（太大，可通过 npm install 安装）
- ❌ `dist/` - 构建产物（可重新构建）
- ❌ `.env.local` - 包含 API 密钥（安全风险）
- ❌ `.vscode/` - 编辑器配置（个人设置）

`.gitignore` 文件已配置忽略这些文件。

### 保护 API 密钥

- ✅ 确保 `.env.local` 在 `.gitignore` 中
- ✅ 不要在代码中硬编码 API 密钥
- ✅ 使用环境变量 `process.env.GEMINI_API_KEY`

---

## ✅ 验证上传成功

访问你的 GitHub 仓库：
```
https://github.com/jhdne/SENTIMENT-INDEX
```

检查：
- ✅ 所有文件都已上传
- ✅ README.md 正常显示
- ✅ 文件结构完整

---

## 🔄 后续更新

每次修改代码后，重复以下步骤：

### 使用 GitHub Desktop：
1. 查看更改
2. 填写提交信息
3. Commit → Push

### 使用命令行：
```bash
git add .
git commit -m "描述你的更改"
git push
```

---

## 💡 提示

1. **首次上传**: 推荐使用 GitHub Desktop（最简单）
2. **文件太多**: 可以分批上传，或使用命令行
3. **上传失败**: 检查网络连接和 GitHub 账号权限
4. **忘记密码**: 使用 Personal Access Token 代替密码

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 GitHub 账号是否已登录
2. 确认仓库名称是否正确
3. 查看 GitHub 帮助文档：https://docs.github.com/

---

**祝上传顺利！🎉**

