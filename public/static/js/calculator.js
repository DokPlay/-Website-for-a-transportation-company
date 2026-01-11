// ===== Calculator Logic =====

document.addEventListener('DOMContentLoaded', function() {
    const getLanguage = () => window.siteI18n?.getLanguage() || document.documentElement.lang || 'ru';
    const calculatorForm = document.getElementById('calculatorForm');
    const resultContent = document.getElementById('resultContent');
    const resultPlaceholder = document.querySelector('.result-placeholder');
    
    // City distances (in km) - simplified matrix
    const distances = {
        'moscow-spb': 700,
        'moscow-kazan': 800,
        'moscow-ekb': 1800,
        'moscow-novosibirsk': 3200,
        'moscow-nnov': 400,
        'moscow-samara': 1050,
        'moscow-rostov': 1100,
        'moscow-krasnodar': 1350,
        'moscow-voronezh': 500,
        'spb-kazan': 1500,
        'spb-ekb': 2500,
        'spb-novosibirsk': 3900,
        'spb-nnov': 1100,
        'spb-samara': 1750,
        'spb-rostov': 1800,
        'spb-krasnodar': 2050,
        'spb-voronezh': 1200,
        'kazan-ekb': 1000,
        'kazan-novosibirsk': 2400,
        'kazan-nnov': 400,
        'kazan-samara': 350,
        'kazan-rostov': 1300,
        'kazan-krasnodar': 1550,
        'kazan-voronezh': 800,
        'ekb-novosibirsk': 1500,
        'ekb-nnov': 1400,
        'ekb-samara': 850,
        'ekb-rostov': 2300,
        'ekb-krasnodar': 2550,
        'ekb-voronezh': 1700,
        'novosibirsk-nnov': 2800,
        'novosibirsk-samara': 2150,
        'novosibirsk-rostov': 3700,
        'novosibirsk-krasnodar': 3950,
        'novosibirsk-voronezh': 3100,
        'nnov-samara': 650,
        'nnov-rostov': 1100,
        'nnov-krasnodar': 1350,
        'nnov-voronezh': 500,
        'samara-rostov': 1150,
        'samara-krasnodar': 1400,
        'samara-voronezh': 800,
        'rostov-krasnodar': 270,
        'rostov-voronezh': 600,
        'krasnodar-voronezh': 850
    };
    
    // City names
    const cityNames = {
        ru: {
            moscow: 'Москва',
            spb: 'Санкт-Петербург',
            kazan: 'Казань',
            ekb: 'Екатеринбург',
            novosibirsk: 'Новосибирск',
            nnov: 'Нижний Новгород',
            samara: 'Самара',
            rostov: 'Ростов-на-Дону',
            krasnodar: 'Краснодар',
            voronezh: 'Воронеж'
        },
        en: {
            moscow: 'Moscow',
            spb: 'Saint Petersburg',
            kazan: 'Kazan',
            ekb: 'Yekaterinburg',
            novosibirsk: 'Novosibirsk',
            nnov: 'Nizhny Novgorod',
            samara: 'Samara',
            rostov: 'Rostov-on-Don',
            krasnodar: 'Krasnodar',
            voronezh: 'Voronezh'
        }
    };
    
    // Service types
    const serviceTypes = {
        ru: {
            standard: { name: 'Стандартная', days: '3-5 дней', multiplier: 1 },
            express: { name: 'Экспресс', days: '1-2 дня', multiplier: 1.5 },
            economy: { name: 'Эконом', days: '5-7 дней', multiplier: 0.8 }
        },
        en: {
            standard: { name: 'Standard', days: '3-5 days', multiplier: 1 },
            express: { name: 'Express', days: '1-2 days', multiplier: 1.5 },
            economy: { name: 'Economy', days: '5-7 days', multiplier: 0.8 }
        }
    };
    
    // Calculate volume from dimensions
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const volumeInput = document.getElementById('volume');
    const calculatedVolumeSpan = document.getElementById('calculatedVolume');
    
    function calculateVolume() {
        const length = parseFloat(lengthInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const height = parseFloat(heightInput.value) || 0;
        
        if (length > 0 && width > 0 && height > 0) {
            const volumeM3 = (length * width * height) / 1000000;
            calculatedVolumeSpan.textContent = volumeM3.toFixed(2);
            if (!volumeInput.value) {
                volumeInput.value = volumeM3.toFixed(2);
            }
        } else {
            calculatedVolumeSpan.textContent = '0';
        }
    }
    
    [lengthInput, widthInput, heightInput].forEach(input => {
        input.addEventListener('input', calculateVolume);
    });
    
    // Get distance between cities
    function getDistance(cityFrom, cityTo) {
        if (cityFrom === cityTo) return 0;
        
        const key1 = `${cityFrom}-${cityTo}`;
        const key2 = `${cityTo}-${cityFrom}`;
        
        return distances[key1] || distances[key2] || 1000;
    }
    
    // Calculate price
    function calculatePrice(formData) {
        const distance = getDistance(formData.cityFrom, formData.cityTo);
        const weight = parseFloat(formData.weight) || 0;
        const volume = parseFloat(formData.volume) || 0;
        
        // Volumetric weight (density 250 kg/m³)
        const volumetricWeight = volume * 250;
        const billableWeight = Math.max(weight, volumetricWeight);
        
        // Base price calculation
        // Base rate: 15 RUB per kg per 100 km
        let basePrice = billableWeight * (distance / 100) * 15;
        
        // Minimum price
        basePrice = Math.max(basePrice, 1500);
        
        // Service type multiplier
        const language = getLanguage();
        const serviceMultiplier = serviceTypes[language]?.[formData.serviceType]?.multiplier || serviceTypes.ru[formData.serviceType].multiplier;
        basePrice = basePrice * serviceMultiplier;
        
        // Additional services
        let extrasPrice = 0;
        const extras = [];
        
        if (formData.insurance) {
            const insuranceCost = basePrice * 0.02;
            extrasPrice += insuranceCost;
            extras.push({
                name: getLanguage() === 'en' ? 'Cargo insurance' : 'Страхование груза',
                price: insuranceCost
            });
        }
        
        if (formData.packaging) {
            const packagingCost = Math.max(500, weight * 10);
            extrasPrice += packagingCost;
            extras.push({
                name: getLanguage() === 'en' ? 'Packaging' : 'Упаковка',
                price: packagingCost
            });
        }
        
        if (formData.loading) {
            const loadingCost = Math.max(1000, weight * 5);
            extrasPrice += loadingCost;
            extras.push({
                name: getLanguage() === 'en' ? 'Loading/unloading' : 'Погрузка/разгрузка',
                price: loadingCost
            });
        }
        
        if (formData.doorToDoor) {
            const doorCost = 800 + (distance / 100) * 50;
            extrasPrice += doorCost;
            extras.push({
                name: getLanguage() === 'en' ? 'Door-to-door' : 'От двери до двери',
                price: doorCost
            });
        }
        
        return {
            distance,
            weight,
            volume,
            billableWeight,
            basePrice: Math.round(basePrice),
            extrasPrice: Math.round(extrasPrice),
            totalPrice: Math.round(basePrice + extrasPrice),
            extras,
            service: serviceTypes[getLanguage()]?.[formData.serviceType] || serviceTypes.ru[formData.serviceType]
        };
    }
    
    // Format price
    function formatPrice(price) {
        const locale = getLanguage() === 'en' ? 'en-US' : 'ru-RU';
        return new Intl.NumberFormat(locale).format(price) + ' ₽';
    }
    
    // Display results
    function displayResults(formData, calculation) {
        // Hide placeholder, show results
        resultPlaceholder.style.display = 'none';
        resultContent.style.display = 'block';
        
        // Date
        const dateLocale = getLanguage() === 'en' ? 'en-US' : 'ru-RU';
        document.getElementById('resultDate').textContent = new Date().toLocaleDateString(dateLocale);
        
        // Route
        const language = getLanguage();
        document.getElementById('resultFrom').textContent = cityNames[language]?.[formData.cityFrom] || cityNames.ru[formData.cityFrom];
        document.getElementById('resultTo').textContent = cityNames[language]?.[formData.cityTo] || cityNames.ru[formData.cityTo];
        document.getElementById('resultDistance').textContent = language === 'en'
            ? `${calculation.distance} km`
            : `${calculation.distance} км`;
        
        // Details
        document.getElementById('resultWeight').textContent = language === 'en'
            ? `${calculation.weight} kg`
            : `${calculation.weight} кг`;
        document.getElementById('resultVolume').textContent = language === 'en'
            ? `${calculation.volume} m³`
            : `${calculation.volume} м³`;
        document.getElementById('resultService').textContent = calculation.service.name;
        document.getElementById('resultDays').textContent = calculation.service.days;
        
        // Extras
        const extrasSection = document.getElementById('resultExtras');
        const extrasList = document.getElementById('extrasList');
        const extrasPrice = document.getElementById('extrasPrice');
        
        if (calculation.extras.length > 0) {
            extrasSection.style.display = 'block';
            extrasPrice.style.display = 'flex';
            
            extrasList.innerHTML = calculation.extras.map(extra => 
                `<li><i class="fas fa-check"></i> ${extra.name} — ${formatPrice(extra.price)}</li>`
            ).join('');
            
            document.getElementById('extrasPriceValue').textContent = formatPrice(calculation.extrasPrice);
        } else {
            extrasSection.style.display = 'none';
            extrasPrice.style.display = 'none';
        }
        
        // Prices
        document.getElementById('basePrice').textContent = formatPrice(calculation.basePrice);
        document.getElementById('totalPrice').textContent = formatPrice(calculation.totalPrice);
        
        // Scroll to results on mobile
        if (window.innerWidth < 1024) {
            resultContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    const language = window.siteI18n?.getLanguage() || document.documentElement.lang || 'ru';
    const translations = {
        ru: {
            cityMismatch: 'Города отправки и доставки должны различаться',
            managerNotice: 'Свяжитесь с менеджером по телефону 0 (000) 00-00-00.'
        },
        en: {
            cityMismatch: 'The origin and destination cities must be different',
            managerNotice: 'Please contact our manager by phone: 0 (000) 00-00-00.'
        }
    };

    function t(key) {
        return translations[language]?.[key] || translations.ru[key] || key;
    }

    // Form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            cityFrom: document.getElementById('cityFrom').value,
            cityTo: document.getElementById('cityTo').value,
            weight: document.getElementById('weight').value,
            volume: document.getElementById('volume').value || calculatedVolumeSpan.textContent,
            serviceType: document.querySelector('input[name="serviceType"]:checked').value,
            insurance: document.querySelector('input[name="insurance"]').checked,
            packaging: document.querySelector('input[name="packaging"]').checked,
            loading: document.querySelector('input[name="loading"]').checked,
            doorToDoor: document.querySelector('input[name="doorToDoor"]').checked
        };
        
        // Validation
        if (formData.cityFrom === formData.cityTo) {
            alert(t('cityMismatch'));
            return;
        }
        
        const calculation = calculatePrice(formData);
        displayResults(formData, calculation);
    });
    
    // Ask manager button
    document.getElementById('askManager')?.addEventListener('click', function() {
        alert(t('managerNotice'));
    });
});
