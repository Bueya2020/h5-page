/**
 * 设计订单权限控制系统
 * 基于付款状态控制项目空间和页面访问权限
 */

// =====================================================
// 设计订单权限配置
// =====================================================

const DESIGN_PERMISSION_CONFIG = {
    // 付款状态定义
    PAYMENT_STATUS: {
        DESIGN_ONLY: 'design_only',        // 只付设计费
        FULL_PAYMENT: 'full_payment',      // 付全款（设计费+设备清单费）
        NO_PAYMENT: 'no_payment'           // 未付款
    },

    // 订单状态定义
    ORDER_STATUS: {
        DESIGNING: 'designing',             // 设计中
        DESIGN_COMPLETED: 'design_completed', // 设计完成
        FULL_COMPLETED: 'full_completed'    // 全部完成
    },

    // 权限级别定义
    PERMISSION_LEVELS: {
        NONE: 'none',                       // 无权限
        DEMO: 'demo',                       // 只能看demo
        FULL: 'full'                        // 完整权限
    },

    // 页面访问权限配置
    PAGE_PERMISSIONS: {
        'spaces.html': {
            demo: true,                     // demo权限可访问
            full: true                      // 完整权限可访问
        },
        'space-detail.html': {
            demo: 'demo_content',           // demo权限只能看demo内容
            full: 'full_content'            // 完整权限看完整内容
        },
        'device-list.html': {
            demo: 'demo_devices',           // demo权限只能看demo设备
            full: 'full_devices'            // 完整权限看完整设备清单
        },
        'construction.html': {
            demo: false,                    // demo权限不可访问
            full: true                      // 完整权限可访问
        }
    }
};

// =====================================================
// 设计订单权限管理器
// =====================================================

class DesignOrderPermissionManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.designOrders = this.loadDesignOrders();
        this.permissionCache = new Map();
    }

    /**
     * 获取用户的设计订单权限
     * @param {string} userId - 用户ID
     * @returns {Object} 权限信息
     */
    getUserDesignPermissions(userId = null) {
        const targetUserId = userId || this.currentUser?.id;
        if (!targetUserId) {
            return { level: DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.NONE, orders: [] };
        }

        // 检查缓存
        const cacheKey = `permissions_${targetUserId}`;
        if (this.permissionCache.has(cacheKey)) {
            return this.permissionCache.get(cacheKey);
        }

        // 获取用户的设计订单
        const userDesignOrders = this.designOrders.filter(order => 
            order.userId === targetUserId && 
            order.orderType === 'design'
        );

        if (userDesignOrders.length === 0) {
            const result = { 
                level: DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.NONE, 
                orders: [] 
            };
            this.permissionCache.set(cacheKey, result);
            return result;
        }

        // 分析订单状态和付款情况
        const permissions = this.analyzeOrderPermissions(userDesignOrders);
        
        // 缓存结果
        this.permissionCache.set(cacheKey, permissions);
        
        return permissions;
    }

    /**
     * 分析订单权限
     * @param {Array} orders - 设计订单列表
     * @returns {Object} 权限分析结果
     */
    analyzeOrderPermissions(orders) {
        const result = {
            level: DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.NONE,
            orders: [],
            projectSpaces: [],
            accessiblePages: []
        };

        for (const order of orders) {
            const orderPermission = this.getOrderPermission(order);
            result.orders.push(orderPermission);

            // 设计完成的订单自动在项目空间展示
            if (orderPermission.designCompleted) {
                result.projectSpaces.push({
                    orderId: order.orderId,
                    orderNumber: order.orderNumber,
                    projectName: order.items[0]?.name || '设计项目',
                    permissionLevel: orderPermission.permissionLevel,
                    canViewFull: orderPermission.canViewFull,
                    completionDate: orderPermission.designCompletionDate
                });
            }

            // 更新整体权限级别
            if (orderPermission.permissionLevel === DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.FULL) {
                result.level = DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.FULL;
            } else if (orderPermission.permissionLevel === DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.DEMO && 
                      result.level === DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.NONE) {
                result.level = DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.DEMO;
            }
        }

        // 生成可访问页面列表
        result.accessiblePages = this.generateAccessiblePages(result.level);

        return result;
    }

    /**
     * 获取单个订单的权限信息
     * @param {Object} order - 订单对象
     * @returns {Object} 订单权限信息
     */
    getOrderPermission(order) {
        const paymentStatus = this.getOrderPaymentStatus(order);
        const designCompleted = this.isDesignCompleted(order);
        
        let permissionLevel = DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.NONE;
        let canViewFull = false;

        // 权限判断逻辑
        if (designCompleted) {
            if (paymentStatus === DESIGN_PERMISSION_CONFIG.PAYMENT_STATUS.FULL_PAYMENT) {
                // 付全款 → 完整权限
                permissionLevel = DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.FULL;
                canViewFull = true;
            } else if (paymentStatus === DESIGN_PERMISSION_CONFIG.PAYMENT_STATUS.DESIGN_ONLY) {
                // 只付设计费 → demo权限
                permissionLevel = DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.DEMO;
                canViewFull = false;
            }
        }

        return {
            orderId: order.orderId,
            orderNumber: order.orderNumber,
            paymentStatus,
            designCompleted,
            permissionLevel,
            canViewFull,
            designCompletionDate: order.extendedInfo?.designProgress?.completionDate,
            projectInfo: order.extendedInfo?.projectInfo
        };
    }

    /**
     * 获取订单付款状态
     * @param {Object} order - 订单对象
     * @returns {string} 付款状态
     */
    getOrderPaymentStatus(order) {
        const payments = order.extendedInfo?.payments || [];
        
        let designPaid = false;
        let deviceListPaid = false;

        for (const payment of payments) {
            if (payment.type === 'design_fee' && payment.status === 'paid') {
                designPaid = true;
            }
            if (payment.type === 'device_list_fee' && payment.status === 'paid') {
                deviceListPaid = true;
            }
        }

        if (designPaid && deviceListPaid) {
            return DESIGN_PERMISSION_CONFIG.PAYMENT_STATUS.FULL_PAYMENT;
        } else if (designPaid) {
            return DESIGN_PERMISSION_CONFIG.PAYMENT_STATUS.DESIGN_ONLY;
        } else {
            return DESIGN_PERMISSION_CONFIG.PAYMENT_STATUS.NO_PAYMENT;
        }
    }

    /**
     * 检查设计是否完成
     * @param {Object} order - 订单对象
     * @returns {boolean} 设计是否完成
     */
    isDesignCompleted(order) {
        const designProgress = order.extendedInfo?.designProgress;
        return designProgress && 
               (designProgress.completionRate >= 100 || 
                order.status === 'design_completed' || 
                order.status === 'completed');
    }

    /**
     * 生成可访问页面列表
     * @param {string} permissionLevel - 权限级别
     * @returns {Array} 可访问页面列表
     */
    generateAccessiblePages(permissionLevel) {
        const accessiblePages = [];
        const pagePermissions = DESIGN_PERMISSION_CONFIG.PAGE_PERMISSIONS;

        for (const [page, permissions] of Object.entries(pagePermissions)) {
            if (permissionLevel === DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.FULL && permissions.full) {
                accessiblePages.push({
                    page,
                    accessType: 'full',
                    contentType: permissions.full
                });
            } else if (permissionLevel === DESIGN_PERMISSION_CONFIG.PERMISSION_LEVELS.DEMO && permissions.demo) {
                accessiblePages.push({
                    page,
                    accessType: 'demo',
                    contentType: permissions.demo
                });
            }
        }

        return accessiblePages;
    }

    /**
     * 检查页面访问权限
     * @param {string} pageName - 页面名称
     * @param {string} userId - 用户ID
     * @returns {Object} 访问权限结果
     */
    checkPageAccess(pageName, userId = null) {
        const permissions = this.getUserDesignPermissions(userId);
        const pageConfig = DESIGN_PERMISSION_CONFIG.PAGE_PERMISSIONS[pageName];

        if (!pageConfig) {
            return { allowed: true, contentType: 'default' }; // 未配置的页面默认允许访问
        }

        const accessiblePage = permissions.accessiblePages.find(p => p.page === pageName);
        
        if (accessiblePage) {
            return {
                allowed: true,
                contentType: accessiblePage.contentType,
                accessType: accessiblePage.accessType,
                permissionLevel: permissions.level
            };
        }

        return {
            allowed: false,
            reason: 'insufficient_permissions',
            requiredLevel: pageConfig.demo ? 'demo' : 'full',
            currentLevel: permissions.level
        };
    }

    /**
     * 获取项目空间列表
     * @param {string} userId - 用户ID
     * @returns {Array} 项目空间列表
     */
    getProjectSpaces(userId = null) {
        const permissions = this.getUserDesignPermissions(userId);
        return permissions.projectSpaces;
    }

    /**
     * 更新订单状态（设计完成时调用）
     * @param {string} orderId - 订单ID
     * @param {Object} updateData - 更新数据
     */
    updateOrderStatus(orderId, updateData) {
        const orderIndex = this.designOrders.findIndex(order => order.orderId === orderId);
        if (orderIndex !== -1) {
            // 更新订单数据
            this.designOrders[orderIndex] = {
                ...this.designOrders[orderIndex],
                ...updateData,
                updateTime: new Date().toISOString()
            };

            // 保存到localStorage
            this.saveDesignOrders();

            // 清除权限缓存
            this.clearPermissionCache();

            console.log(`订单 ${orderId} 状态已更新，权限缓存已清除`);
        }
    }

    /**
     * 加载设计订单数据
     * @returns {Array} 设计订单列表
     */
    loadDesignOrders() {
        try {
            const orders = JSON.parse(localStorage.getItem('designOrders') || '[]');
            return orders.filter(order => order.orderType === 'design');
        } catch (error) {
            console.error('加载设计订单失败:', error);
            return [];
        }
    }

    /**
     * 保存设计订单数据
     */
    saveDesignOrders() {
        try {
            localStorage.setItem('designOrders', JSON.stringify(this.designOrders));
        } catch (error) {
            console.error('保存设计订单失败:', error);
        }
    }

    /**
     * 获取当前用户信息
     * @returns {Object|null} 用户信息
     */
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || 'null');
        } catch (error) {
            console.error('获取当前用户失败:', error);
            return null;
        }
    }

    /**
     * 清除权限缓存
     */
    clearPermissionCache() {
        this.permissionCache.clear();
    }
}

// =====================================================
// 页面权限控制中间件
// =====================================================

class PagePermissionMiddleware {
    constructor() {
        this.permissionManager = new DesignOrderPermissionManager();
    }

    /**
     * 初始化页面权限检查
     */
    init() {
        // 获取当前页面名称
        const currentPage = this.getCurrentPageName();
        
        // 检查访问权限
        const accessResult = this.permissionManager.checkPageAccess(currentPage);
        
        if (!accessResult.allowed) {
            this.handleAccessDenied(accessResult);
            return;
        }

        // 根据权限级别加载内容
        this.loadContentByPermission(accessResult);
        
        console.log('页面权限检查完成:', accessResult);
    }

    /**
     * 获取当前页面名称
     * @returns {string} 页面名称
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1);
    }

    /**
     * 处理访问被拒绝的情况
     * @param {Object} accessResult - 访问结果
     */
    handleAccessDenied(accessResult) {
        // 显示权限不足提示
        this.showPermissionDeniedMessage(accessResult);
        
        // 可选：重定向到权限说明页面
        // window.location.href = 'permission-info.html';
    }

    /**
     * 根据权限级别加载内容
     * @param {Object} accessResult - 访问结果
     */
    loadContentByPermission(accessResult) {
        if (accessResult.contentType === 'demo_content') {
            this.loadDemoContent();
        } else if (accessResult.contentType === 'demo_devices') {
            this.loadDemoDevices();
        } else if (accessResult.contentType === 'full_content') {
            this.loadFullContent();
        } else if (accessResult.contentType === 'full_devices') {
            this.loadFullDevices();
        }

        // 添加权限标识
        this.addPermissionIndicator(accessResult);
    }

    /**
     * 加载demo内容
     */
    loadDemoContent() {
        // 实现demo内容加载逻辑
        console.log('加载demo内容');
        
        // 添加demo标识
        document.body.classList.add('demo-mode');
        
        // 可以在这里替换或隐藏某些内容
        this.replaceSensitiveContent();
    }

    /**
     * 加载完整内容
     */
    loadFullContent() {
        // 实现完整内容加载逻辑
        console.log('加载完整内容');
        
        document.body.classList.add('full-access-mode');
    }

    /**
     * 替换敏感内容为demo内容
     */
    replaceSensitiveContent() {
        // 替换设备清单为demo数据
        const deviceElements = document.querySelectorAll('.device-item');
        deviceElements.forEach(element => {
            if (element.dataset.sensitive === 'true') {
                element.style.display = 'none';
            }
        });

        // 添加demo提示
        const demoNotice = document.createElement('div');
        demoNotice.className = 'demo-notice bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4';
        demoNotice.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <span>当前为演示模式，完整内容需要支付全款后查看</span>
            </div>
        `;
        
        const mainContent = document.querySelector('main') || document.body;
        mainContent.insertBefore(demoNotice, mainContent.firstChild);
    }

    /**
     * 显示权限不足消息
     * @param {Object} accessResult - 访问结果
     */
    showPermissionDeniedMessage(accessResult) {
        const message = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                    <h3 class="text-lg font-semibold mb-4">访问权限不足</h3>
                    <p class="text-gray-600 mb-4">
                        您需要 ${accessResult.requiredLevel === 'demo' ? '设计完成' : '支付全款'} 才能访问此页面。
                    </p>
                    <div class="flex space-x-3">
                        <button onclick="history.back()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            返回
                        </button>
                        <button onclick="location.href='design.html'" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            查看设计服务
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', message);
    }

    /**
     * 添加权限指示器
     * @param {Object} accessResult - 访问结果
     */
    addPermissionIndicator(accessResult) {
        if (accessResult.accessType === 'demo') {
            const indicator = document.createElement('div');
            indicator.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm z-40';
            indicator.textContent = 'DEMO模式';
            document.body.appendChild(indicator);
        }
    }
}

// =====================================================
// 全局导出
// =====================================================

// 创建全局实例
window.DesignOrderPermissionManager = DesignOrderPermissionManager;
window.PagePermissionMiddleware = PagePermissionMiddleware;

// 页面加载时自动初始化权限检查
document.addEventListener('DOMContentLoaded', function() {
    const middleware = new PagePermissionMiddleware();
    middleware.init();
});

// 导出主要类和配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DesignOrderPermissionManager,
        PagePermissionMiddleware,
        DESIGN_PERMISSION_CONFIG
    };
}
