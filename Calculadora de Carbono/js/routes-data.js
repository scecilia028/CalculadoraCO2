// Global object containing Brazilian routes data and utility methods
var RoutesDB = {
    // Array of route objects, each with origin, destination, and distance in km
    routes: [
        // Capital to capital connections
        { origin: "São Paulo,SP", destination: "Rio de Janeiro,RJ", distanceKm: 430 },
        { origin: "São Paulo,SP", destination: "Brasília,DF", distanceKm: 1015 },
        { origin: "Rio de Janeiro,RJ", destination: "Brasília,DF", distanceKm: 1148 },
        { origin: "São Paulo,SP", destination: "Belo Horizonte,MG", distanceKm: 586 },
        { origin: "Rio de Janeiro,RJ", destination: "Belo Horizonte,MG", distanceKm: 434 },
        { origin: "Brasília,DF", destination: "Belo Horizonte,MG", distanceKm: 716 },
        { origin: "São Paulo,SP", destination: "Salvador,BA", distanceKm: 1962 },
        { origin: "Rio de Janeiro,RJ", destination: "Salvador,BA", distanceKm: 1649 },
        { origin: "Brasília,DF", destination: "Salvador,BA", distanceKm: 1446 },
        { origin: "São Paulo,SP", destination: "Recife,PE", distanceKm: 2653 },
        { origin: "Rio de Janeiro,RJ", destination: "Recife,PE", distanceKm: 2340 },
        { origin: "Brasília,DF", destination: "Recife,PE", distanceKm: 2205 },
        { origin: "São Paulo,SP", destination: "Porto Alegre,RS", distanceKm: 1109 },
        { origin: "Rio de Janeiro,RJ", destination: "Porto Alegre,RS", distanceKm: 1553 },
        { origin: "Brasília,DF", destination: "Porto Alegre,RS", distanceKm: 2020 },
        { origin: "São Paulo,SP", destination: "Curitiba,PR", distanceKm: 408 },
        { origin: "Rio de Janeiro,RJ", destination: "Curitiba,PR", distanceKm: 852 },
        { origin: "Brasília,DF", destination: "Curitiba,PR", distanceKm: 1365 },
        { origin: "São Paulo,SP", destination: "Fortaleza,CE", distanceKm: 3120 },
        { origin: "Rio de Janeiro,RJ", destination: "Fortaleza,CE", distanceKm: 2807 },
        { origin: "Brasília,DF", destination: "Fortaleza,CE", distanceKm: 2200 },
        { origin: "São Paulo,SP", destination: "Manaus,AM", distanceKm: 3939 },
        { origin: "Rio de Janeiro,RJ", destination: "Manaus,AM", distanceKm: 4376 },
        { origin: "Brasília,DF", destination: "Manaus,AM", distanceKm: 3493 },
        { origin: "São Paulo,SP", destination: "Belém,PA", distanceKm: 2930 },
        { origin: "Rio de Janeiro,RJ", destination: "Belém,PA", distanceKm: 3367 },
        { origin: "Brasília,DF", destination: "Belém,PA", distanceKm: 2120 },
        { origin: "São Paulo,SP", destination: "Goiânia,GO", distanceKm: 926 },
        { origin: "Rio de Janeiro,RJ", destination: "Goiânia,GO", distanceKm: 1333 },
        { origin: "Brasília,DF", destination: "Goiânia,GO", distanceKm: 209 },
        { origin: "São Paulo,SP", destination: "Campo Grande,MS", distanceKm: 1014 },
        { origin: "Rio de Janeiro,RJ", destination: "Campo Grande,MS", distanceKm: 1458 },
        { origin: "Brasília,DF", destination: "Campo Grande,MS", distanceKm: 1133 },
        { origin: "São Paulo,SP", destination: "João Pessoa,PB", distanceKm: 2870 },
        { origin: "Rio de Janeiro,RJ", destination: "João Pessoa,PB", distanceKm: 2557 },
        { origin: "Brasília,DF", destination: "João Pessoa,PB", distanceKm: 2422 },
        { origin: "São Paulo,SP", destination: "Natal,RN", distanceKm: 3087 },
        { origin: "Rio de Janeiro,RJ", destination: "Natal,RN", distanceKm: 2774 },
        { origin: "Brasília,DF", destination: "Natal,RN", distanceKm: 2639 },
        // Major regional routes
        { origin: "São Paulo,SP", destination: "Campinas,SP", distanceKm: 95 },
        { origin: "Rio de Janeiro,RJ", destination: "Niterói,RJ", distanceKm: 13 },
        { origin: "Belo Horizonte,MG", destination: "Ouro Preto,MG", distanceKm: 100 },
        { origin: "Porto Alegre,RS", destination: "Caxias do Sul,RS", distanceKm: 180 },
        { origin: "Curitiba,PR", destination: "Joinville,SC", distanceKm: 180 },
        { origin: "Salvador,BA", destination: "Feira de Santana,BA", distanceKm: 110 },
        { origin: "Recife,PE", destination: "Olinda,PE", distanceKm: 7 },
        { origin: "Fortaleza,CE", destination: "Caucaia,CE", distanceKm: 20 },
        { origin: "Manaus,AM", destination: "Itacoatiara,AM", distanceKm: 270 },
        { origin: "Belém,PA", destination: "Ananindeua,PA", distanceKm: 15 },
        { origin: "Goiânia,GO", destination: "Aparecida de Goiânia,GO", distanceKm: 25 },
        { origin: "Campo Grande,MS", destination: "Dourados,MS", distanceKm: 240 },
        { origin: "João Pessoa,PB", destination: "Campina Grande,PB", distanceKm: 120 },
        { origin: "Natal,RN", destination: "Mossoró,RN", distanceKm: 280 }
    ],

    // Method to get all unique cities from routes, sorted alphabetically
    getAllCities: function() {
        var cities = [];
        this.routes.forEach(function(route) {
            if (cities.indexOf(route.origin) === -1) {
                cities.push(route.origin);
            }
            if (cities.indexOf(route.destination) === -1) {
                cities.push(route.destination);
            }
        });
        return cities.sort();
    },

    // Method to find distance between two cities, searching in both directions
    findDistance: function(origin, destination) {
        var normalize = function(str) {
            return str.trim().toLowerCase().replace(/,\s*/g, ',');
        };
        var normalizedOrigin = normalize(origin);
        var normalizedDestination = normalize(destination);
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            if ((normalize(route.origin) === normalizedOrigin && normalize(route.destination) === normalizedDestination) ||
                (normalize(route.origin) === normalizedDestination && normalize(route.destination) === normalizedOrigin)) {
                return route.distanceKm;
            }
        }
        return null;
    }
};