// Global UI object for handling user interface operations
var UI = {
    // Utility method to format numbers with thousand separators and specified decimals
    formatNumber: function(number, decimals) {
        return number.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },

    // Utility method to format currency in Brazilian Real
    formatCurrency: function(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    // Utility method to show an element by removing 'hidden' class
    showElement: function(elementId) {
        var element = document.getElementById(elementId);
        if (element) element.classList.remove('hidden');
    },

    // Utility method to hide an element by adding 'hidden' class
    hideElement: function(elementId) {
        var element = document.getElementById(elementId);
        if (element) element.classList.add('hidden');
    },

    // Utility method to scroll smoothly to an element
    scrollToElement: function(elementId) {
        var element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    },

    // Rendering method for results data
    // Creates HTML cards for route, distance, emission, transport mode, and savings
    // Structure: Multiple div.results_card elements with BEM-style classes
    renderResults: function(data) {
        var modeMeta = CONFIG.TRANSPORT_MODES[data.mode];
        var html = '<div class="results_card results_card--route">' +
            '<h3 class="results_card__title">Rota</h3>' +
            '<p class="results_card__content"><span class="results_card__emoji">🚗</span> ' + data.origin + ' → ' + data.destination + '</p>' +
            '</div>' +
            '<div class="results_card results_card--distance">' +
            '<h3 class="results_card__title">Distância</h3>' +
            '<p class="results_card__content"><span class="results_card__emoji">📏</span> ' + this.formatNumber(data.distance, 0) + ' km</p>' +
            '</div>' +
            '<div class="results_card results_card--emission">' +
            '<h3 class="results_card__title">Emissões de CO₂</h3>' +
            '<p class="results_card__content"><span class="results_card__emoji">🌿</span> <i class="fas fa-leaf" style="color: green;"></i> ' + this.formatNumber(data.emission, 2) + ' kg</p>' +
            '</div>' +
            '<div class="results_card results_card--transport">' +
            '<h3 class="results_card__title">Modo de Transporte</h3>' +
            '<p class="results_card__content"><span class="results_card__emoji">' + modeMeta.emoji + '</span> <i class="' + modeMeta.icon + '" style="color: ' + modeMeta.color + ';"></i> ' + modeMeta.label + '</p>' +
            '</div>';
        if (data.mode !== 'car' && data.savings) {
            html += '<div class="results_card results_card--savings">' +
                '<h3 class="results_card__title">Economia</h3>' +
                '<p class="results_card__content"><span class="results_card__emoji">💰</span> ' + this.formatNumber(data.savings.savedKg, 2) + ' kg CO₂ economizados (' + this.formatNumber(data.savings.percentage, 2) + '%)</p>' +
                '</div>';
        }
        return html;
    },

    // Rendering method for transport mode comparison
    // Creates comparison items with progress bars and color coding
    // Structure: div.comparison_item for each mode, with header, progress bar, and tip box
    calculateComparison: function(modesArray, selectedMode) {
        var emissions = modesArray.map(function(m) { return m.emission; });
        var maxEmission = Math.max.apply(null, emissions);
        var html = '';
        modesArray.forEach(function(modeData) {
            var modeMeta = CONFIG.TRANSPORT_MODES[modeData.mode];
            var isSelected = modeData.mode === selectedMode;
            var percentage = maxEmission > 0 ? (modeData.emission / maxEmission) * 100 : 0;
            var colorClass = percentage <= 25 ? 'green' : percentage <= 75 ? 'yellow' : percentage <= 100 ? 'orange' : 'red';
            html += '<div class="comparison_item' + (isSelected ? ' comparison_item--selected' : '') + '">' +
                '<div class="comparison_item__header">' +
                '<span class="comparison_item__emoji">' + modeMeta.emoji + '</span>' +
                '<i class="' + modeMeta.icon + '" style="color: ' + modeMeta.color + ';"></i>' +
                '<span class="comparison_item__label">' + modeMeta.label + '</span>' +
                '<span class="comparison_item__emission">' + UI.formatNumber(modeData.emission, 2) + ' kg CO₂</span>' +
                (isSelected ? '<span class="comparison_item__badge">Selecionado</span>' : '') +
                '</div>' +
                '<div class="comparison_item__progress">' +
                '<div class="comparison_item__progress-bar comparison_item__progress-bar--' + colorClass + '" style="width: ' + percentage + '%"></div>' +
                '</div>' +
                '</div>';
        });
        html += '<div class="comparison_tip">' +
            '<p>Dica: Escolha modos de transporte com menor emissão para reduzir seu impacto ambiental.</p>' +
            '</div>';
        return html;
    },

    // Rendering method for carbon credits information
    // Creates a grid with credits and price cards, plus info and button
    // Structure: Grid container with cards for credits and price, info box, and button
    renderCarbonCredits: function(creditsData) {
        var html = '<div class="carbon_credits_grid">' +
            '<div class="carbon_credits_card">' +
            '<h3 class="carbon_credits_card__title">Créditos Necessários</h3>' +
            '<p class="carbon_credits_card__value">' + this.formatNumber(creditsData.credits, 4) + '</p>' +
            '<p class="carbon_credits_card__helper">* 1 crédito = 1000 kg CO₂</p>' +
            '</div>' +
            '<div class="carbon_credits_card">' +
            '<h3 class="carbon_credits_card__title">Preço Estimado</h3>' +
            '<p class="carbon_credits_card__value">' + this.formatCurrency(creditsData.price.average) + '</p>' +
            '<p class="carbon_credits_card__helper">Faixa: ' + this.formatCurrency(creditsData.price.min) + ' - ' + this.formatCurrency(creditsData.price.max) + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="carbon_credits_info">' +
            '<p>Créditos de carbono ajudam a compensar suas emissões apoiando projetos de redução de CO₂, como reflorestamento e energias renováveis.</p>' +
            '</div>' +
            '<button class="carbon_credits_button">Compensar Emissões</button>';
        return html;
    },

    // Utility method to show loading state on a button
    showLoading: function(buttonElement) {
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<span class="spinner"></span>Calculando...';
    },

    // Utility method to hide loading state and restore button
    hideLoading: function(buttonElement) {
        buttonElement.disabled = false;
        buttonElement.innerHTML = buttonElement.dataset.originalText;
    },

    // Utility method to capitalize first letter of each word
    capitalizeFirst: function(str) {
        return str.replace(/\b\w/g, function(l) { return l.toUpperCase(); });
    }
};