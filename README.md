<p align="center">
  <img src="build/logo-liquid.png" width="128" height="128" alt="GlassPlanner 图标" />
</p>

<h1 align="center">GlassPlanner</h1>

<p align="center">
  一款常驻桌面的 Windows 计划小组件，用透明液态玻璃承载短期任务与长期规划。
</p>

<p align="center">
  <a href="https://github.com/huachuanchuan/doEffectively/releases/latest"><img src="https://img.shields.io/github/v/release/huachuanchuan/doEffectively?display_name=tag&sort=semver&style=flat-square" alt="最新版本" /></a>
  <img src="https://img.shields.io/badge/platform-Windows%2010%2F11-0078D4?style=flat-square&logo=windows11&logoColor=white" alt="支持 Windows 10 和 Windows 11" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/huachuanchuan/doEffectively?style=flat-square" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/tests-15%2F15%20passing-2ea44f?style=flat-square" alt="15 项测试全部通过" />
</p>

GlassPlanner 把每天要做的事和需要长期推进的目标放在同一个小窗口里。它不会占用任务栏，能够贴靠屏幕角落，并通过原生 Windows 图形接口呈现桌面壁纸的实时折射效果。

项目不需要账号或云服务。计划、偏好设置和提醒状态都保存在本机。

## 下载

当前稳定版本：**v2.3.2**

| 平台 | 安装包 | 说明 |
| --- | --- | --- |
| Windows x64 | [下载 GlassPlanner 2.3.2](https://github.com/huachuanchuan/doEffectively/releases/download/v2.3.2/GlassPlanner_2.3.2.exe) | Windows 10 2004 或更高版本 |

也可以前往 [Releases](https://github.com/huachuanchuan/doEffectively/releases) 查看历史版本和更新说明。

> 安装程序暂未使用商业代码签名证书。Windows SmartScreen 首次运行时可能显示安全提示，请确认下载来源为本仓库后再继续。

## 主要功能

### 短期计划

- 按日期组织短期计划和任务。
- 为任务设置截止时间与优先级。
- 可将短期任务关联到一项长期规划。
- 完成、编辑或删除任务，完成整组任务后自动收纳到折叠区域。
- 任务到期前 5 分钟发送 Windows 通知。

### 长期规划

- 设置开始日期与结束日期，并按时间自动显示进度。
- 查看已关联短期任务的完成数量。
- 直接勾选完成，已完成规划统一折叠收纳。
- 点击“延期”后重新选择结束日期。
- 自动统计进行中、已完成和已逾期的规划数量。

### 桌面体验

- 基于 DXGI Desktop Duplication、D3D11 与 DirectComposition 的原生液态玻璃背景。
- 中心保持通透，折射集中在玻璃边缘，并带有克制的色散效果。
- 固定逻辑尺寸，在不同显示器缩放比例下保持一致。
- 自动贴靠最近的屏幕角落，不占用任务栏。
- 托盘单击显示或隐藏，右键菜单可退出应用。
- 全局快捷键 `Ctrl + Shift + T` 显示或隐藏窗口。
- 安装版会随 Windows 登录启动，并默认隐藏在托盘中。

### 个性化

- 调整字体、字号、文字颜色、强调色和玻璃色调。
- 在窗口底部直接点击并编辑座右铭。
- 外观设置即时预览并自动保存。

## 系统要求

- Windows 10 2004（build 19041）或更高版本。
- 64 位 Windows 系统。
- 建议开启桌面窗口管理器和硬件加速。

原生折射不可用时，应用会自动回退到 Windows 亚克力背景。macOS 和 Linux 目前没有提供安装包。

## 使用说明

1. 从 [Releases](https://github.com/huachuanchuan/doEffectively/releases/latest) 下载并安装最新版本。
2. 通过短期区域右上角的 `+` 创建当天计划，再添加具体任务。
3. 在长期区域创建目标，并设置开始与结束日期。
4. 编辑短期任务时，可以选择一项长期规划作为关联目标。
5. 点击右上角齿轮调整外观；点击底部座右铭即可直接编辑。

关闭窗口不会退出程序，GlassPlanner 会继续驻留系统托盘。需要完全退出时，请在托盘菜单中选择“退出”。

## 关于截图与录屏

为了避免桌面捕获把窗口文字再次折射进玻璃背景，启用原生玻璃时，GlassPlanner 会将内容窗口和玻璃面板排除在 Windows 屏幕捕获之外。因此部分截图、录屏或远程控制软件可能无法捕获完整窗口。

这是消除滚动和折叠残影所必需的行为，不影响屏幕上的实际显示。

## 本地开发

### 环境

- Node.js 18 或更高版本
- npm
- Windows 10/11 x64

### 启动开发环境

```powershell
git clone https://github.com/huachuanchuan/doEffectively.git
cd doEffectively
npm install
npm run dev
```

### 测试

```powershell
npm test
```

当前回归测试覆盖窗口尺寸、数据校验、长期计划完成状态、折叠区域、延期逻辑、透明玻璃参数、捕获反馈和字体绘制稳定性等关键行为。

### 构建 Windows 安装包

```powershell
npm run build
```

构建结果位于：

```text
release/<version>/GlassPlanner_<version>.exe
```

## 技术栈

- Electron
- React 18
- TypeScript
- Vite
- electron-store
- [electron-liquid-glass](https://github.com/hicccc77/electron-liquid-glass)
- electron-builder / NSIS

## 项目结构

```text
electron/
├─ main/             Electron 主进程、窗口、托盘、通知与数据校验
└─ preload/          受限的渲染进程桥接 API
src/
├─ App.tsx           计划管理与设置界面
├─ App.css           液态玻璃视觉系统
└─ hooks/            动态任务紧急度计算
scripts/             图标、预览和原生玻璃验证脚本
tests/               回归测试
build/               图标和打包资源
```

## 隐私与安全

- 不要求注册账号。
- 不上传计划或偏好设置。
- 数据通过 `electron-store` 保存在本地。
- 渲染进程启用沙箱和上下文隔离，并关闭 Node.js 直接访问。
- 主进程会校验渲染进程提交的计划数据后再写入本地存储。

原生玻璃需要在本地读取桌面画面以生成实时折射，但画面只在 GPU 管线中处理，不会上传到网络。

## 参与贡献

欢迎通过 [Issues](https://github.com/huachuanchuan/doEffectively/issues) 报告问题或提出建议。提交 Pull Request 前，请先运行：

```powershell
npm test
npm run build
```

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
