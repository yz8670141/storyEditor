console.log("axios", axios)
export async function getPageFromAPI(id) {
  axios({
      method: 'get',
      url: 'http://localhost:8080/api/items',
    })
      .then(function (response) {
        console.log("response",response)
      });
}
export async function savePageToAP(pageEntry) {
 console.log("pageEntry",pageEntry)
 axios.post('http://localhost:8080/api/items', pageEntry)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


