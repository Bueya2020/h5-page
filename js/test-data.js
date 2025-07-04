/**
 * 测试数据生成器
 * 用于生成不同类型的订单测试数据
 */

// 生成测试订单数据
function generateTestOrders() {
    // 清空现有数据
    localStorage.removeItem('smartHomeOrders');
    localStorage.removeItem('designOrders');
    localStorage.removeItem('knowledgeOrders');

    // 生成商城订单测试数据
    const mallOrders = [
        {
            orderNumber: OrderUtils.generateOrderNumber('mall'),
            status: 'paid',
            items: [
                {
                    itemId: 'mall_001',
                    itemType: 'product',
                    name: '小米智能开关',
                    description: '单火线智能开关',
                    image: 'https://via.placeholder.com/100x100?text=开关',
                    price: 299,
                    quantity: 2
                },
                {
                    itemId: 'mall_002',
                    itemType: 'product',
                    name: '智能门锁',
                    description: '指纹密码门锁',
                    image: 'https://via.placeholder.com/100x100?text=门锁',
                    price: 1299,
                    quantity: 1
                }
            ],
            totalAmount: 1897,
            totalQuantity: 3,
            createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
            paymentTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            extendedInfo: {
                shippingInfo: {
                    address: '北京市朝阳区xxx小区',
                    trackingNumber: 'SF1234567890'
                }
            }
        },
        {
            orderNumber: OrderUtils.generateOrderNumber('mall'),
            status: 'shipped',
            items: [
                {
                    itemId: 'mall_003',
                    itemType: 'product',
                    name: '智能摄像头',
                    description: '1080P高清摄像头',
                    image: 'https://via.placeholder.com/100x100?text=摄像头',
                    price: 399,
                    quantity: 1
                }
            ],
            totalAmount: 399,
            totalQuantity: 1,
            createTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
            paymentTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            extendedInfo: {
                shippingInfo: {
                    address: '北京市朝阳区xxx小区',
                    trackingNumber: 'SF1234567891'
                }
            }
        }
    ];

    // 生成设计订单测试数据
    const designOrders = [
        {
            orderNumber: OrderUtils.generateOrderNumber('design'),
            status: 'designing',
            items: [
                {
                    itemId: 'design_001',
                    itemType: 'service',
                    name: '三室两厅智能家居设计',
                    description: '包含全屋智能化设计方案',
                    image: 'https://via.placeholder.com/100x100?text=设计',
                    price: 2999,
                    quantity: 1
                }
            ],
            totalAmount: 2999,
            totalQuantity: 1,
            createTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
            paymentTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            extendedInfo: {
                designProgress: {
                    currentStage: '方案设计',
                    completionRate: 40,
                    milestones: [
                        { name: '需求分析', status: 'completed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
                        { name: '方案设计', status: 'in_progress', date: null },
                        { name: '方案确认', status: 'pending', date: null },
                        { name: '交付完成', status: 'pending', date: null }
                    ]
                },
                projectInfo: {
                    houseType: '3室2厅2卫',
                    area: 120,
                    location: '北京市朝阳区',
                    requirements: ['智能照明', '安防系统', '影音娱乐']
                }
            }
        },
        {
            orderNumber: OrderUtils.generateOrderNumber('design'),
            status: 'completed',
            items: [
                {
                    itemId: 'design_002',
                    itemType: 'service',
                    name: '两室一厅智能家居设计',
                    description: '小户型智能化设计方案',
                    image: 'https://via.placeholder.com/100x100?text=设计',
                    price: 1999,
                    quantity: 1
                }
            ],
            totalAmount: 1999,
            totalQuantity: 1,
            createTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
            paymentTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            extendedInfo: {
                designProgress: {
                    currentStage: '交付完成',
                    completionRate: 100,
                    milestones: [
                        { name: '需求分析', status: 'completed', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
                        { name: '方案设计', status: 'completed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
                        { name: '方案确认', status: 'completed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
                        { name: '交付完成', status: 'completed', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
                    ]
                },
                projectInfo: {
                    houseType: '2室1厅1卫',
                    area: 80,
                    location: '上海市浦东新区',
                    requirements: ['智能照明', '安防系统']
                }
            }
        }
    ];

    // 生成知识库订单测试数据
    const knowledgeOrders = [
        {
            orderNumber: OrderUtils.generateOrderNumber('knowledge'),
            status: 'active',
            items: [
                {
                    itemId: 'knowledge_001',
                    itemType: 'content',
                    name: '智能家居入门课程',
                    description: '从零开始学习智能家居',
                    image: 'https://via.placeholder.com/100x100?text=课程',
                    price: 199,
                    quantity: 1
                }
            ],
            totalAmount: 199,
            totalQuantity: 1,
            createTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
            paymentTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            extendedInfo: {
                learningProgress: {
                    completionRate: 60,
                    lastAccessTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1小时前
                },
                validDays: 365
            }
        },
        {
            orderNumber: OrderUtils.generateOrderNumber('knowledge'),
            status: 'paid',
            items: [
                {
                    itemId: 'knowledge_002',
                    itemType: 'content',
                    name: '智能家居高级配置',
                    description: '高级智能家居配置技巧',
                    image: 'https://via.placeholder.com/100x100?text=高级',
                    price: 299,
                    quantity: 1
                }
            ],
            totalAmount: 299,
            totalQuantity: 1,
            createTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前
            paymentTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            extendedInfo: {
                learningProgress: {
                    completionRate: 0,
                    lastAccessTime: null
                },
                validDays: 365
            }
        }
    ];

    // 保存测试数据到localStorage
    localStorage.setItem('smartHomeOrders', JSON.stringify(mallOrders));
    localStorage.setItem('designOrders', JSON.stringify(designOrders));
    localStorage.setItem('knowledgeOrders', JSON.stringify(knowledgeOrders));

    console.log('测试数据已生成:');
    console.log('- 商城订单:', mallOrders.length, '个');
    console.log('- 设计订单:', designOrders.length, '个');
    console.log('- 知识库订单:', knowledgeOrders.length, '个');

    return {
        mallOrders,
        designOrders,
        knowledgeOrders
    };
}

// 清空所有测试数据
function clearTestData() {
    localStorage.removeItem('smartHomeOrders');
    localStorage.removeItem('designOrders');
    localStorage.removeItem('knowledgeOrders');
    console.log('所有测试数据已清空');
}

// 在浏览器环境中添加到全局对象
if (typeof window !== 'undefined') {
    window.TestData = {
        generateTestOrders,
        clearTestData
    };
}

console.log('测试数据工具已加载');
