// ===== Calculator Logic =====

document.addEventListener('DOMContentLoaded', function() {
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
        'moscow': 'Москва',
        'spb': 'Санкт-Петербург',
        'kazan': 'Казань',
        'ekb': 'Екатеринбург',
        'novosibirsk': 'Новосибирск',
        'nnov': 'Нижний Новгород',
        'samara': 'Самара',
        'rostov': 'Ростов-на-Дону',
        'krasnodar': 'Краснодар',
        'voronezh': 'Воронеж'
    };
    
    // Service types
    const serviceTypes = {
        'standard': { name: 'Стандартная', days: '3-5 дней', multiplier: 1 },
        'express': { name: 'Экспресс', days: '1-2 дня', multiplier: 1.5 },
        'economy': { name: 'Эконом', days: '5-7 дней', multiplier: 0.8 }
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
        const serviceMultiplier = serviceTypes[formData.serviceType].multiplier;
        basePrice = basePrice * serviceMultiplier;
        
        // Additional services
        let extrasPrice = 0;
        const extras = [];
        
        if (formData.insurance) {
            const insuranceCost = basePrice * 0.02;
            extrasPrice += insuranceCost;
            extras.push({ name: 'Страхование груза', price: insuranceCost });
        }
        
        if (formData.packaging) {
            const packagingCost = Math.max(500, weight * 10);
            extrasPrice += packagingCost;
            extras.push({ name: 'Упаковка', price: packagingCost });
        }
        
        if (formData.loading) {
            const loadingCost = Math.max(1000, weight * 5);
            extrasPrice += loadingCost;
            extras.push({ name: 'Погрузка/разгрузка', price: loadingCost });
        }
        
        if (formData.doorToDoor) {
            const doorCost = 800 + (distance / 100) * 50;
            extrasPrice += doorCost;
            extras.push({ name: 'От двери до двери', price: doorCost });
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
            service: serviceTypes[formData.serviceType]
        };
    }
    
    // Format price
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }
    
    // Display results
    function displayResults(formData, calculation) {
        // Hide placeholder, show results
        resultPlaceholder.style.display = 'none';
        resultContent.style.display = 'block';
        
        // Date
        document.getElementById('resultDate').textContent = new Date().toLocaleDateString('ru-RU');
        
        // Route
        document.getElementById('resultFrom').textContent = cityNames[formData.cityFrom];
        document.getElementById('resultTo').textContent = cityNames[formData.cityTo];
        document.getElementById('resultDistance').textContent = calculation.distance + ' км';
        
        // Details
        document.getElementById('resultWeight').textContent = calculation.weight + ' кг';
        document.getElementById('resultVolume').textContent = calculation.volume + ' м³';
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
            alert('Города отправки и доставки должны различаться');
            return;
        }
        
        const calculation = calculatePrice(formData);
        displayResults(formData, calculation);
    });
    
    // Ask manager button
    document.getElementById('askManager')?.addEventListener('click', function() {
        window.open('https://wa.me/78001234567?text=Здравствуйте! Хочу уточнить стоимость доставки.', '_blank');
    });
});
