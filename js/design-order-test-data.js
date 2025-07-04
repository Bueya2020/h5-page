/**
 * 设计订单测试数据
 * 用于演示权限控制系统
 */

// =====================================================
// 测试数据生成器
// =====================================================

class DesignOrderTestDataGenerator {
    constructor() {
        this.currentUser = {
            id: 'user-001',
            name: '张三',
            phone: '13800138000'
        };
    }

    /**
     * 生成测试订单数据
     */
    generateTestOrders() {
        const testOrders = [
            // 1. 设计完成 + 付全款的订单（完整权限）
            {
                orderId: 'order-design-001',
                orderNumber: 'DS20250127001',
                orderType: 'design',
                userId: this.currentUser.id,
                sourcePage: 'design-result',
                items: [
                    {
                        itemId: 'design-service-001',
                        itemType: 'service',
                        name: '120㎡现代简约全屋设计',
                        description: '包含客厅、卧室、厨房、卫生间设计方案',
                        image: 'https://via.placeholder.com/300x200?text=设计方案',
                        price: 8000,
                        quantity: 1,
                        specifications: {
                            area: 120,
                            style: '现代简约',
                            rooms: '三室两厅'
                        }
                    }
                ],
                status: 'design_completed',
                totalAmount: 15000, // 设计费8000 + 设备清单费7000
                totalQuantity: 1,
                paymentMethod: 'wechat',
                createTime: '2025-01-20T10:00:00.000Z',
                updateTime: '2025-01-27T15:30:00.000Z',
                extendedInfo: {
                    designProgress: {
                        completionRate: 100,
                        currentStage: 'completed',
                        estimatedCompletion: '2025-01-27T15:30:00.000Z',
                        completionDate: '2025-01-27T15:30:00.000Z'
                    },
                    projectInfo: {
                        houseType: '三室两厅',
                        area: 120,
                        style: '现代简约',
                        budget: 150000
                    },
                    payments: [
                        {
                            type: 'design_fee',
                            amount: 8000,
                            status: 'paid',
                            paymentTime: '2025-01-20T10:30:00.000Z',
                            paymentId: 'pay-001'
                        },
                        {
                            type: 'device_list_fee',
                            amount: 7000,
                            status: 'paid',
                            paymentTime: '2025-01-27T16:00:00.000Z',
                            paymentId: 'pay-002'
                        }
                    ]
                }
            },

            // 2. 设计完成 + 只付设计费的订单（demo权限）
            {
                orderId: 'order-design-002',
                orderNumber: 'DS20250125002',
                orderType: 'design',
                userId: this.currentUser.id,
                sourcePage: 'design-result',
                items: [
                    {
                        itemId: 'design-service-002',
                        itemType: 'service',
                        name: '90㎡北欧风格全屋设计',
                        description: '包含客厅、卧室、厨房设计方案',
                        image: 'https://via.placeholder.com/300x200?text=北欧设计',
                        price: 6000,
                        quantity: 1,
                        specifications: {
                            area: 90,
                            style: '北欧风格',
                            rooms: '两室一厅'
                        }
                    }
                ],
                status: 'design_completed',
                totalAmount: 6000, // 只付了设计费
                totalQuantity: 1,
                paymentMethod: 'alipay',
                createTime: '2025-01-18T14:00:00.000Z',
                updateTime: '2025-01-25T11:20:00.000Z',
                extendedInfo: {
                    designProgress: {
                        completionRate: 100,
                        currentStage: 'completed',
                        estimatedCompletion: '2025-01-25T11:20:00.000Z',
                        completionDate: '2025-01-25T11:20:00.000Z'
                    },
                    projectInfo: {
                        houseType: '两室一厅',
                        area: 90,
                        style: '北欧风格',
                        budget: 100000
                    },
                    payments: [
                        {
                            type: 'design_fee',
                            amount: 6000,
                            status: 'paid',
                            paymentTime: '2025-01-18T14:30:00.000Z',
                            paymentId: 'pay-003'
                        }
                        // 注意：没有设备清单费的支付记录
                    ]
                }
            },

            // 3. 设计中的订单（不在项目空间显示）
            {
                orderId: 'order-design-003',
                orderNumber: 'DS20250127003',
                orderType: 'design',
                userId: this.currentUser.id,
                sourcePage: 'design-result',
                items: [
                    {
                        itemId: 'design-service-003',
                        itemType: 'service',
                        name: '150㎡中式风格全屋设计',
                        description: '包含全屋设计方案',
                        image: 'https://via.placeholder.com/300x200?text=中式设计',
                        price: 12000,
                        quantity: 1,
                        specifications: {
                            area: 150,
                            style: '中式风格',
                            rooms: '四室两厅'
                        }
                    }
                ],
                status: 'designing',
                totalAmount: 12000,
                totalQuantity: 1,
                paymentMethod: 'wechat',
                createTime: '2025-01-27T09:00:00.000Z',
                updateTime: '2025-01-27T09:00:00.000Z',
                extendedInfo: {
                    designProgress: {
                        completionRate: 60,
                        currentStage: 'design_development',
                        estimatedCompletion: '2025-02-10T18:00:00.000Z'
                    },
                    projectInfo: {
                        houseType: '四室两厅',
                        area: 150,
                        style: '中式风格',
                        budget: 200000
                    },
                    payments: [
                        {
                            type: 'design_fee',
                            amount: 12000,
                            status: 'paid',
                            paymentTime: '2025-01-27T09:30:00.000Z',
                            paymentId: 'pay-004'
                        }
                    ]
                }
            }
        ];

        return testOrders;
    }

    /**
     * 初始化测试数据
     */
    initTestData() {
        // 设置当前用户
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // 生成测试订单
        const testOrders = this.generateTestOrders();

        // 保存到localStorage
        localStorage.setItem('designOrders', JSON.stringify(testOrders));

        console.log('设计订单测试数据已初始化:', testOrders);
        return testOrders;
    }

    /**
     * 清除测试数据
     */
    clearTestData() {
        localStorage.removeItem('designOrders');
        localStorage.removeItem('currentUser');
        console.log('设计订单测试数据已清除');
    }

    /**
     * 模拟设计完成
     * @param {string} orderId - 订单ID
     */
    simulateDesignCompletion(orderId) {
        const orders = JSON.parse(localStorage.getItem('designOrders') || '[]');
        const orderIndex = orders.findIndex(order => order.orderId === orderId);

        if (orderIndex !== -1) {
            orders[orderIndex].status = 'design_completed';
            orders[orderIndex].updateTime = new Date().toISOString();
            orders[orderIndex].extendedInfo.designProgress = {
                ...orders[orderIndex].extendedInfo.designProgress,
                completionRate: 100,
                currentStage: 'completed',
                completionDate: new Date().toISOString()
            };

            localStorage.setItem('designOrders', JSON.stringify(orders));
            console.log(`订单 ${orderId} 设计已完成`);
            
            // 刷新页面以更新项目空间
            if (window.projectSpaceManager) {
                window.projectSpaceManager.permissionManager.clearPermissionCache();
                window.projectSpaceManager.loadProjectSpaces();
                window.projectSpaceManager.renderProjectSpaces();
            }
        }
    }

    /**
     * 模拟支付设备清单费
     * @param {string} orderId - 订单ID
     * @param {number} amount - 支付金额
     */
    simulateDeviceListPayment(orderId, amount = 7000) {
        const orders = JSON.parse(localStorage.getItem('designOrders') || '[]');
        const orderIndex = orders.findIndex(order => order.orderId === orderId);

        if (orderIndex !== -1) {
            const order = orders[orderIndex];
            
            // 添加设备清单费支付记录
            if (!order.extendedInfo.payments) {
                order.extendedInfo.payments = [];
            }

            order.extendedInfo.payments.push({
                type: 'device_list_fee',
                amount: amount,
                status: 'paid',
                paymentTime: new Date().toISOString(),
                paymentId: `pay-${Date.now()}`
            });

            // 更新总金额
            order.totalAmount += amount;
            order.updateTime = new Date().toISOString();

            localStorage.setItem('designOrders', JSON.stringify(orders));
            console.log(`订单 ${orderId} 设备清单费支付完成，金额: ¥${amount}`);
            
            // 刷新页面以更新权限
            if (window.projectSpaceManager) {
                window.projectSpaceManager.permissionManager.clearPermissionCache();
                window.projectSpaceManager.loadProjectSpaces();
                window.projectSpaceManager.renderProjectSpaces();
            }
        }
    }

    /**
     * 获取权限状态报告
     */
    getPermissionReport() {
        if (typeof DesignOrderPermissionManager === 'undefined') {
            console.error('权限管理器未加载');
            return null;
        }

        const permissionManager = new DesignOrderPermissionManager();
        const permissions = permissionManager.getUserDesignPermissions();
        
        console.log('=== 设计订单权限报告 ===');
        console.log('权限级别:', permissions.level);
        console.log('项目空间数量:', permissions.projectSpaces.length);
        console.log('可访问页面:', permissions.accessiblePages);
        console.log('订单详情:', permissions.orders);
        console.log('========================');

        return permissions;
    }
}

// =====================================================
// 全局导出和初始化
// =====================================================

// 创建全局实例
window.DesignOrderTestDataGenerator = DesignOrderTestDataGenerator;

// 开发环境下自动初始化测试数据
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        // 检查是否已有测试数据
        const existingOrders = localStorage.getItem('designOrders');
        if (!existingOrders || existingOrders === '[]') {
            const generator = new DesignOrderTestDataGenerator();
            generator.initTestData();
            
            // 添加测试控制面板
            addTestControlPanel(generator);
        }
    });
}

/**
 * 添加测试控制面板
 */
function addTestControlPanel(generator) {
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        font-size: 12px;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 300px;
    `;
    
    panel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">设计订单测试控制台</div>
        <div style="margin-bottom: 5px;">
            <button onclick="testDataGenerator.simulateDesignCompletion('order-design-003')" 
                    style="padding: 4px 8px; margin: 2px; font-size: 11px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                完成设计003
            </button>
        </div>
        <div style="margin-bottom: 5px;">
            <button onclick="testDataGenerator.simulateDeviceListPayment('order-design-002')" 
                    style="padding: 4px 8px; margin: 2px; font-size: 11px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                支付设备费002
            </button>
        </div>
        <div style="margin-bottom: 5px;">
            <button onclick="testDataGenerator.getPermissionReport()" 
                    style="padding: 4px 8px; margin: 2px; font-size: 11px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
                权限报告
            </button>
        </div>
        <div>
            <button onclick="testDataGenerator.clearTestData(); location.reload()" 
                    style="padding: 4px 8px; margin: 2px; font-size: 11px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                清除数据
            </button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 设置全局变量
    window.testDataGenerator = generator;
}
