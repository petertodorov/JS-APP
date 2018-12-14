function attachEvents() {
    const baseURL = 'https://judgetests.firebaseio.com/';
    const degreeSym = String.fromCharCode(176);
    const weatherSym = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;'
    }

    $('#submit').click(getForecast);

    function getForecast() {
        let location = $('#location').val();


        request('locations.json')
            .then(findLocation)
            .catch(handleError);

        function request(endPoint) {
            return $.ajax({
                url: baseURL + endPoint,
                method: 'Get'
            })
        }

        function findLocation(allLocations) {
            let code = allLocations.filter(x => x.name === location).map(x => x.code)[0];

            let getCurrentConditionsP = request(`forecast/today/${code}.json`);
            let getThreeDayConditionsP = request(`forecast/upcoming/${code}.json`);

            Promise.all([getCurrentConditionsP, getThreeDayConditionsP])
                .then(displayConditions)
                .catch(handleError);

            if (!code) {
                handleError();
            }

            function displayConditions([currentCondition, upcomingCondition]) {
                $('#forecast').css('display', 'block');

                loadCurrent();
                loadUpcoming();


                function loadCurrent() {
                    let conditionStat = currentCondition.forecast.condition;
                    let high = currentCondition.forecast.high;
                    let low = currentCondition.forecast.low;
                    let name = currentCondition.name;

                    let current = $('#current');
                    current.empty();
                    current
                        .append($('<div class="label">Current conditions</div>'))
                        .append($(`<span class="condition symbol">${weatherSym[conditionStat]}</span>`))
                        .append($('<span class="condition">')
                            .append($(`<span class="forecast-data">${name}</span>`))
                            .append($(`<span class="forecast-data">${low}${degreeSym}/${high}${degreeSym}</span>`))
                            .append($(`<span class="forecast-data">${conditionStat}</span>`)))
                }

                function loadUpcoming() {
                    let upcoming = $('#upcoming');
                    upcoming.empty();
                    upcoming.append($('<div class="label">Three-day forecast</div>'));
                    for (const details of upcomingCondition['forecast']) {
                        let conditionStat = details.condition;
                        let high = details.high;
                        let low = details.low;
                        let name = details.name;
                        upcoming.append($('<span class="upcoming">')
                            .append($('<span>')
                                .addClass('symbol')
                                .html(weatherSym[conditionStat]))
                            .append($('<span>').addClass('forecast-data')
                                .text(`${low}${degreeSym}/${high}${degreeSym}`))
                            .append($('<span class="forecast-data">').text(conditionStat)
                            ))

                    }

                }
            }
        }

        function handleError() {
            $('#forecast').css('display', 'block').text('Error')
        }
    }
}

