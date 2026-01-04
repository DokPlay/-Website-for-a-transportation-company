// ===== Request Form Logic =====

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('detailedRequestForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!form) return;
    
    // Phone mask
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                if (value[0] !== '7') {
                    value = '7' + value;
                }
            }
            
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
            }
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.slice(9, 11);
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
            alert('Пожалуйста, заполните обязательные поля: имя и телефон');
            return;
        }
        
        if (!data.agree) {
            alert('Пожалуйста, подтвердите согласие с политикой конфиденциальности');
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
        let message = `🚚 *Новая заявка на грузоперевозку*\n\n`;
        
        message += `👤 *Контакт:* ${data.name}\n`;
        if (data.company) message += `🏢 *Компания:* ${data.company}\n`;
        message += `📞 *Телефон:* ${data.phone}\n`;
        if (data.email) message += `📧 *Email:* ${data.email}\n`;
        message += `💬 *Связь:* ${getContactMethodName(data.contactMethod)}\n\n`;
        
        if (data.cityFrom || data.cityTo) {
            message += `📍 *Маршрут:*\n`;
            if (data.cityFrom) message += `  Откуда: ${data.cityFrom}`;
            if (data.addressFrom) message += ` (${data.addressFrom})`;
            message += `\n`;
            if (data.cityTo) message += `  Куда: ${data.cityTo}`;
            if (data.addressTo) message += ` (${data.addressTo})`;
            message += `\n\n`;
        }
        
        if (data.cargoType || data.weight || data.volume) {
            message += `📦 *Груз:*\n`;
            if (data.cargoType) message += `  Тип: ${getCargoTypeName(data.cargoType)}\n`;
            if (data.weight) message += `  Вес: ${data.weight} кг\n`;
            if (data.volume) message += `  Объём: ${data.volume} м³\n`;
            if (data.places) message += `  Мест: ${data.places}\n`;
            if (data.cargoValue) message += `  Ценность: ${data.cargoValue} ₽\n`;
            message += `\n`;
        }
        
        if (data.services && data.services.length > 0) {
            message += `⚙️ *Доп. услуги:*\n`;
            data.services.forEach(service => {
                message += `  ✓ ${getServiceName(service)}\n`;
            });
            message += `\n`;
        }
        
        if (data.comment) {
            message += `💬 *Комментарий:*\n${data.comment}\n`;
        }
        
        return message;
    }
    
    function getContactMethodName(method) {
        const methods = {
            'phone': 'Телефон',
            'whatsapp': 'WhatsApp',
            'telegram': 'Telegram',
            'email': 'Email'
        };
        return methods[method] || method;
    }
    
    function getCargoTypeName(type) {
        const types = {
            'documents': 'Документы',
            'parcels': 'Посылки/коробки',
            'pallets': 'Паллеты',
            'equipment': 'Оборудование',
            'furniture': 'Мебель',
            'fragile': 'Хрупкие грузы',
            'oversized': 'Негабаритные грузы',
            'other': 'Другое'
        };
        return types[type] || type;
    }
    
    function getServiceName(service) {
        const services = {
            'express': 'Экспресс-доставка',
            'insurance': 'Страхование груза',
            'packaging': 'Упаковка',
            'loading': 'Погрузка/разгрузка'
        };
        return services[service] || service;
    }
});

// Handle home page request form (if exists)
document.addEventListener('DOMContentLoaded', function() {
    const quickForm = document.getElementById('requestForm');
    
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value;
            const phone = document.getElementById('phone')?.value;
            const email = document.getElementById('email')?.value;
            const comment = document.getElementById('comment')?.value;
            const agree = document.querySelector('input[name="agree"]')?.checked;
            
            if (!name || !phone) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            if (!agree) {
                alert('Пожалуйста, подтвердите согласие с политикой конфиденциальности');
                return;
            }
            
            // Success feedback
            const submitBtn = quickForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
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
