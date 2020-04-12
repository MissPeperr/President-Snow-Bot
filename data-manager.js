const fetch = require('node-fetch');
const url = 'http://localhost:5000/'

const DataManager = {
    get: (resource) => {
        return fetch(`${url}/${resource}`).then(resp => resp.json())
    },
    post: (resource, resourceObj) => {
        return fetch(`${url}/${resource}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resourceObj)
        })
    }
}