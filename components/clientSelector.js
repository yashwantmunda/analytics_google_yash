import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import {  warningToast } from './utils/notification';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientSelector({getReportData,queryClientData}){
    const [clientList, setClientList] = useState([]);
    const durationList = [
      { value: '30daysAgo', label: '1 Month' },
      { value: '60daysAgo', label: '2 Months' },
      { value: '90daysAgo', label: '3 Months' },
      { value: '120daysAgo', label: '4 Months' },
      { value: '150daysAgo', label: '5 Months' },
      { value: '180daysAgo', label: '6 Months' }
    ];

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

    const typeList = [
        { value: 'ecommerce', label: 'Ecommerce' },
        { value: 'non-ecommerce', label: 'Non-ecommerce'}
      ];

    const [client, setClient] = useState('');
    const [clientName, setClientName] = useState('');
    const [duration, setDuration] = useState('');
    const [clientType, setClientType] = useState('');

    let getReport=(e) =>{
        e.preventDefault();
    }



    const handleClientSelection = (selectedClient) => {
        setClient(selectedClient.value);
        setClientName(selectedClient.label);
    }

    const handleTimeSelection = (selectedDuration) => {
        setDuration(selectedDuration.value);
    }

    const handleTypeSelection = (selectedType) => {
        setClientType(selectedType.value);
    }

    const handleFetchReport = (e) => {
        e.preventDefault();
        if(client === undefined || client.trim() === '' || duration.trim() === '' || clientType.trim() === ''){
            // warningToast('Please select all the fields 🎃');
            document.getElementById('all-fields').textContent='Please select all the fields';
            document.getElementById('all-fields').style.display='block';
            return;
        }
        document.getElementById('all-fields').textContent='';
        document.getElementById('all-fields').style.display='none';
        getReportData(clientName,duration,client,clientType);
    }

   

    useEffect(() => {
       
        
        let authToken = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',"x_auth_token" :authToken },
          };
      
          fetch('/api/getClient', requestOptions)
          .then(response => response.json())
          .then(data => {
   
            if(data.status === "Error"){
                localStorage.clear();
                router.push('/login');
                return;
              }
            let updatedList = data.message.map(item => {
                return { value: item.clientId, label: item.clientName }
            })
            setClientList(updatedList);
            setClient(queryClientData.clientId);
            setClientName(queryClientData.clientName);
          
          })
          .catch(error => {
            console.log(error);
          })
    },[queryClientData]);


    return(
        <>
            <div className="row">
                <form className="d-flex p-0">    
                    <div className="col-xl-3 col-md-6 mb-5">
                        <div className="w-100 position-relative">
                            <Select 
                                name="client" 
                                components={makeAnimated} 
                                id="custom-select" 
                                instanceId="custom-select" 
                                options={clientList}
                                placeholder="Choose Client"
                                onChange={handleClientSelection}
                                value={clientList.filter(item => item.value === queryClientData.clientId)}
                                styles={customStyles}
                                 />
                            <span className="field-error invalid-feedback" id="all-fields"></span>    
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-5">
                        <div className="w-100">
                            <Select 
                                name="duration" 
                                components={makeAnimated} 
                                id="custom-select-time" 
                                instanceId="custom-select-time" 
                                options={durationList}
                                placeholder="Select Duration"
                                onChange={handleTimeSelection}
                                styles={customStyles}
                                 />
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-5">
                        <div className="w-100">
                            <Select 
                                name="duration" 
                                components={makeAnimated} 
                                id="custom-select-type" 
                                instanceId="custom-select-type" 
                                options={typeList}
                                placeholder="Select Industry Type"
                                onChange={handleTypeSelection}
                                styles={customStyles}
                                 />
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <button className="btn btn-md btn-primary" onClick={handleFetchReport}>Get Report</button>
                    </div>
                </form>
            </div>
        </>
    );
};