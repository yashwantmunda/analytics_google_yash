import { useEffect, useState } from 'react';
import { successToast, warningToast, errorToast } from './utils/notification';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';
import Select from "react-select";
import makeAnimated from "react-select/animated";

export default function AddCompany() {

  const typeList = [
    { value: 'ecommerce', label: 'Ecommerce' },
    { value: 'non-ecommerce', label: 'Non-Ecommerce' },
  ];

const [company, setCompany] = useState([]);

const router = useRouter();
const [clientType, setClientType] = useState('');

const customStyles = {
  placeholder: (styles) => {
      return {
          ...styles,
          color: "#000000",
      }
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      //console.log({ data, isDisabled, isFocused, isSelected });
      return {
          ...styles,
          backgroundColor: isFocused ? "#eaecf4" : null,
          color: "#000000"
      };
  }
};

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
        clientId: clientId,
        clientType:clientType
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x_auth_token': authToken },
      body: JSON.stringify({ clientName: clientName, clientId: clientId,clientType:clientType})
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
      //warningToast('Please enter all the fields 🎃');
      document.getElementById('all-fields').textContent='Please fill all the fields';
      document.getElementById('all-fields').style.display='block';
      return;
   }
   document.getElementById('all-fields').textContent='';
  document.getElementById('all-fields').style.display='none';
   addClients(company, clientId);

  }

  const handleClientdelete = (id, clientName) => {
    let authToken = localStorage.getItem('token');
    let newClient = {
        clientName: clientName,
        clientId: id
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x_auth_token': authToken },
      body: JSON.stringify({ clientName: clientName, clientId: id})
    };

    fetch('/api/deleteClient', requestOptions)
    .then(response => response.json())
    .then(data => {
      if(data.status === "Error"){
        localStorage.clear();
        router.push('/login');
        return;
      }
      let updatedCompany =  company.filter(item =>  item._id !== id);
      setCompany([...updatedCompany]);
      successToast('Client removed successfully');
    })
    .catch(error => {
    
      errorToast('Error deleting client 😱');
    
    })
  }

  const handleTypeSelection = (selectedType) => {
      setClientType(selectedType.value);
  }


  const handleClientRoute = (label, id, type) => {
    router.push(
      {
        pathname: '/',
        query: {
          clientLabel: label,
          clientId: id,
          clientType:type
        }
      }
    );
  }

  return (
    <>
    {/*<ToastContainer />*/}
      <h1 className="h3 mb-3 text-gray-800">Add New Client</h1>
      <div className="d-flex shadow mb-4 py-4 pl-2 pr-2">
        <form className="d-flex w-100">
          <div className="col-xl-3 col-md-3 position-relative">
              <input type="text" name="company" className="form-control" id="companyname" placeholder="Client Name" />
              <span className="field-error invalid-feedback" id="all-fields"></span>
          </div>
          <div className="col-xl-3 col-md-3">
              <input type="text" name="clientId" className="form-control" id="viewid" placeholder="Google Analytics View Id" />
          </div>
          <div className="col-xl-3 col-md-3">
          <div className="w-100">
              <Select 
                  name="clientType" 
                  components={makeAnimated} 
                  id="industry-type" 
                  instanceId="industry-type" 
                  options={typeList}
                  placeholder="Industry type"
                  onChange={handleTypeSelection}
                  styles={customStyles}
                    />
          </div>
          </div>
          <div className="col-xl-3 col-md-3">
              <button type="submit" className="btn btn-primary" onClick={handleCompanyAddition}>Save</button>
          </div>
      
        </form>
      </div>

      <div className="mb-3 text-center or-divider"><span>Or</span></div>

      <h1 className="h3 mb-3 text-gray-800">Select Client</h1>
      <div className="d-flex shadow mb-4 p-4">
        <ErrorBoundary FallbackComponent={<>Error loading added client</>}>
        {
          company && company.length > 0 &&
          <div className="tableInnerWrapper table-responsive">
            <table className="table table-bordered table-sm bg-white mb-0" >
              <thead>
                <tr>
                  <th scope="col">Client Name</th>
                  <th scope="col">Client Id</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  company.map((client, index) => (
                    <tr key={index}>
                      <td>{client.clientName}</td>
                      <td>{client.clientId}</td>
                      <td>
                        <button title="View Client Report" type="button" className="btn btn-info btn-sm mr-2" onClick={() => handleClientRoute(client.clientName,client.clientId,client.clientType)}><i className="fas faw fa-eye"></i></button>
                        <button title="Delete Client" type="button" className="btn btn-warning btn-sm" onClick={() => handleClientdelete(client._id,client.clientName)} ><i className="fas faw fa-trash"></i></button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        }
        </ErrorBoundary>
      </div>
    </>
  );
};