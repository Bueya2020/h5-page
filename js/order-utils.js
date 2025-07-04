/**
 * 统一订单管理工具函数
 * 基于订单编号前缀的订单类型识别和管理
 */

// 订单类型前缀定义
const ORDER_PREFIXES = {
    mall: 'SH',        // Smart Home - 商城订单
    design: 'DS',      // Design Service - 设计服务
    knowledge: 'KN'    // Knowledge - 知识内容
};

// 订单类型信息配置
const ORDER_TYPE_CONFIG = {
    'SH': { 
        type: 'mall', 
        name: '商城订单', 
        color: 'blue',
        storageKey: 'smartHomeOrders'
    },
    'DS': { 
        type: 'design', 
        name: '设计订单', 
        color: 'purple',
        storageKey: 'designOrders'
    },
    'KN': { 
        type: 'knowledge', 
        name: '知识订单', 
        color: 'green',
        storageKey: 'knowledgeOrders'
    }
};

// 订单状态配置
const ORDER_STATUS_CONFIG = {
    mall: {
        'pending': { text: '待支付', class: 'bg-red-100 text-red-800' },
        'paid': { text: '已付款', class: 'bg-blue-100 text-blue-800' },
        'shipped': { text: '已发货', class: 'bg-yellow-100 text-yellow-800' },
        'delivered': { text: '已送达', class: 'bg-green-100 text-green-800' },
        'cancelled': { text: '已取消', class: 'bg-gray-100 text-gray-800' }
    },
    design: {
        'pending_payment': { text: '待支付', class: 'bg-red-100 text-red-800' },
        'paid': { text: '已付款', class: 'bg-blue-100 text-blue-800' },
        'designing': { text: '设计中', class: 'bg-blue-100 text-blue-800' },
        'completed': { text: '已完成', class: 'bg-green-100 text-green-800' },
        'cancelled': { text: '已取消', class: 'bg-gray-100 text-gray-800' }
    },
    knowledge: {
        'pending_payment': { text: '待支付', class: 'bg-red-100 text-red-800' },
        'paid': { text: '已购买', class: 'bg-blue-100 text-blue-800' },
        'active': { text: '学习中', class: 'bg-green-100 text-green-800' },
        'expired': { text: '已过期', class: 'bg-gray-100 text-gray-800' },
        'cancelled': { text: '已取消', class: 'bg-gray-100 text-gray-800' }
    }
};

/**
 * 生成订单编号
 * @param {string} orderType - 订单类型 ('mall', 'design', 'knowledge')
 * @returns {string} 订单编号，格式：[前缀][日期][序号]
 */
function generateOrderNumber(orderType) {
    const prefix = ORDER_PREFIXES[orderType];
    if (!prefix) {
        console.error('未知的订单类型:', orderType);
        return 'SH' + Date.now(); // 默认为商城订单
    }
    
    // 生成日期部分 (YYYYMMDD)
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    
    // 生成序号部分 (001-999)
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${prefix}${dateStr}${sequence}`;
}

/**
 * 从订单编号识别订单类型
 * @param {string} orderNumber - 订单编号
 * @returns {string} 订单类型 ('mall', 'design', 'knowledge')
 */
function getOrderTypeFromNumber(orderNumber) {
    if (!orderNumber || orderNumber.length < 2) {
        return 'mall'; // 默认为商城订单
    }
    
    const prefix = orderNumber.substring(0, 2);
    const config = ORDER_TYPE_CONFIG[prefix];
    
    return config ? config.type : 'mall';
}

/**
 * 获取订单类型信息
 * @param {string} orderNumber - 订单编号
 * @returns {object} 订单类型信息
 */
function getOrderTypeInfo(orderNumber) {
    const prefix = orderNumber.substring(0, 2);
    return ORDER_TYPE_CONFIG[prefix] || ORDER_TYPE_CONFIG['SH'];
}

/**
 * 获取订单状态文本
 * @param {string} status - 订单状态
 * @param {string} orderType - 订单类型
 * @returns {string} 状态文本
 */
function getOrderStatusText(status, orderType) {
    const config = ORDER_STATUS_CONFIG[orderType];
    return config && config[status] ? config[status].text : status;
}

/**
 * 获取订单状态样式类
 * @param {string} status - 订单状态
 * @param {string} orderType - 订单类型
 * @returns {string} CSS类名
 */
function getOrderStatusClass(status, orderType) {
    const config = ORDER_STATUS_CONFIG[orderType];
    return config && config[status] ? config[status].class : 'bg-gray-100 text-gray-800';
}

/**
 * 加载所有类型的订单
 * @returns {Array} 统一格式的订单数组
 */
function loadAllOrders() {
    const allOrders = [];
    
    // 遍历所有存储键
    Object.values(ORDER_TYPE_CONFIG).forEach(config => {
        const orders = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
        orders.forEach(order => {
            // 确保订单有orderNumber字段
            if (!order.orderNumber) {
                // 为旧订单生成编号（向后兼容）
                order.orderNumber = generateOrderNumber(config.type);
            }
            
            // 自动识别订单类型
            order.orderType = getOrderTypeFromNumber(order.orderNumber);
            
            // 添加类型信息
            order.typeInfo = getOrderTypeInfo(order.orderNumber);
            
            allOrders.push(order);
        });
    });
    
    // 按创建时间排序（最新的在前）
    return allOrders.sort((a, b) => {
        const timeA = new Date(a.createTime || a.paymentTime || 0);
        const timeB = new Date(b.createTime || b.paymentTime || 0);
        return timeB - timeA;
    });
}

/**
 * 根据订单类型筛选订单
 * @param {Array} orders - 订单数组
 * @param {string} orderType - 订单类型 ('all', 'mall', 'design', 'knowledge')
 * @returns {Array} 筛选后的订单数组
 */
function filterOrdersByType(orders, orderType = 'all') {
    if (orderType === 'all') {
        return orders;
    }
    
    return orders.filter(order => {
        const type = getOrderTypeFromNumber(order.orderNumber);
        return type === orderType;
    });
}

/**
 * 根据订单状态筛选订单
 * @param {Array} orders - 订单数组
 * @param {string} status - 订单状态 ('all' 或具体状态)
 * @returns {Array} 筛选后的订单数组
 */
function filterOrdersByStatus(orders, status = 'all') {
    if (status === 'all') {
        return orders;
    }
    
    return orders.filter(order => order.status === status);
}

/**
 * 保存订单到对应的存储
 * @param {object} order - 订单对象
 */
function saveOrder(order) {
    const orderType = getOrderTypeFromNumber(order.orderNumber);
    const config = ORDER_TYPE_CONFIG[ORDER_PREFIXES[orderType]];
    
    if (!config) {
        console.error('无法确定订单存储位置:', order.orderNumber);
        return;
    }
    
    // 获取现有订单
    const orders = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
    
    // 检查是否已存在
    const existingIndex = orders.findIndex(o => o.orderNumber === order.orderNumber);
    
    if (existingIndex !== -1) {
        // 更新现有订单
        orders[existingIndex] = order;
    } else {
        // 添加新订单
        orders.unshift(order);
    }
    
    // 保存到localStorage
    localStorage.setItem(config.storageKey, JSON.stringify(orders));
}

/**
 * 格式化日期显示
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatOrderDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return diffDays + '天前';
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

// 导出函数（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateOrderNumber,
        getOrderTypeFromNumber,
        getOrderTypeInfo,
        getOrderStatusText,
        getOrderStatusClass,
        loadAllOrders,
        filterOrdersByType,
        filterOrdersByStatus,
        saveOrder,
        formatOrderDate,
        ORDER_PREFIXES,
        ORDER_TYPE_CONFIG,
        ORDER_STATUS_CONFIG
    };
}

// 在浏览器环境中添加到全局对象
if (typeof window !== 'undefined') {
    window.OrderUtils = {
        generateOrderNumber,
        getOrderTypeFromNumber,
        getOrderTypeInfo,
        getOrderStatusText,
        getOrderStatusClass,
        loadAllOrders,
        filterOrdersByType,
        filterOrdersByStatus,
        saveOrder,
        formatOrderDate,
        ORDER_PREFIXES,
        ORDER_TYPE_CONFIG,
        ORDER_STATUS_CONFIG
    };
}

console.log('订单工具函数已加载');
