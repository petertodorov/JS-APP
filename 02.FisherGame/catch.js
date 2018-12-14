 function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_H1MZnFhVX/';
    const userName = 'peter';
    const password = 'p';
    const base64Auth = btoa(userName + ':' + password);
    const authHeader = {
        'Authorization': 'Basic ' + base64Auth,
        'Content-Type': 'application/json'
    };

    $('.load').click(getData);
    $('.add').click(createData);

    let allCatches = $('#catches');
    allCatches.empty();


    function request(method, endPoint, data) {
        return $.ajax({
            method: method,
            url: baseUrl + endPoint,
            headers: authHeader,
            data: JSON.stringify(data)
        })
    }

    function getData() {
        console.log('loaded');
        request('Get', 'biggestCatches')
            .then(appendData)
            .catch(handleError);
    }

    function createData() {
        let angler = $('#addForm .angler').val();
        let weight = $('#addForm .weight').val();
        let species = $('#addForm .species').val();
        let location = $('#addForm .location').val();
        let bait = $('#addForm .bait').val();
        let captureTime = $('#addForm .captureTime').val();
        let newEntry = {
            'angler': angler,
            'weight': parseInt(weight),
            'species': species,
            'location': location,
            'bait': bait,
            'captureTime': parseInt(captureTime)
        }
        request('Post', 'biggestCatches', newEntry).then((result)=>{clearInput(),getData()}).catch(handleError)

        function clearInput() {

            $('#addForm .angler').val('');
            $('#addForm .weight').val('');
            $('#addForm .species').val('');
            $('#addForm .location').val('');
            $('#addForm .bait').val('');
            $('#addForm .captureTime').val('');
        }
    }


    function appendData(allInputs) {
        let allCatches = $('#catches');
        allCatches.empty();

        for (const input of allInputs) {
            let id = input._id;
            let angler = input.angler;
            let weight = parseInt(input.weight);
            let species = input.species;
            let location = input.location;
            let bait = input.bait;
            let captureTime = parseInt(input.captureTime);
            let newEntry = $('<div class="catch"></div>');
            newEntry.attr('data-id', id);
            newEntry
                .append($(' <label>Angler</label>'))
                .append($('<input type="text" class="angler"/>').val(angler))
                .append($(' <label>Weight</label>'))
                .append($(' <input type="number" class="weight"/>').val(weight))
                .append($(' <label>Species</label>'))
                .append($(' <input type="text" class="species"/>').val(species))
                .append($(' <label>Location</label>'))
                .append($(' <input type="text" class="location"/>').val(location))
                .append($(' <label>Bait</label>'))
                .append($(' <input type="text" class="bait"/>').val(bait))
                .append($(' <label>Capture Time</label>'))
                .append($(' <input type="number" class="captureTime"/>').val(captureTime))
                .append($('<button class="update">Update</button>').click(updateCatch))
                .append($('<button class="delete">Delete</button>').click(deleteCatch));
            newEntry.appendTo(allCatches);
        }
    }

    function updateCatch() {
        let catchedEl = $(this).parent();
        let id = catchedEl.attr('data-id');
        let updatedEntry = {
            'angler': catchedEl.find('.angler').val(),
            'weight': catchedEl.find('.weight').val(),
            'species': catchedEl.find('.species').val(),
            'location': catchedEl.find('.location').val(),
            'bait': catchedEl.find('.bait').val(),
            'captureTime': catchedEl.find('.captureTime').val()
        }
        request('Put', `biggestCatches/${id}`, updatedEntry)
            .then(getData)
            .catch(handleError)
    }

    function deleteCatch() {
        let catchedEl = $(this).parent();
        let id = catchedEl.attr('data-id');
        request('Delete', `biggestCatches/${id}`)
            .then((result) => {
                console.log(`Deleted element with id: ${id}`);
                getData();
                //$(catchedEl).remove()
            })
            .catch(handleError)
    }

    function handleError(error) {
        alert(`Error: ${error.statusText}`)
    }

}