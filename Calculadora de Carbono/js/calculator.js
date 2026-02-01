// Global calculator object for carbon emission calculations
var CALCULATOR = {
    // Calculate emission for a specific transport mode
    calculateEmission: function(distanceKm, transportMode) {
        var factor = CONFIG.EMISSION_FACTORS[transportMode];
        if (factor === undefined) {
            return 0;
        }
        var emission = distanceKm * factor;
        return Math.round(emission * 100) / 100; // Round to 2 decimal places
    },

    // Calculate emissions for all transport modes and compare to car
    calculateAllModes: function(distanceKm) {
        var results = [];
        var carEmission = this.calculateEmission(distanceKm, 'car');
        for (var mode in CONFIG.EMISSION_FACTORS) {
            var emission = this.calculateEmission(distanceKm, mode);
            var percentageVsCar = carEmission > 0 ? (emission / carEmission) * 100 : 0;
            percentageVsCar = Math.round(percentageVsCar * 100) / 100; // Round to 2 decimal places
            results.push({
                mode: mode,
                emission: emission,
                percentageVsCar: percentageVsCar
            });
        }
        // Sort by emission (lowest first)
        results.sort(function(a, b) {
            return a.emission - b.emission;
        });
        return results;
    },

    // Calculate savings compared to a baseline emission
    // Formula: savedKg = baselineEmission - emission
    // percentage = (savedKg / baselineEmission) * 100
    // Returns object with savedKg and percentage, rounded to 2 decimals
    calculateSavings: function(emission, baselineEmission) {
        var savedKg = baselineEmission - emission;
        var percentage = baselineEmission > 0 ? (savedKg / baselineEmission) * 100 : 0;
        return {
            savedKg: Math.round(savedKg * 100) / 100,
            percentage: Math.round(percentage * 100) / 100
        };
    },

    // Calculate carbon credits needed to offset emission
    // Formula: credits = emissionKg / KG_PER_CREDIT
    // Returns credits rounded to 4 decimal places
    calculateCarbonCredit: function(emissionKg) {
        var credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        return Math.round(credits * 10000) / 10000;
    },

    // Estimate price range for carbon credits
    // min = credits * PRICE_MIN_BRL
    // max = credits * PRICE_MAX_BRL
    // average = (min + max) / 2
    // Returns object with min, max, average prices in BRL, rounded to 2 decimals
    estimateCreditPrice: function(credits) {
        var min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        var max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        var average = (min + max) / 2;
        return {
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            average: Math.round(average * 100) / 100
        };
    },

    // Show thank you toast after carbon credits button click
    showThankYouToast: function() {
        // Create backdrop
        var backdrop = document.createElement('div');
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100%';
        backdrop.style.height = '100%';
        backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        backdrop.style.backdropFilter = 'blur(5px)';
        backdrop.style.zIndex = '999';
        document.body.appendChild(backdrop);

        // Create toast element
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<div class="toast__message">Obrigada por sua contribuição e por promover a sustentabilidade do planeta! 🙏</div>' +
            '<button class="toast__button">OK</button>';
        document.body.appendChild(toast);

        // Style the toast (simple inline styles for demo)
        toast.style.position = 'fixed';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.backgroundColor = 'white';
        toast.style.border = '2px solid #10b981';
        toast.style.borderRadius = '8px';
        toast.style.padding = '20px';
        toast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        toast.style.zIndex = '1000';
        toast.style.textAlign = 'center';

        // OK button event
        var okButton = toast.querySelector('.toast__button');
        okButton.style.marginTop = '10px';
        okButton.style.padding = '10px 20px';
        okButton.style.backgroundColor = '#10b981';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';

        okButton.addEventListener('click', function() {
            document.body.removeChild(toast);
            document.body.removeChild(backdrop);
            // Reset to initial state
            UI.hideElement('results');
            UI.hideElement('comparison');
            UI.hideElement('carbon-credits');
            document.getElementById('carbon-form').reset();
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};