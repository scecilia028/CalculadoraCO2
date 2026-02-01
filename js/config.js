// Global configuration object for the carbon calculator
var CONFIG = {
    // Emission factors in kg CO2 per km for different transport modes
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.089,
        truck: 0.96
    },

    // Transport modes metadata
    TRANSPORT_MODES: {
        bicycle: {
            label: "Bicicleta",
            icon: "fas fa-bicycle",
            color: "#4CAF50",
            emoji: "🚲"
        },
        car: {
            label: "Carro",
            icon: "fas fa-car",
            color: "#2196F3",
            emoji: "🚗"
        },
        bus: {
            label: "Ônibus",
            icon: "fas fa-bus",
            color: "#FF9800",
            emoji: "🚌"
        },
        truck: {
            label: "Caminhão",
            icon: "fas fa-truck",
            color: "#9C27B0",
            emoji: "🚛"
        }
    },

    // Carbon credit configuration
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    // Method to populate the cities datalist with all available cities
    populateDatalist: function() {
        var cities = RoutesDB.getAllCities();
        var originDatalist = document.getElementById('cities-list');
        var destinationDatalist = document.getElementById('destination-list');
        if (originDatalist) {
            cities.forEach(function(city) {
                var option = document.createElement('option');
                option.value = city;
                originDatalist.appendChild(option);
            });
        }
        if (destinationDatalist) {
            cities.forEach(function(city) {
                var option = document.createElement('option');
                option.value = city;
                destinationDatalist.appendChild(option);
            });
        }
    },

    // Method to set up distance autofill functionality
    SetupDistanceAutofill: function() {
        var originInput = document.getElementById('origin');
        var destinationInput = document.getElementById('destination');
        var distanceInput = document.getElementById('distance');
        var manualCheckbox = document.getElementById('manual-distance');
        var helperText = document.getElementById('distance-helper');

        if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) return;

        function updateDistance() {
            var origin = originInput.value.trim();
            var destination = destinationInput.value.trim();
            if (origin && destination) {
                var distance = RoutesDB.findDistance(origin, destination);
                if (distance !== null) {
                    distanceInput.value = distance;
                    distanceInput.readOnly = true;
                    if (helperText) {
                        helperText.textContent = "Distância encontrada automaticamente.";
                        helperText.style.color = "green";
                    }
                } else {
                    distanceInput.value = "";
                    // Keep readonly true, user must check manual to edit
                    distanceInput.readOnly = true;
                    if (helperText) {
                        helperText.textContent = "Rota não encontrada. Marque 'Inserir distância manualmente' para inserir.";
                        helperText.style.color = "orange";
                    }
                }
            } else {
                distanceInput.value = "";
                distanceInput.readOnly = true;
                if (helperText) helperText.textContent = "";
            }
        }

        originInput.addEventListener('input', updateDistance);
        destinationInput.addEventListener('input', updateDistance);

        manualCheckbox.addEventListener('change', function() {
            if (manualCheckbox.checked) {
                distanceInput.readOnly = false;
                if (helperText) {
                    helperText.textContent = "Entrada manual ativada.";
                    helperText.style.color = "black";
                }
            } else {
                updateDistance();
            }
        });
    }
};