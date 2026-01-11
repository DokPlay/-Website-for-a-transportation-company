// ===== Request Form Logic =====

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('detailedRequestForm');
    const successMessage = document.getElementById('successMessage');
    const getLanguage = () => window.siteI18n?.getLanguage() || document.documentElement.lang || 'ru';
    const translations = {
        ru: {
            requiredFields: 'Пожалуйста, заполните обязательные поля: имя и телефон',
            agreePolicy: 'Пожалуйста, подтвердите согласие с политикой конфиденциальности',
            requiredFieldsShort: 'Пожалуйста, заполните обязательные поля',
            sent: '<i class="fas fa-check"></i> Отправлено!',
            messageTitle: '🚚 *Новая заявка на грузоперевозку*',
            contact: '👤 *Контакт:*',
            company: '🏢 *Компания:*',
            phone: '📞 *Телефон:*',
            email: '📧 *Email:*',
            contactMethod: '💬 *Связь:*',
            route: '📍 *Маршрут:*',
            from: 'Откуда:',
            to: 'Куда:',
            cargo: '📦 *Груз:*',
            cargoType: 'Тип:',
            weight: 'Вес:',
            volume: 'Объём:',
            places: 'Мест:',
            cargoValue: 'Ценность:',
            services: '⚙️ *Доп. услуги:*',
            comment: '💬 *Комментарий:*'
        },
        en: {
            requiredFields: 'Please fill in the required fields: name and phone',
            agreePolicy: 'Please confirm the privacy policy agreement',
            requiredFieldsShort: 'Please fill in the required fields',
            sent: '<i class="fas fa-check"></i> Sent!',
            messageTitle: '🚚 *New freight request*',
            contact: '👤 *Contact:*',
            company: '🏢 *Company:*',
            phone: '📞 *Phone:*',
            email: '📧 *Email:*',
            contactMethod: '💬 *Contact method:*',
            route: '📍 *Route:*',
            from: 'From:',
            to: 'To:',
            cargo: '📦 *Cargo:*',
            cargoType: 'Type:',
            weight: 'Weight:',
            volume: 'Volume:',
            places: 'Packages:',
            cargoValue: 'Declared value:',
            services: '⚙️ *Additional services:*',
            comment: '💬 *Comment:*'
        }
    };

    function t(key) {
        const language = getLanguage();
        return translations[language]?.[key] || translations.ru[key] || key;
    }
    
    if (!form) return;
    
    // Phone mask
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            let formatted = '';
            if (value.length > 0) {
                formatted = '0';
            }
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 6);
            }
            if (value.length > 6) {
                formatted += '-' + value.slice(6, 8);
            }
            if (value.length > 8) {
                formatted += '-' + value.slice(8, 10);
            }
            
            e.target.value = formatted;
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (key === 'services[]') {
                if (!data.services) data.services = [];
                data.services.push(value);
            } else {
                data[key] = value;
            }
        });
        
        // Validate
        if (!data.name || !data.phone) {
            alert(t('requiredFields'));
            return;
        }
        
        if (!data.agree) {
            alert(t('agreePolicy'));
            return;
        }
        
        // Prepare message for WhatsApp/Telegram
        const message = formatMessage(data);
        
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Open WhatsApp with pre-filled message (optional)
        // This simulates sending to WhatsApp/Telegram
        console.log('Form data:', data);
        console.log('Formatted message:', message);
        
        // In a real implementation, you would send this to a backend or use a service
        // For demo purposes, we show success and log the data
    });
    
    // Format message for messengers
    function formatMessage(data) {
        let message = `${t('messageTitle')}\n\n`;
        
        message += `${t('contact')} ${data.name}\n`;
        if (data.company) message += `${t('company')} ${data.company}\n`;
        message += `${t('phone')} ${data.phone}\n`;
        if (data.email) message += `${t('email')} ${data.email}\n`;
        message += `${t('contactMethod')} ${getContactMethodName(data.contactMethod)}\n\n`;
        
        if (data.cityFrom || data.cityTo) {
            message += `${t('route')}\n`;
            if (data.cityFrom) message += `  ${t('from')} ${data.cityFrom}`;
            if (data.addressFrom) message += ` (${data.addressFrom})`;
            message += `\n`;
            if (data.cityTo) message += `  ${t('to')} ${data.cityTo}`;
            if (data.addressTo) message += ` (${data.addressTo})`;
            message += `\n\n`;
        }
        
        if (data.cargoType || data.weight || data.volume) {
            message += `${t('cargo')}\n`;
            if (data.cargoType) message += `  ${t('cargoType')} ${getCargoTypeName(data.cargoType)}\n`;
            if (data.weight) message += `  ${t('weight')} ${data.weight} кг\n`;
            if (data.volume) message += `  ${t('volume')} ${data.volume} м³\n`;
            if (data.places) message += `  ${t('places')} ${data.places}\n`;
            if (data.cargoValue) message += `  ${t('cargoValue')} ${data.cargoValue} ₽\n`;
            message += `\n`;
        }
        
        if (data.services && data.services.length > 0) {
            message += `${t('services')}\n`;
            data.services.forEach(service => {
                message += `  ✓ ${getServiceName(service)}\n`;
            });
            message += `\n`;
        }
        
        if (data.comment) {
            message += `${t('comment')}\n${data.comment}\n`;
        }
        
        return message;
    }
    
    function getContactMethodName(method) {
        const methods = {
            ru: {
                phone: 'Телефон',
                whatsapp: 'WhatsApp',
                telegram: 'Telegram',
                email: 'Email'
            },
            en: {
                phone: 'Phone',
                whatsapp: 'WhatsApp',
                telegram: 'Telegram',
                email: 'Email'
            }
        };
        const language = getLanguage();
        return methods[language]?.[method] || methods.ru[method] || method;
    }
    
    function getCargoTypeName(type) {
        const types = {
            ru: {
                documents: 'Документы',
                parcels: 'Посылки/коробки',
                pallets: 'Паллеты',
                equipment: 'Оборудование',
                furniture: 'Мебель',
                fragile: 'Хрупкие грузы',
                oversized: 'Негабаритные грузы',
                other: 'Другое'
            },
            en: {
                documents: 'Documents',
                parcels: 'Parcels/boxes',
                pallets: 'Pallets',
                equipment: 'Equipment',
                furniture: 'Furniture',
                fragile: 'Fragile goods',
                oversized: 'Oversized cargo',
                other: 'Other'
            }
        };
        const language = getLanguage();
        return types[language]?.[type] || types.ru[type] || type;
    }
    
    function getServiceName(service) {
        const services = {
            ru: {
                express: 'Экспресс-доставка',
                insurance: 'Страхование груза',
                packaging: 'Упаковка',
                loading: 'Погрузка/разгрузка'
            },
            en: {
                express: 'Express delivery',
                insurance: 'Cargo insurance',
                packaging: 'Packaging',
                loading: 'Loading/unloading'
            }
        };
        const language = getLanguage();
        return services[language]?.[service] || services.ru[service] || service;
    }
});

// Handle home page request form (if exists)
document.addEventListener('DOMContentLoaded', function() {
    const quickForm = document.getElementById('requestForm');
    const getLanguage = () => window.siteI18n?.getLanguage() || document.documentElement.lang || 'ru';
    const translations = {
        ru: {
            requiredFieldsShort: 'Пожалуйста, заполните обязательные поля',
            agreePolicy: 'Пожалуйста, подтвердите согласие с политикой конфиденциальности',
            sent: '<i class="fas fa-check"></i> Отправлено!'
        },
        en: {
            requiredFieldsShort: 'Please fill in the required fields',
            agreePolicy: 'Please confirm the privacy policy agreement',
            sent: '<i class="fas fa-check"></i> Sent!'
        }
    };

    function t(key) {
        const language = getLanguage();
        return translations[language]?.[key] || translations.ru[key] || key;
    }
    
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value;
            const phone = document.getElementById('phone')?.value;
            const email = document.getElementById('email')?.value;
            const comment = document.getElementById('comment')?.value;
            const agree = document.querySelector('input[name="agree"]')?.checked;
            
            if (!name || !phone) {
                alert(t('requiredFieldsShort'));
                return;
            }
            
            if (!agree) {
                alert(t('agreePolicy'));
                return;
            }
            
            // Success feedback
            const submitBtn = quickForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = t('sent');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                quickForm.reset();
            }, 3000);
            
            console.log('Quick form submitted:', { name, phone, email, comment });
        });
    }
});
