// 通用JavaScript功能

// 工具函数
const utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    },

    // 格式化数字
    formatNumber(num) {
        return new Intl.NumberFormat('zh-CN').format(num);
    },

    // 格式化价格
    formatPrice(price) {
        return `¥${this.formatNumber(price)}`;
    },

    // 获取URL参数
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // 设置本地存储
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('设置本地存储失败:', e);
        }
    },

    // 获取本地存储
    getStorage(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('获取本地存储失败:', e);
            return null;
        }
    },

    // 移除本地存储
    removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('移除本地存储失败:', e);
        }
    }
};

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.classList.add('fade-in');

    // 初始化工具提示
    initTooltips();

    // 初始化表单验证
    initFormValidation();

    // 初始化懒加载
    initLazyLoading();
});

// 工具提示初始化
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.classList.add('tooltip');
    });
}

// 表单验证初始化
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

// 字段验证
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');

    // 清除之前的错误状态
    field.classList.remove('error', 'success');

    // 必填验证
    if (required && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }

    // 邮箱验证
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }

    // 手机号验证
    if (field.name === 'phone' && value) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, '请输入有效的手机号码');
            return false;
        }
    }

    // 验证通过
    field.classList.add('success');
    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    field.classList.add('error');
    
    // 移除之前的错误信息
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // 添加新的错误信息
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

// 清除字段错误
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// 懒加载初始化
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// 显示加载状态
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
}

// 隐藏加载状态
function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// 显示消息提示
function showMessage(message, type = 'info', duration = 3000) {
    const messageElement = document.createElement('div');
    messageElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getMessageClass(type)}`;
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    // 添加进入动画
    setTimeout(() => {
        messageElement.classList.add('fade-in');
    }, 10);

    // 自动移除
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, duration);
}

// 获取消息样式类
function getMessageClass(type) {
    const classes = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    return classes[type] || classes.info;
}

// 导出工具函数
window.utils = utils;
window.showMessage = showMessage;
window.showLoading = showLoading;
window.hideLoading = hideLoading;