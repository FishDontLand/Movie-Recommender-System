import config from './config.json'

// export const login = (credential) => {
//     const loginUrl = `/login?username=${credential.username}&password=${credential.password}`;
//
//     return fetch(loginUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         credentials: "include",
//     }).then((response) => {
//         if (response.status < 200 || response.status >= 300) {
//             throw Error("Fail to log in");
//         }
//     });
// };
//
// export const signup = (data) => {
//     const signupUrl = "/signup";
//
//     return fetch(signupUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     }).then((response) => {
//         if (response.status < 200 || response.status >= 300) {
//             throw Error("Fail to sign up");
//         }
//     });
// };


const getKeywordSearch = async (keyword) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/keyword?keyword=${keyword}`, {
        method: 'GET',
    })
    return res.json()
}

const getTypeSearch = async (type) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/type?type=${type}`, {
        method: 'GET',
    })
    return res.json()
}

const getSimilarTypeSearch = async (keyword) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/similar_type?type=${keyword}`, {
        method: 'GET',
    })
    return res.json()
}

const getIdSearch = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/id?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getKeywordSearch,
    getTypeSearch,
    getSimilarTypeSearch,
    getIdSearch
}