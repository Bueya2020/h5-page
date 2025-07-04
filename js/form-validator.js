// 表单验证器

(function() {
    'use strict';

    // 验证规则
    const validationRules = {
        required: {
            test: (value) => value && value.trim() !== '',
            message: '此字段为必填项'
        },
        email: {
            test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: '请输入有效的邮箱地址'
        },
        phone: {
            test: (value) => /^1[3-9]\d{9}$/.test(value),
            message: '请输入有效的手机号码'
        },
        password: {
            test: (value) => value && value.length >= 6,
            message: '密码至少需要6位字符'
        },
        confirmPassword: {
            test: (value, form) => {
                const password = form.querySelector('input[name="password"]');
                return password && value === password.value;
            },
            message: '两次输入的密码不一致'
        },
        minLength: {
            test: (value, form, min) => value && value.length >= min,
            message: (min) => `至少需要${min}个字符`
        },
        maxLength: {
            test: (value, form, max) => !value || value.length <= max,
            message: (max) => `最多只能输入${max}个字符`
        },
        number: {
            test: (value) => !value || /^\d+$/.test(value),
            message: '请输入有效的数字'
        },
        decimal: {
            test: (value) => !value || /^\d+(\.\d+)?$/.test(value),
            message: '请输入有效的数字'
        },
        url: {
            test: (value) => !value || /^https?:\/\/.+/.test(value),
            message: '请输入有效的网址'
        },
        idCard: {
            test: (value) => !value || /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value),
            message: '请输入有效的身份证号码'
        }
    };

    // 表单验证器类
    class FormValidator {
        constructor(form, options = {}) {
            this.form = typeof form === 'string' ? document.querySelector(form) : form;
            this.options = {
                validateOnBlur: true,
                validateOnInput: false,
                showErrorMessages: true,
                errorClass: 'error',
                successClass: 'success',
                errorMessageClass: 'error-message',
                ...options
            };
            this.errors = {};
            this.init();
        }

        init() {
            if (!this.form) return;

            // 绑定事件
            this.bindEvents();
            
            // 初始化字段
            this.initFields();
        }

        bindEvents() {
            // 表单提交事件
            this.form.addEventListener('submit', (e) => {
                if (!this.validateAll()) {
                    e.preventDefault();
                    this.focusFirstError();
                }
            });

            // 字段事件
            const fields = this.getFields();
            fields.forEach(field => {
                if (this.options.validateOnBlur) {
                    field.addEventListener('blur', () => this.validateField(field));
                }
                
                if (this.options.validateOnInput) {
                    field.addEventListener('input', () => this.validateField(field));
                } else {
                    // 清除错误状态
                    field.addEventListener('input', () => this.clearFieldError(field));
                }
            });
        }

        initFields() {
            const fields = this.getFields();
            fields.forEach(field => {
                // 添加必填标识
                if (field.hasAttribute('required')) {
                    this.addRequiredIndicator(field);
                }
            });
        }

        getFields() {
            return Array.from(this.form.querySelectorAll('input, textarea, select'));
        }

        validateField(field) {
            const value = field.value.trim();
            const rules = this.getFieldRules(field);
            const fieldName = field.name || field.id;

            // 清除之前的错误
            delete this.errors[fieldName];
            this.clearFieldError(field);

            // 验证规则
            for (const rule of rules) {
                if (!this.testRule(rule, value, field)) {
                    this.errors[fieldName] = rule.message;
                    this.showFieldError(field, rule.message);
                    return false;
                }
            }

            // 验证通过
            this.showFieldSuccess(field);
            return true;
        }

        getFieldRules(field) {
            const rules = [];
            const type = field.type;
            const name = field.name;

            // 必填验证
            if (field.hasAttribute('required')) {
                rules.push(validationRules.required);
            }

            // 类型验证
            if (type === 'email') {
                rules.push(validationRules.email);
            } else if (type === 'tel' || name === 'phone') {
                rules.push(validationRules.phone);
            } else if (type === 'password') {
                rules.push(validationRules.password);
            } else if (name === 'confirmPassword') {
                rules.push(validationRules.confirmPassword);
            } else if (type === 'url') {
                rules.push(validationRules.url);
            } else if (type === 'number') {
                rules.push(validationRules.number);
            }

            // 长度验证
            const minLength = field.getAttribute('minlength');
            if (minLength) {
                rules.push({
                    test: (value) => validationRules.minLength.test(value, null, parseInt(minLength)),
                    message: validationRules.minLength.message(minLength)
                });
            }

            const maxLength = field.getAttribute('maxlength');
            if (maxLength) {
                rules.push({
                    test: (value) => validationRules.maxLength.test(value, null, parseInt(maxLength)),
                    message: validationRules.maxLength.message(maxLength)
                });
            }

            // 自定义验证规则
            const customRule = field.getAttribute('data-rule');
            if (customRule && validationRules[customRule]) {
                rules.push(validationRules[customRule]);
            }

            // 自定义验证函数
            const customValidator = field.getAttribute('data-validator');
            if (customValidator && window[customValidator]) {
                rules.push({
                    test: window[customValidator],
                    message: field.getAttribute('data-message') || '输入格式不正确'
                });
            }

            return rules;
        }

        testRule(rule, value, field) {
            if (typeof rule.test === 'function') {
                return rule.test(value, this.form, field);
            }
            return true;
        }

        validateAll() {
            const fields = this.getFields();
            let isValid = true;

            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        }

        showFieldError(field, message) {
            if (!this.options.showErrorMessages) return;

            field.classList.add(this.options.errorClass);
            field.classList.remove(this.options.successClass);

            // 移除之前的错误信息
            this.removeErrorMessage(field);

            // 添加错误信息
            const errorElement = document.createElement('div');
            errorElement.className = this.options.errorMessageClass;
            errorElement.textContent = message;
            
            const container = field.parentNode;
            container.appendChild(errorElement);
        }

        showFieldSuccess(field) {
            field.classList.remove(this.options.errorClass);
            field.classList.add(this.options.successClass);
            this.removeErrorMessage(field);
        }

        clearFieldError(field) {
            field.classList.remove(this.options.errorClass);
            this.removeErrorMessage(field);
        }

        removeErrorMessage(field) {
            const container = field.parentNode;
            const errorElement = container.querySelector(`.${this.options.errorMessageClass}`);
            if (errorElement) {
                errorElement.remove();
            }
        }

        addRequiredIndicator(field) {
            const label = this.form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.textContent = ' *';
                indicator.style.color = 'red';
                label.appendChild(indicator);
            }
        }

        focusFirstError() {
            const firstErrorField = this.form.querySelector(`.${this.options.errorClass}`);
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        getErrors() {
            return this.errors;
        }

        hasErrors() {
            return Object.keys(this.errors).length > 0;
        }

        reset() {
            this.errors = {};
            const fields = this.getFields();
            fields.forEach(field => {
                this.clearFieldError(field);
                field.classList.remove(this.options.successClass);
            });
        }

        // 添加自定义验证规则
        static addRule(name, rule) {
            validationRules[name] = rule;
        }

        // 获取验证规则
        static getRule(name) {
            return validationRules[name];
        }
    }

    // 自动初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 自动为带有 data-validate 属性的表单添加验证
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            const options = {};
            
            // 从 data 属性读取配置
            if (form.dataset.validateOnBlur !== undefined) {
                options.validateOnBlur = form.dataset.validateOnBlur !== 'false';
            }
            if (form.dataset.validateOnInput !== undefined) {
                options.validateOnInput = form.dataset.validateOnInput === 'true';
            }
            if (form.dataset.showErrorMessages !== undefined) {
                options.showErrorMessages = form.dataset.showErrorMessages !== 'false';
            }

            new FormValidator(form, options);
        });
    });

    // 导出到全局
    window.FormValidator = FormValidator;

    // 常用验证函数
    window.validators = {
        // 中文姓名验证
        chineseName: (value) => /^[\u4e00-\u9fa5]{2,10}$/.test(value),
        
        // 银行卡号验证
        bankCard: (value) => /^\d{16,19}$/.test(value),
        
        // 邮政编码验证
        zipCode: (value) => /^\d{6}$/.test(value),
        
        // QQ号验证
        qq: (value) => /^[1-9]\d{4,10}$/.test(value),
        
        // 微信号验证
        wechat: (value) => /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(value)
    };

    console.log('表单验证器已加载');
})();