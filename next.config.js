module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/fetchReport',
          // destination: 'http://localhost:4000/fetchReport' 
          destination: 'https://hackathon-houndstooth.herokuapp.com/fetchReport'
        },
        {
            source: '/api/addClient',
            // destination: 'http://localhost:4000/addClient' 
            destination: 'https://hackathon-houndstooth.herokuapp.com/addClient'// Proxy to Backend
        },
        {
          source: '/api/deleteClient',
          // destination: 'http://localhost:4000/deleteClient' 
          destination: 'https://hackathon-houndstooth.herokuapp.com/deleteClient'// Proxy to Backend
      },
        {
            source: '/api/getClient',
            // destination: 'http://localhost:4000/getClient'
            destination: 'https://hackathon-houndstooth.herokuapp.com/getClient' // Proxy to Backend
        },
        {
            source: '/api/login',
            // destination: 'http://localhost:4000/login'
            destination: 'https://hackathon-houndstooth.herokuapp.com/login' // Proxy to Backend
        }
      ]
    }
  }