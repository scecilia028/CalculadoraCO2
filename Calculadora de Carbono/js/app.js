// Global APP object for application logic
var APP = (function() {
    // Initialization function called when DOM is ready
    function init() {
        // Populate the cities datalist with all available cities
        CONFIG.populateDatalist();

        // Set up distance autofill functionality for origin and destination inputs
        CONFIG.SetupDistanceAutofill();

        // Get the calculator form element
        var calculatorForm = document.getElementById('carbon-form');

        // Add submit event listener to handle form submission
        calculatorForm.addEventListener('submit', handleFormSubmit);

        // Set up transport selector checked state
        var radios = document.querySelectorAll('.transport-selector__radio');
        radios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.transport-selector__option').forEach(function(option) {
                    option.classList.remove('checked');
                });
                if (radio.checked) {
                    radio.parentElement.classList.add('checked');
                }
            });
        });

        // Initialize checked state
        var checkedRadio = document.querySelector('.transport-selector__radio:checked');
        if (checkedRadio) {
            checkedRadio.dispatchEvent(new Event('change'));
        }

        // Log successful initialization to console
        console.log('✅ Calculadora inicializada!');
    }

    // Form submit event handler
    function handleFormSubmit(event) {
        // Prevent default form submission to handle with JavaScript
        event.preventDefault();

        // Get form input values
        var origin = document.getElementById('origin').value.trim();
        var destination = document.getElementById('destination').value.trim();
        var distance = parseFloat(document.getElementById('distance').value);
        var transportMode = document.querySelector('input[name="transport"]:checked').value;

        // Map Portuguese transport mode to internal key
        var modeKey = {
            'bicicleta': 'bicycle',
            'carro': 'car',
            'onibus': 'bus',
            'caminhao': 'truck'
        }[transportMode] || transportMode;

        // Validate inputs
        if (!origin || !destination || isNaN(distance) || distance <= 0) {
            alert('Por favor, preencha todos os campos corretamente. A distância deve ser maior que 0.');
            return;
        }

        // Get the submit button for loading state
        var submitButton = document.querySelector('#carbon-form button[type="submit"]');

        // Show loading state on the button
        UI.showLoading(submitButton);

        // Hide previous results sections
        UI.hideElement('results');
        UI.hideElement('comparison');
        UI.hideElement('carbon-credits');

        // Perform calculations and render results
        try {
            // Calculate emission for selected transport mode
            var emission = CALCULATOR.calculateEmission(distance, modeKey);

            // Calculate car emission as baseline for comparison
            var carEmission = CALCULATOR.calculateEmission(distance, 'car');

            // Calculate savings compared to car
            var savings = CALCULATOR.calculateSavings(emission, carEmission);

            // Calculate emissions for all transport modes
            var allModes = CALCULATOR.calculateAllModes(distance);

            // Calculate carbon credits needed
            var credits = CALCULATOR.calculateCarbonCredit(emission);

            // Estimate price range for credits
            var price = CALCULATOR.estimateCreditPrice(credits);

            // Build data object for results rendering
            var resultsData = {
                origin: origin,
                destination: destination,
                distance: distance,
                emission: emission,
                mode: modeKey,
                savings: savings
            };

            // Render and display results
            var resultsHtml = UI.renderResults(resultsData);
            document.getElementById('results-content').innerHTML = resultsHtml;

            // Render and display comparison
            var comparisonHtml = UI.calculateComparison(allModes, modeKey);
            document.getElementById('comparison-content').innerHTML = comparisonHtml;

            // Render and display carbon credits
            var creditsData = { credits: credits, price: price };
            var creditsHtml = UI.renderCarbonCredits(creditsData);
            document.getElementById('carbon-credits-content').innerHTML = creditsHtml;

            // Add event listener to carbon credits button
            var carbonButton = document.querySelector('.carbon_credits_button');
            if (carbonButton) {
                carbonButton.addEventListener('click', function() {
                    CALCULATOR.showThankYouToast();
                });
            }

            // Show all results sections
            UI.showElement('results');
            UI.showElement('comparison');
            UI.showElement('carbon-credits');

            // Scroll to results section
            UI.scrollToElement('results');

            // Hide loading state
            UI.hideLoading(submitButton);

        } catch (error) {
            // Log error for debugging
            console.error('Erro no cálculo:', error);

            // Show user-friendly error message
            alert('Ocorreu um erro durante o cálculo. Tente novamente.');

            // Hide loading state even on error
            UI.hideLoading(submitButton);
        }
    }

    // Return public methods
    return {
        init: init
    };
})();

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', APP.init);