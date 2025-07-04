/**
 * API客户端工具
 * 与后端API服务器进行通信，支持完整的CRUD操作
 * 版本: v1.0
 * 创建时间: 2025-07-01
 */

class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:8001/api/v1'
        this.timeout = 10000 // 10秒超时
        this.retryCount = 3
        this.retryDelay = 1000 // 1秒重试延迟
    }

    /**
     * 通用HTTP请求方法
     * @param {string} endpoint - API端点
     * @param {Object} options - 请求选项
     * @returns {Promise<Object>} API响应
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            timeout: this.timeout,
            ...options
        }

        // 如果有body数据且不是FormData，转换为JSON
        if (config.body && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body)
        }

        let lastError = null
        
        // 重试机制
        for (let attempt = 1; attempt <= this.retryCount; attempt++) {
            try {
                console.log(`🌐 API请求 [尝试${attempt}/${this.retryCount}]:`, config.method, url)
                
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), this.timeout)
                
                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                })
                
                clearTimeout(timeoutId)
                
                // 解析响应
                const data = await response.json()
                
                if (response.ok) {
                    console.log(`✅ API响应成功:`, data)
                    return data
                } else {
                    console.error(`❌ API响应错误 [${response.status}]:`, data)
                    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
                }
                
            } catch (error) {
                lastError = error
                console.error(`❌ API请求失败 [尝试${attempt}/${this.retryCount}]:`, error.message)
                
                // 如果不是最后一次尝试，等待后重试
                if (attempt < this.retryCount) {
                    await this.delay(this.retryDelay * attempt)
                }
            }
        }
        
        throw lastError
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * GET请求
     * @param {string} endpoint - API端点
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} API响应
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `${endpoint}?${queryString}` : endpoint
        return this.request(url, { method: 'GET' })
    }

    /**
     * POST请求
     * @param {string} endpoint - API端点
     * @param {Object} data - 请求数据
     * @returns {Promise<Object>} API响应
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        })
    }

    /**
     * PUT请求
     * @param {string} endpoint - API端点
     * @param {Object} data - 请求数据
     * @returns {Promise<Object>} API响应
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        })
    }

    /**
     * DELETE请求
     * @param {string} endpoint - API端点
     * @returns {Promise<Object>} API响应
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' })
    }

    /**
     * PATCH请求
     * @param {string} endpoint - API端点
     * @param {Object} data - 请求数据
     * @returns {Promise<Object>} API响应
     */
    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data
        })
    }

    // ================================
    // 设计项目API方法
    // ================================

    /**
     * 获取设计项目列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 项目列表响应
     */
    async getDesignProjects(params = {}) {
        return this.get('/design-projects', params)
    }

    /**
     * 获取设计项目详情
     * @param {string} id - 项目ID
     * @returns {Promise<Object>} 项目详情响应
     */
    async getDesignProject(id) {
        return this.get(`/design-projects/${id}`)
    }

    /**
     * 创建设计项目
     * @param {Object} projectData - 项目数据
     * @returns {Promise<Object>} 创建响应
     */
    async createDesignProject(projectData) {
        return this.post('/design-projects', projectData)
    }

    /**
     * 更新设计项目
     * @param {string} id - 项目ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise<Object>} 更新响应
     */
    async updateDesignProject(id, updateData) {
        return this.put(`/design-projects/${id}`, updateData)
    }

    /**
     * 删除设计项目
     * @param {string} id - 项目ID
     * @returns {Promise<Object>} 删除响应
     */
    async deleteDesignProject(id) {
        return this.delete(`/design-projects/${id}`)
    }

    // ================================
    // 用户API方法
    // ================================

    /**
     * 获取用户列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 用户列表响应
     */
    async getUsers(params = {}) {
        return this.get('/users', params)
    }

    /**
     * 获取用户详情
     * @param {string} id - 用户ID
     * @returns {Promise<Object>} 用户详情响应
     */
    async getUser(id) {
        return this.get(`/users/${id}`)
    }

    /**
     * 创建用户
     * @param {Object} userData - 用户数据
     * @returns {Promise<Object>} 创建响应
     */
    async createUser(userData) {
        return this.post('/users', userData)
    }

    /**
     * 更新用户
     * @param {string} id - 用户ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise<Object>} 更新响应
     */
    async updateUser(id, updateData) {
        return this.put(`/users/${id}`, updateData)
    }

    // ================================
    // 订单API方法
    // ================================

    /**
     * 获取订单列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 订单列表响应
     */
    async getOrders(params = {}) {
        return this.get('/orders', params)
    }

    /**
     * 获取订单详情
     * @param {string} id - 订单ID
     * @returns {Promise<Object>} 订单详情响应
     */
    async getOrder(id) {
        return this.get(`/orders/${id}`)
    }

    /**
     * 创建订单
     * @param {Object} orderData - 订单数据
     * @returns {Promise<Object>} 创建响应
     */
    async createOrder(orderData) {
        return this.post('/orders', orderData)
    }

    /**
     * 更新订单
     * @param {string} id - 订单ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise<Object>} 更新响应
     */
    async updateOrder(id, updateData) {
        return this.put(`/orders/${id}`, updateData)
    }

    // ================================
    // 健康检查和工具方法
    // ================================

    /**
     * 检查API服务器健康状态
     * @returns {Promise<Object>} 健康状态响应
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`)
            return await response.json()
        } catch (error) {
            console.error('❌ 健康检查失败:', error)
            throw error
        }
    }

    /**
     * 格式化错误信息
     * @param {Error} error - 错误对象
     * @returns {string} 格式化的错误信息
     */
    formatError(error) {
        if (error.name === 'AbortError') {
            return '请求超时，请检查网络连接'
        }
        if (error.message.includes('Failed to fetch')) {
            return 'API服务器连接失败，请确保服务器正在运行'
        }
        return error.message || '未知错误'
    }

    /**
     * 显示加载状态
     * @param {HTMLElement} element - 目标元素
     * @param {string} message - 加载消息
     */
    showLoading(element, message = '加载中...') {
        if (element) {
            element.innerHTML = `
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-3"></div>
                    <span class="text-gray-600">${message}</span>
                </div>
            `
        }
    }

    /**
     * 显示错误状态
     * @param {HTMLElement} element - 目标元素
     * @param {string} message - 错误消息
     */
    showError(element, message = '加载失败') {
        if (element) {
            element.innerHTML = `
                <div class="flex flex-col items-center justify-center py-8 text-center">
                    <div class="text-red-500 mb-2">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-gray-600 text-sm">${message}</p>
                    <button onclick="location.reload()" class="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        重新加载
                    </button>
                </div>
            `
        }
    }
}

// 创建全局API客户端实例
window.apiClient = new ApiClient()

// 导出API客户端类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient
}

console.log('✅ API客户端已初始化')
