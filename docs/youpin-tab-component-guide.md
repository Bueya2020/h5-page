# 小米有品风格Tab组件使用指南

## 📦 组件概述

这是一个基于小米有品设计规范的Tab滚动组件，具有以下特点：

- ✅ **小米有品设计风格**：简洁、轻量化、低饱和度
- ✅ **智能滚动算法**：模拟小米有品的Tab切换逻辑
- ✅ **高性能优化**：GPU加速、防抖处理、60fps流畅动画
- ✅ **响应式设计**：适配各种屏幕尺寸
- ✅ **易于集成**：独立CSS/JS文件，即插即用
- ✅ **键盘导航**：支持左右箭头键切换
- ✅ **事件系统**：完整的事件回调机制

## 🚀 快速开始

### 1. 文件引入

```html
<!-- CSS文件 -->
<link rel="stylesheet" href="css/youpin-tab-component.css">

<!-- JavaScript文件 -->
<script src="js/youpin-tab-component.js"></script>
```

### 2. HTML结构

```html
<div class="youpin-tab-component" id="my-tabs">
    <!-- 滚动指示器 -->
    <div class="youpin-tab-indicator-left"></div>
    <div class="youpin-tab-indicator-right"></div>
    
    <!-- 滚动容器 -->
    <div class="youpin-tab-scrollable">
        <div class="youpin-tab-wrapper">
            <button class="youpin-tab active" data-category="all">全部</button>
            <button class="youpin-tab" data-category="electronics">电子产品</button>
            <button class="youpin-tab" data-category="home">家居用品</button>
            <button class="youpin-tab" data-category="clothing">服装配饰</button>
            <!-- 更多Tab... -->
        </div>
    </div>
</div>
```

### 3. JavaScript初始化

```javascript
// 方法1：自动初始化
<div class="youpin-tab-component" data-auto-init="true" id="my-tabs">

// 方法2：手动初始化
const tabComponent = new YoupinTabComponent('#my-tabs');

// 方法3：静态方法
YoupinTabComponent.init('#my-tabs');
```

## ⚙️ 配置选项

```javascript
const options = {
    enableKeyboard: true,     // 启用键盘导航（左右箭头键）
    enableAutoScroll: true,   // 启用智能滚动
    scrollThreshold: 5,       // 滚动指示器显示阈值（px）
    scrollDuration: 500,      // 滚动动画持续时间（ms）
    debug: false             // 调试模式（控制台输出详细信息）
};

const tabComponent = new YoupinTabComponent('#my-tabs', options);
```

## 📡 事件系统

### 监听Tab切换事件

```javascript
document.getElementById('my-tabs').addEventListener('youpinTabChange', (e) => {
    console.log('Tab切换事件:', {
        index: e.detail.index,        // Tab索引
        tab: e.detail.tab,           // Tab DOM元素
        data: e.detail.data          // Tab的data-*属性
    });
});
```

### 事件详情

| 事件名 | 触发时机 | 事件详情 |
|--------|----------|----------|
| `youpinTabChange` | Tab切换时 | `{index, tab, data}` |

## 🎨 样式定制

### CSS变量

```css
:root {
    --youpin-tab-color-inactive: #666666;    /* 未选中文字颜色 */
    --youpin-tab-color-active: #333333;      /* 选中文字颜色 */
    --youpin-tab-color-border: #000000;      /* 选中边框颜色 */
    --youpin-tab-bg-hover: rgba(248, 249, 250, 0.8);     /* 悬停背景 */
    --youpin-tab-bg-active: rgba(248, 249, 250, 0.5);    /* 选中背景 */
    --youpin-tab-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);   /* 悬停阴影 */
}
```

### 深色主题

组件自动支持深色主题（`prefers-color-scheme: dark`），也可以手动覆盖：

```css
.dark-theme .youpin-tab-component {
    background: #1a1a1a;
}

.dark-theme .youpin-tab {
    color: #999999;
}

.dark-theme .youpin-tab.active {
    color: #ffffff;
    border-bottom-color: #ffffff;
}
```

## 📱 响应式设计

组件内置响应式断点：

- **480px以下**：调整padding和字体大小
- **360px以下**：进一步优化小屏幕显示
- **触摸设备**：启用scroll-snap和触摸优化

## 🔧 API方法

### 实例方法

```javascript
const tabComponent = new YoupinTabComponent('#my-tabs');

// 选择指定索引的Tab
tabComponent.selectTab(2);

// 获取当前激活Tab的索引
const activeIndex = tabComponent.getActiveTabIndex();

// 滚动到指定Tab
tabComponent.scrollToTab(3);

// 更新滚动指示器
tabComponent.updateIndicators();

// 销毁组件
tabComponent.destroy();
```

### 静态方法

```javascript
// 初始化单个组件
YoupinTabComponent.init('#my-tabs', options);

// 批量初始化
YoupinTabComponent.initAll('.youpin-tab-component', options);
```

## 🌟 高级用法

### 动态添加Tab

```javascript
const tabComponent = new YoupinTabComponent('#my-tabs');

// 添加新Tab
const newTab = document.createElement('button');
newTab.className = 'youpin-tab';
newTab.textContent = '新分类';
newTab.dataset.category = 'new';

const wrapper = document.querySelector('#my-tabs .youpin-tab-wrapper');
wrapper.appendChild(newTab);

// 重新初始化
tabComponent.findElements();
tabComponent.bindEvents();
```

### 程序化切换Tab

```javascript
// 切换到指定索引
tabComponent.selectTab(2);

// 切换到下一个Tab
const currentIndex = tabComponent.getActiveTabIndex();
if (currentIndex < tabComponent.tabs.length - 1) {
    tabComponent.selectTab(currentIndex + 1);
}
```

## 🐛 常见问题

### Q: Tab内容过多时滚动不流畅？
A: 确保容器有固定宽度，避免使用`width: 100%`在某些布局中的问题。

### Q: 如何禁用某个Tab？
A: 添加`disabled`属性和对应样式：
```css
.youpin-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
```

### Q: 如何自定义滚动动画？
A: 修改CSS中的`transition`和`scroll-behavior`属性。

## 🔍 调试模式

启用调试模式查看详细信息：

```javascript
const tabComponent = new YoupinTabComponent('#my-tabs', {
    debug: true
});
```

调试信息包括：
- 组件初始化状态
- 滚动位置计算
- Tab切换事件
- 性能指标

## 📄 浏览器兼容性

- Chrome 60+
- Safari 12+
- Firefox 55+
- Edge 79+

## 📝 更新日志

- **v1.0.0**: 初始版本，基础Tab滚动功能
- **v1.1.0**: 添加小米有品风格设计
- **v1.2.0**: 智能滚动算法优化
- **v1.3.0**: 性能优化和响应式适配
- **v1.4.0**: 组件化重构，支持多实例
