export const getClients = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('/api/getClient', requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log('clientData',data);
      setCompany(data.message);
    })
    .catch(error => {
      console.log(error);
    })
  }
 