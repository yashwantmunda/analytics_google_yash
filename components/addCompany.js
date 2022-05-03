import { useEffect, useState } from 'react';
import { successToast, warningToast, errorToast } from './utils/notification';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';

export default function AddCompany() {

const [company, setCompany] = useState([]);

const router = useRouter();

  useEffect(() => {
    let authToken = localStorage.getItem('token');
  
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x_auth_token': authToken  },
      };
  
      fetch('/api/getClient', requestOptions)
      .then(response => response.json())
      .then(data => {
        // console.log('clientData',data);
        
        if(data.status === "Error"){
          localStorage.clear();
          router.push('/login');
          return;
        }
        setCompany(data.message);
      })
      .catch(error => {
        console.log(error.response);
  
      })
    
  },[])


  const addClients = (clientName, clientId) => {
    let authToken = localStorage.getItem('token');
    let newClient = {
        clientName: clientName,
        clientId: clientId
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x_auth_token': authToken },
      body: JSON.stringify({ clientName: clientName, clientId: clientId})
    };

    fetch('/api/addClient', requestOptions)
    .then(response => response.json())
    .then(data => {
      if(data.status === "Error"){
        localStorage.clear();
        router.push('/login');
        return;
      }
      setCompany([newClient,...company]);
      successToast('Client added successfully 🔥');
    })
    .catch(error => {
    
      errorToast('Error adding client 😱');
    
    })
  }

  const handleCompanyAddition = (e) => {
    e.preventDefault();
   let company = document.getElementById('companyname').value;
   let clientId = document.getElementById('viewid').value;
   if(company.trim() === '' || clientId.trim() === ''){
      warningToast('Please enter all the fields 🎃');
      return;
   }
   addClients(company, clientId);

  }


  const handleClientRoute = (label, id) => {
    router.push(
      {
        pathname: '/',
        query: {
          clientLabel: label,
          clientId: id
        }
      }
    );
  }

  return (
    <>
    <ToastContainer />
      <h1 className="h3 mb-4 text-gray-800">Add Client</h1>
      <div className="row">
        <div className="col-md-6 col-xs-6">
          <form>
            <div className="mb-3">
              <label htmlFor="companyname" className="form-label">Client Name</label>
              <input type="text" name="company" className="form-control" id="companyname" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
              <label htmlFor="viewid" className="form-label">Google Analytics View Id</label>
              <input type="text" name="clientId" className="form-control" id="viewid" />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleCompanyAddition} >Save</button>
          </form>
        </div>

        <div className='col-md-1 col-xs-1'></div>
        <ErrorBoundary FallbackComponent={<>Error loading added client</>}>
        {
          company && company.length > 0 &&
          <div className='col-md-4 col-xs-4'>
            <h3>Added Clients</h3>
            {
              company.map((client, index) => (
                <div className='row mb-2' key={index} onClick={() => handleClientRoute(client.clientName,client.clientId)}>
                    <div className="card border-left-primary shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-md font-weight-bold text-primary text-uppercase mb-1">{client.clientName}</div>
                            <div className="text-md font-weight-bold text-primary text-uppercase mb-1">Client ID - {client.clientId}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              ))
               
            }
           
          </div>
        }
        </ErrorBoundary>
        
        

      </div>
  
    </>
  );
};