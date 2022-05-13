import Select from "react-select";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { useEffect, useState } from "react";
import {  warningToast } from './utils/notification';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import {ShimmerTable} from 'react-shimmer-effects';

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
                color: "#000",
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
        },
        control: (base, state) => ({
            ...base,
            border: "1px solid #9B9B9B"
        })
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
    const [customreport, selectCustomReport] = useState(false);
    const [reportAttribute, setReportAttribute] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    // let getReport=(e) =>{
    //     e.preventDefault();
    // }

    const handleCustomAttribute = (e) => {
        if(e.target.checked){
            setReportAttribute([...reportAttribute, e.target.value]);
        }
        else{
            let filterAttribute = reportAttribute.filter(item => item !== e.target.value);
            setReportAttribute(filterAttribute);
        }

        console.log('attr',reportAttribute);
        
    }

    const hidefilter = () => {
        if(reportAttribute.length === 0){
            selectCustomReport(false); 
        }
        setShowFilters(false);
    }

    const handleCustomReport = (e) => {
        // if(!e.target.checked){
        //     setReportAttribute([]);
        // }
        setShowFilters(true);
    }


    const handleClientSelection = (selectedClient) => {

        setReportAttribute([]);
        
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
      
        if(client === undefined || client.trim() === '' || duration.trim() === '' || clientType.trim() === ''){
            // warningToast('Please select all the fields 🎃');
            if(client === undefined || client.trim() === ''){
                document.getElementById('all-fields').textContent='Please select client';
                document.getElementById('all-fields').style.display='block';
            }
            else{
                document.getElementById('all-fields').textContent='';
                document.getElementById('all-fields').style.display='none';
            }
            if(duration.trim() === ''){
                document.getElementById('duration-error').textContent='Please select duration';
                document.getElementById('duration-error').style.display='block';
            }
            else{
                document.getElementById('duration-error').textContent='';
                document.getElementById('duration-error').style.display='none'; 
            }
            return;
        }
        document.getElementById('all-fields').textContent='';
        document.getElementById('all-fields').style.display='none';
        document.getElementById('duration-error').textContent='';
        document.getElementById('duration-error').style.display='none';
        getReportData(clientName,duration,client,clientType,durationLabel,reportAttribute);
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
        
            clientList.length > 0 ?
        
        <>
        
            <div className="row mb-5">
                <form className="d-flex p-0 align-items-center">    
                    <div className="col-xl-3 col-md-3">
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
                    <div className="col-xl-3 col-md-3">
                        <div className="w-100 position-relative">
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
                            <span className="field-error invalid-feedback" id="duration-error"></span>  
                        </div>
                    </div>

                    <div className="col-xl-2 col-md-2">
                        <input type="text" name="clientType" disabled  value={clientType ? clientType : clientData.type} placeholder="Industry type" className="form-control" id="clientType" />
                    </div>

                    <div className="col-xl-2 col-md-2">
                        <button className="btn btn-md btn-primary" onClick={handleFetchReport}>Get Report</button>
                    </div>

                    {
                        clientType !== '' && 
                        <label htmlFor="customReport" style={{"cursor":"pointer", "display":"flex","height":"min-content","marginBottom":"0"}}>
                            <img src="/filter_icon.svg" alt="filterIcon" style={{"width": "20px","marginRight":"12px"}}/>
                            <input type="checkbox" id="customReport" name="selectCustomReport" onChange={handleCustomReport} hidden/>
                                <span style={{ "color": `${reportAttribute.length > 0 ? '#4e73df' : '#333'}`}}>Custom report</span>
                                
                        </label>
                    }


                </form>
            </div>

            <div className="parentOptionWrapper">
                
                <div className="optionWrapper">
                {
                    clientType === 'Ecommerce' && 
                    <div className="customChoise_wrapper" style={{"display":`${clientType === 'Ecommerce' && showFilters ? 'flex' : 'none'}`}}>
                        <label htmlFor="benchmarks_ecom">
                        <input type="checkbox" id="benchmarks_ecom" value="benchmarks" name="benchmarks" onChange={handleCustomAttribute} />
                        <span className="text">Benchmarks</span>
                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="userdata_ecom">
                        <input type="checkbox" id="userdata_ecom" value="userdata" name="userdata" onChange={handleCustomAttribute}/>
                        <span className="text">Overall User </span>
                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="device_based_ecom">
                        <input type="checkbox" id="device_based_ecom" value="device_based" name="device_based" onChange={handleCustomAttribute}/>
                        <span className="text">Device - Operating system</span>
                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="newvsreturn_ecom">
                        <input type="checkbox" id="newvsreturn_ecom" value="newvsreturn" name="newvsreturn" onChange={handleCustomAttribute}/>
                        <span className="text">
                        New v/s Returning user 
                        </span>    
                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="mobile_site_speed_ecom">
                        <input type="checkbox" id="mobile_site_speed_ecom" value="mobile_site_speed" name="mobile_site_speed" onChange={handleCustomAttribute}/>
                        <span className="text">

                        Pages Summary (site speed) vs Device Category (Mobile)
                        </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="desktop_site_speed_ecom">
                        <input type="checkbox" id="desktop_site_speed_ecom" value="desktop_site_speed" name="desktop_site_speed" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Pages Summary (site speed) vs Device Category (Desktop)
                        </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="page_load_time_slow_ecom">
                        <input type="checkbox" id="page_load_time_slow_ecom" value="page_load_time_slow" name="page_load_time_slow" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Top 10 Highest Page Load Times (slowest pages)
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="acquisition_ecom">
                        <input type="checkbox" id="acquisition_ecom" value="acquisition" name="acquisition" onChange={handleCustomAttribute}/>
                        <span className="text">Acquisition based on source/medium</span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="homepage_traffic_ecom">
                        <input type="checkbox" id="homepage_traffic_ecom" value="homepage_traffic" name="homepage_traffic" onChange={handleCustomAttribute}/>
                        <span className="text">Homepage Traffic Acquisition Report by Source/Medium</span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="top_ten_pages_traffic_mobile_ecom">
                        <input type="checkbox" id="top_ten_pages_traffic_mobile_ecom" value="top_ten_pages_traffic_mobile" name="top_ten_pages_traffic_mobile" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Top 10 Pages by Traffic(Mobile)
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="top_ten_pages_traffic_desktop_ecom">
                        <input type="checkbox" id="top_ten_pages_traffic_desktop_ecom" value="top_ten_pages_traffic_desktop" name="top_ten_pages_traffic_desktop" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Top 10 Pages by Traffic(Desktop)
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="top_ten_pages_by_revenue_ecom">
                        <input type="checkbox" id="top_ten_pages_by_revenue_ecom" value="top_ten_pages_by_revenue" name="top_ten_pages_by_revenue" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Top 10 Pages by Revenue
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="most_visted_pages_ecom">
                        <input type="checkbox" id="most_visted_pages_ecom" value="most_visted_pages" name="most_visted_pages" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Top 10 most visited pages and their page speeds
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="audience_engagment_report_ecom">
                        <input type="checkbox" id="audience_engagment_report_ecom" value="audience_engagment_report" name="audience_engagment_report" onChange={handleCustomAttribute}/>
                        <span className="text">
                            
                        Audience Engagement Report
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <button className="btn btn-md btn-success" style={{"height":"max-content","margin":"4px","fontSsize":"0.95rem"}} onClick={hidefilter}>Save</button>

                    </div>

                    }
                    {
                    clientType === 'Non-Ecommerce' && 
                    <div className="customChoise_wrapper" style={{"display":`${clientType === 'Non-Ecommerce' && showFilters ? 'flex' : 'none'}`}}>
                    <label htmlFor="benchmarks">
                        <input type="checkbox" id="benchmarks" value="benchmarks" name="benchmarks" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Benchmarks
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="userdata">
                        <input type="checkbox" id="userdata" value="userdata" name="userdata" onChange={handleCustomAttribute} />
                        <span className="text">
                        Overall User 
                            
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="device_based">
                        <input type="checkbox" id="device_based" value="device_based" name="device_based" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Device - Operating system
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="newvsreturn">
                        <input type="checkbox" id="newvsreturn" value="newvsreturn" name="newvsreturn" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        New v/s Returning user 
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="mobile_site_speed">
                        <input type="checkbox" id="mobile_site_speed" value="mobile_site_speed" name="mobile_site_speed" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Pages Summary (site speed) vs Device Category (Mobile)
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="desktop_site_speed">
                        <input type="checkbox" id="desktop_site_speed" value="desktop_site_speed" name="desktop_site_speed" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Pages Summary (site speed) vs Device Category (Desktop)
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="page_load_time_slow">
                        <input type="checkbox" id="page_load_time_slow" value="page_load_time_slow" name="page_load_time_slow" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Top 10 Highest Page Load Times (slowest pages)
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="acquisition">
                        <input type="checkbox" id="acquisition" value="acquisition" name="acquisition" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Acquisition based on source/medium
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="homepage_traffic">
                        <input type="checkbox" id="homepage_traffic" value="homepage_traffic" name="homepage_traffic" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Homepage Traffic Acquisition Report by Source/Medium
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="top_ten_pages_traffic_mobile">
                        <input type="checkbox" id="top_ten_pages_traffic_mobile" value="top_ten_pages_traffic_mobile" name="top_ten_pages_traffic_mobile" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Top 10 Pages by Traffic(Mobile)
                            </span>

                        <span className="overlay"></span>
                    </label>
                    <label htmlFor="top_ten_pages_traffic_desktop">
                        <input type="checkbox" id="top_ten_pages_traffic_desktop" value="top_ten_pages_traffic_desktop" name="top_ten_pages_traffic_desktop" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Top 10 Pages by Traffic(Desktop)
                            </span>

                        <span className="overlay"></span>
                    </label>

                    

                    <label htmlFor="most_visted_pages">
                        <input type="checkbox" id="most_visted_pages" value="most_visted_pages" name="most_visted_pages" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Top 10 most visited pages and their page speeds
                            </span>

                        <span className="overlay"></span>
                    </label>

                    <label htmlFor="audience_engagment_report">
                        <input type="checkbox" id="audience_engagment_report" value="audience_engagment_report" name="audience_engagment_report" onChange={handleCustomAttribute} />
                        <span className="text">
                            
                        Audience Engagement Report
                            </span>

                        <span className="overlay"></span>
                    </label>
                        <label htmlFor="user_traffic_geographically">
                            <input type="checkbox" id="user_traffic_geographically" value="user_traffic_geographically" name="user_traffic_geographically" onChange={handleCustomAttribute} />
                            <span className="text">
                            
                            Geographic User Traffic
                            </span>

                            <span className="overlay"></span>
                        </label>
                        <button className="btn btn-md btn-success" style={{"height":"max-content","margin":"4px","fontSsize":"0.95rem"}} onClick={hidefilter}>Save</button>
                    </div>
                    
                }

                
               </div>     
            </div>
        </>
        :

        <ShimmerTable row={1} col={4} />
    
    );
};