import Select from "react-select";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import {  warningToast } from './utils/notification';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function ClientSelector({getReportData}){
    
    const [clientList, setClientList] = useState([]);
    const durationList = [
      { value: '30daysAgo', label: '1 Month' },
      { value: '60daysAgo', label: '2 Months' },
      { value: '90daysAgo', label: '3 Months' },
      { value: '120daysAgo', label: '4 Months' },
      { value: '150daysAgo', label: '5 Months' },
      { value: '180daysAgo', label: '6 Months' }
    ];

    var clientData = {};
    const router = useRouter();
    const queryData = router.query;

    if(queryData.clientId){
        clientData = {
            value: queryData.clientId,
            label: queryData.clientLabel,
            type: queryData.clientType == 'ecommerce' ? 'Ecommerce' : 'Non-Ecommerce'
        }
    }

    

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
    const [durationLabel, setDurationLabel] = useState('');
    const [clientType, setClientType] = useState('');
    const [clientObject, setClientObject] = useState({});
    

    // let getReport=(e) =>{
    //     e.preventDefault();
    // }



    const handleClientSelection = (selectedClient) => {
        console.log('selectedClient', selectedClient);
        setClient(selectedClient.value);
        setClientName(selectedClient.label);
        if(selectedClient.type == 'ecommerce'){
            setClientType("Ecommerce");
        }
        else{
            setClientType("Non-Ecommerce");
        }
        
    }

    const handleTimeSelection = (selectedDuration) => {
        setDuration(selectedDuration.value);
        setDurationLabel(selectedDuration.label);
    }

    const handleTypeSelection = (selectedType) => {
        setClientType(selectedType.value);
    }

    const handleFetchReport = (e) => {
        e.preventDefault();
        console.log('get',client,duration,clientType);
        if(client === undefined || client.trim() === '' || duration.trim() === '' || clientType.trim() === ''){
            // warningToast('Please select all the fields 🎃');
            document.getElementById('all-fields').textContent='Please select all the fields';
            document.getElementById('all-fields').style.display='block';
            return;
        }
        document.getElementById('all-fields').textContent='';
        document.getElementById('all-fields').style.display='none';
        getReportData(clientName,duration,client,clientType,durationLabel);
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
                return { value: item.clientId, label: item.clientName, type: item.clientType }
            });
            
            setClientList(updatedList);
            setClientObject(clientData);
            
            if(clientData.label){
                setClient(clientData.value);
                setClientName(clientData.label);
                setDuration("30daysAgo");
                setDurationLabel("1 Month");
                setClientType(clientData.type);
            }
            
            //setClientType(clientData.type);
            // setClientType(queryClientData.clientType);
            // setClient(queryClientData.clientId);
            // setClientName(queryClientData.clientName);
            // setClientType(queryClientData.clientType);
           
          })
          .catch(error => {
            console.log(error);
          })
    },[]);


    return(
        
            clientList.length > 0 && 
        
        <>
        
            <div className="row">
                <form className="d-flex p-0">    
                    <div className="col-xl-3 col-md-6 mb-5">
                        <div className="w-100 position-relative">
                            {
                                clientData.label ?
                               
                                <Select 
                                name="client" 
                                components={makeAnimated} 
                                id="custom-select" 
                                instanceId="custom-select" 
                                options={clientList}
                                placeholder="Choose Client"
                                onChange={handleClientSelection}
                                styles={customStyles}
                                defaultValue={clientData.label ? clientData : 'Choose Client'}
                                />
                               
                                :

                                <Select 
                                name="client" 
                                components={makeAnimated} 
                                id="custom-select" 
                                instanceId="custom-select" 
                                options={clientList}
                                placeholder="Choose Client"
                                onChange={handleClientSelection}
                                styles={customStyles}
                                 />

                            }
                            
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
                                defaultValue={clientData.value ? { value: '30daysAgo', label: '1 Month' } : {value : '', label: "Select Duration"}}
                                 />
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-5">
                        <input type="text" name="clientType" disabled  value={clientType ? clientType : clientData.type} placeholder="Industry type" className="form-control" id="clientType" />
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <button className="btn btn-md btn-primary" onClick={handleFetchReport}>Get Report</button>
                    </div>
                </form>
            </div>
        </>
    
    );
};