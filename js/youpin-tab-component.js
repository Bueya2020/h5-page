/**
 * 小米有品风格Tab滚动组件 - JavaScript模块
 * 
 * 使用方法：
 * const tabComponent = new YoupinTabComponent('#my-tab-container');
 * 或者
 * YoupinTabComponent.init('#my-tab-container');
 * 
 * @version 1.0.0
 * @author AI Assistant
 */

class YoupinTabComponent {
    constructor(containerSelector, options = {}) {
        this.containerSelector = containerSelector;
        this.options = {
            enableKeyboard: true,
            enableAutoScroll: true,
            scrollThreshold: 5,
            scrollDuration: 500,
            debug: false,
            ...options
        };
        
        this.container = null;
        this.scrollable = null;
        this.leftIndicator = null;
        this.rightIndicator = null;
        this.tabs = [];
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    /**
     * 初始化组件
     */
    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) {
            console.error(`YoupinTabComponent: 未找到容器 ${this.containerSelector}`);
            return false;
        }

        this.findElements();
        this.bindEvents();
        this.setupInitialState();
        
        if (this.options.debug) {
            console.log('✅ YoupinTabComponent 初始化完成:', {
                container: this.containerSelector,
                tabCount: this.tabs.length,
                options: this.options
            });
        }
        
        return true;
    }

    /**
     * 查找DOM元素
     */
    findElements() {
        this.scrollable = this.container.querySelector('.youpin-tab-scrollable');
        this.leftIndicator = this.container.querySelector('.youpin-tab-indicator-left');
        this.rightIndicator = this.container.querySelector('.youpin-tab-indicator-right');
        this.tabs = Array.from(this.container.querySelectorAll('.youpin-tab'));
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.scrollable) return;

        // 滚动事件监听 - 防抖优化
        let scrollUpdateTimeout;
        this.scrollable.addEventListener('scroll', () => {
            clearTimeout(scrollUpdateTimeout);
            scrollUpdateTimeout = setTimeout(() => this.updateIndicators(), 16); // 60fps
        });

        // Tab点击事件
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectTab(index);
            });
        });

        // 键盘导航
        if (this.options.enableKeyboard) {
            this.bindKeyboardEvents();
        }
    }

    /**
     * 绑定键盘事件
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const activeIndex = this.getActiveTabIndex();
                if (activeIndex === -1) return;

                let targetIndex;
                if (e.key === 'ArrowLeft' && activeIndex > 0) {
                    targetIndex = activeIndex - 1;
                } else if (e.key === 'ArrowRight' && activeIndex < this.tabs.length - 1) {
                    targetIndex = activeIndex + 1;
                }

                if (targetIndex !== undefined) {
                    e.preventDefault();
                    this.selectTab(targetIndex);
                }
            }
        });
    }

    /**
     * 设置初始状态
     */
    setupInitialState() {
        setTimeout(() => {
            this.updateIndicators();
            
            // 添加性能优化类
            if (this.scrollable) {
                this.scrollable.classList.add('optimized-scroll');
            }
            
            // 如果有激活的tab，滚动到它
            const activeIndex = this.getActiveTabIndex();
            if (activeIndex !== -1 && this.options.enableAutoScroll) {
                setTimeout(() => this.scrollToTab(activeIndex), 200);
            }
        }, 100);
    }

    /**
     * 更新滚动指示器
     */
    updateIndicators() {
        if (!this.leftIndicator || !this.rightIndicator || !this.scrollable) return;

        const scrollLeft = this.scrollable.scrollLeft;
        const maxScroll = this.scrollable.scrollWidth - this.scrollable.clientWidth;
        const threshold = this.options.scrollThreshold;

        // 更新容器状态类
        this.scrollable.classList.toggle('at-start', scrollLeft <= threshold);
        this.scrollable.classList.toggle('at-end', scrollLeft >= maxScroll - threshold);

        // 左侧指示器
        if (scrollLeft > threshold) {
            this.leftIndicator.classList.add('show');
        } else {
            this.leftIndicator.classList.remove('show');
        }

        // 右侧指示器
        if (scrollLeft < maxScroll - threshold) {
            this.rightIndicator.classList.add('show');
        } else {
            this.rightIndicator.classList.remove('show');
        }

        if (this.options.debug) {
            console.log('📊 滚动状态更新:', {
                scrollLeft: Math.round(scrollLeft),
                maxScroll: Math.round(maxScroll),
                leftShow: scrollLeft > threshold,
                rightShow: scrollLeft < maxScroll - threshold
            });
        }
    }

    /**
     * 选择指定索引的Tab
     */
    selectTab(index) {
        if (index < 0 || index >= this.tabs.length) return;

        // 更新激活状态
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.tabs[index].classList.add('active');

        // 执行智能滚动
        if (this.options.enableAutoScroll) {
            this.scrollToTab(index);
        }

        // 触发自定义事件
        this.dispatchTabChangeEvent(index);

        if (this.options.debug) {
            console.log('🎯 切换到Tab:', index, this.tabs[index].textContent.trim());
        }
    }

    /**
     * 智能滚动到指定Tab
     */
    scrollToTab(index) {
        if (!this.scrollable || this.isScrolling || index < 0 || index >= this.tabs.length) return;

        const targetTab = this.tabs[index];
        this.isScrolling = true;
        this.container.classList.add('scrolling');
        targetTab.classList.add('scrolling-target');

        const containerRect = this.scrollable.getBoundingClientRect();
        const currentActiveIndex = this.getActiveTabIndex();
        
        // 计算目标滚动位置 - 小米有品风格算法
        let targetScrollLeft;
        
        if (index > currentActiveIndex) {
            // 向右滚动：目标tab显示在容器右侧1/3处
            targetScrollLeft = targetTab.offsetLeft - containerRect.width * 0.67 + targetTab.offsetWidth / 2;
        } else if (index < currentActiveIndex) {
            // 向左滚动：目标tab显示在容器左侧1/3处
            targetScrollLeft = targetTab.offsetLeft - containerRect.width * 0.33 + targetTab.offsetWidth / 2;
        } else {
            // 当前tab，居中显示
            targetScrollLeft = targetTab.offsetLeft - containerRect.width / 2 + targetTab.offsetWidth / 2;
        }

        // 边界检查
        const maxScroll = this.scrollable.scrollWidth - this.scrollable.clientWidth;
        targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScroll));

        if (this.options.debug) {
            console.log('🎯 智能滚动计算:', {
                index,
                currentActiveIndex,
                direction: index > currentActiveIndex ? 'right' : 'left',
                targetScrollLeft: Math.round(targetScrollLeft),
                currentScrollLeft: Math.round(this.scrollable.scrollLeft)
            });
        }

        // 执行平滑滚动
        this.scrollable.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });

        // 滚动完成处理
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.container.classList.remove('scrolling');
            targetTab.classList.remove('scrolling-target');
            targetTab.classList.add('scroll-complete');
            
            setTimeout(() => {
                targetTab.classList.remove('scroll-complete');
            }, 300);
            
            this.updateIndicators();
        }, this.options.scrollDuration);
    }

    /**
     * 获取当前激活Tab的索引
     */
    getActiveTabIndex() {
        return this.tabs.findIndex(tab => tab.classList.contains('active'));
    }

    /**
     * 触发Tab切换事件
     */
    dispatchTabChangeEvent(index) {
        const event = new CustomEvent('youpinTabChange', {
            detail: {
                index,
                tab: this.tabs[index],
                data: this.tabs[index].dataset
            }
        });
        this.container.dispatchEvent(event);
    }

    /**
     * 销毁组件
     */
    destroy() {
        clearTimeout(this.scrollTimeout);
        // 这里可以添加更多清理逻辑
    }

    /**
     * 静态初始化方法
     */
    static init(containerSelector, options = {}) {
        return new YoupinTabComponent(containerSelector, options);
    }

    /**
     * 批量初始化多个组件
     */
    static initAll(containerSelector, options = {}) {
        const containers = document.querySelectorAll(containerSelector);
        return Array.from(containers).map(container => 
            new YoupinTabComponent(`#${container.id}`, options)
        );
    }
}

// 全局暴露
window.YoupinTabComponent = YoupinTabComponent;

// 自动初始化（如果页面包含默认选择器）
document.addEventListener('DOMContentLoaded', () => {
    const defaultContainers = document.querySelectorAll('.youpin-tab-component[data-auto-init="true"]');
    defaultContainers.forEach(container => {
        new YoupinTabComponent(`#${container.id}`);
    });
});
