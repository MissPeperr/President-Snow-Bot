const fetch = require('node-fetch');
const url = 'http://localhost:5000'

 // TODO: make sure roles are gotten by a serverId
module.exports.get = function (resource) {
    return fetch(`${url}/${resource}`).then(resp => resp.json())
}

module.exports.getObj = function (resource, object) {

    return fetch(`${url}/${resource}/${object.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
module.exports.getObjByGUID = function (resource, object) {

    return fetch(`${url}/${resource}?GUID=${object.id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(resp => resp.json() //...because we're really querying for the list of all matching, BUT we just get the one...
    )
}

module.exports.getObjByName = function (resource, name) {

    return fetch(`${url}/${resource}?name=${name}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(resp => resp.json())
}

module.exports.post = function (resource, resourceObj) {
    return fetch(`${url}/${resource}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceObj)
    })
}

module.exports.put = function(resource, resourceObj) {
    return fetch(`${url}/${resource}/${resourceObj.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceObj)
    })
}

module.exports.delete = function (resource, resourceObj) {
    this.getObjByGUID(resource, resourceObj).then((respObj) => {
        fetch(`${url}/${resource}/${respObj[0].id}`, {  
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
    })
}
