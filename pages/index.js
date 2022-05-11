import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Report from "../components/reports";
import ClientSelector from "../components/clientSelector";

import { useState, useRef, useEffect } from "react";
import router, { useRouter } from "next/router";
import Image from "next/image";
import { ShimmerTable } from "react-shimmer-effects";



export default function Reports(props) {
  const routerNew = useRouter();
  const queryData = routerNew.query;

  const [loggedInUser, setLoggedInUser] = useState('');
  const [tokenCheck, setTokenCheck] = useState(false);
  const progressRef = useRef(null);
  
  useEffect(() => {
    
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    if(!token){
      router.push('/login');
    }
    else{

      setTokenCheck(true);
      setLoggedInUser(user);
      if(queryData.clientId && queryData.clientLabel && queryData.clientType){
        
        getReport(queryData.clientLabel,"30daysAgo",queryData.clientId, queryData.clientType === 'ecommerce' ? "Ecommerce" : "Non-ecommerce", "1 Month");
      }
      
      //setSelectedClient(clientData.clientLabel);
    }
  },[router]);

  // Pull report for a client

  let [gaData, setgaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  

  const toastRef = useRef(null);

  const getReport = (client, dateRange, viewId, type,durationLabel,reportAttribute=[]) => {
    let authToken = localStorage.getItem('token');
    // progressRef.current.classList.remove('complete');
    // document.querySelector('.progress-bar').classList.remove('complete');
    // const activeToast = () => toastRef.current = toast.loading("Fetching report...",{autoClose:false});
    // activeToast();
    setLoading(true);
    setErrorState(false);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X_auth_token': authToken },
      body: JSON.stringify({ client, dateRange, viewId, type,reportAttribute})
    };
    fetch('/api/fetchReport', requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.status === "Error"){
          // localStorage.clear();
          // router.push('/login');
          setErrorState(true);
          return;
        }
        progressRef.current.classList.add('complete');
        // document.querySelector('.progress-bar').classList.add('complete');
        // let updatingToast = () => toast.update(toastRef.current,{render :'Preparing report...', type: "info", isLoading: false, closeOnClick: true,progress: undefined,autoClose: false});
        // updatingToast();
  
        let sessionObject = {};
        let userObject = {};

        let stationData = [];
        let userDetailRow = [];
        let total = 0;
        let count = 0;
        
        let sameOsObject = {};
        let sameOsDetail = [];
        let userCounter = 0;

        let visitorsObject = {};
        let visitorsDetail = [];
  

        let updatedData = data?.data?.[0].map((item,i) => {

          if(item.visitors){

            let newVisitor = parseFloat(item.data[0][1]);
            let oldVisitor = parseFloat(item.data[1][1]);

            visitorsObject['industry'] = item.industry;
            visitorsObject['units'] = item.units;
            visitorsObject['header'] = item.header;
            visitorsObject['key'] = item.key;
            visitorsObject['title'] = item.title;
            visitorsObject['subtitle'] = item.subtitle;
            visitorsObject['columnInverted'] = item.columnInverted;
            visitorsObject['data'] = [[item.data[0][0],item.data[0][1],(100*(newVisitor/(newVisitor + oldVisitor )))], [item.data[1][0],item.data[1][1],(100*(oldVisitor/(newVisitor + oldVisitor )))]];
          
      
          }
          
          if(item.sameOs){
            sameOsDetail.push(item.data[0]);
            sameOsObject['industry'] = item.industry;
            sameOsObject['units'] = item.units;
            sameOsObject['header'] = item.header;
            sameOsObject['key'] = item.key;
            sameOsObject['title'] = item.title;
            sameOsObject['subtitle'] = item.subtitle;
            sameOsObject['columnInverted'] = item.columnInverted;
            sameOsObject['data'] = [...sameOsDetail];
          }

          if(item?.userDetails){

            total += parseInt(item.data[0]);
            userDetailRow.push(parseInt(item.data[0]));

            userObject['industry'] = item.industry;
            userObject['units'] = item.units;
            userObject['header'] = item.header;
            userObject['key'] = item.key;
            userObject['title'] = item.title;
            userObject['subtitle'] = item.subtitle;
            userObject['columnInverted'] = item.columnInverted;
            if(userCounter == 2){
              userObject['data'] = [['Users',...userDetailRow]];
            }
            else{
              userObject['data'] = [userDetailRow];
            }
            
            userCounter++;
          }
          if(item.industry){
            
            if(stationData.length == 0){
            stationData = [
              [
              item.columnOne[0],
              item.data[0][0],
              ],
              [
              item.columnOne[1],
              item.data[0][1],
              ],
              [
              item.columnOne[2],
              item.data[0][2],
              ],
              [
              item.columnOne[3],
              item.data[0][3],
              ]
            ];
            }
            else{
            if(count == 2){
              
              stationData = [
              [
                ...stationData[0],
                item.data[0][0],
                item.industry[0],
              ],
              [
                ...stationData[1],
                item.data[0][1],
                item.industry[1],
              ],
              [
                ...stationData[2],
                item.data[0][2],
                item.industry[2],
              ],
              [
                ...stationData[3],
                item.data[0][3],
                item.industry[3],
              ]
              ];
            }
            else{
             
              stationData = [
              [
                ...stationData[0],
                item.data[0][0],
              ],
              [
                ...stationData[1],
                item.data[0][1],
              ],
              [
                ...stationData[2],
                item.data[0][2],
              ],
              [
                ...stationData[3],
                item.data[0][3],
              ]
              ];
            }
            
            }
            
            sessionObject['industry'] = item.industry;
            sessionObject['units'] = item.units;
            sessionObject['header'] = item.header;
            sessionObject['key'] = item.key;
            sessionObject['title'] = item.title;
            sessionObject['subtitle'] = item.subtitle;
            sessionObject['columnInverted'] = item.columnInverted;
            sessionObject['data'] = [...stationData];
            // console.log(i,sessionObject);
            count++;
          }

          
          
          
        });
        // console.log('mainData',data.data[0].slice(2));
        // return;

        //  gaData = [{...sessionObject},...data.data[0].slice(2)];
        
        let filteredData = data.data[0].filter((item,i) => !item.industry);
        filteredData = filteredData.filter((item,i) => !item.userDetails);
        filteredData = filteredData.filter((item,i) => !item.sameOs);
        filteredData = filteredData.filter((item,i) => !item.visitors);
        filteredData = filteredData.map((item,i) => item.linkAdded ? {...item,"data": item['data'].map((el,i) => [...el.slice(0,2),el[2]+el[0],...el.slice(3)])} : item);
        // console.log('f',filteredData,'s',sessionObject);
        // return false;
        // console.log('filteredReort',filteredData); {...userObject}
        //console.log('reportdata',[{...sessionObject},{...userObject},{...sameOsObject},{...visitorsObject},...filteredData]);
        //gaData = [{...sessionObject},{...userObject},{...sameOsObject},{...visitorsObject},...filteredData];
        setLoading(false);
        setErrorState(false);

        // let completingToast = () => toast.update(toastRef.current,{render :'Report is ready 🔥', type: "success", autoClose: 3000, isLoading: false, closeOnClick: true,progress: undefined});
        // completingToast();
        
          setgaData([{...sessionObject},{...userObject},{...sameOsObject},{...visitorsObject},...filteredData]);

        
        setSelectedClient(client);
        setSelectedDuration(durationLabel);
      }).catch(err => {
        progressRef.current.classList.remove('complete');
        //document.querySelector('.progress-bar').classList.remove('complete');
        console.log(err);
        setLoading(false);
        setErrorState(true);
        // let errorReportToast = () =>  toast.update(toastRef.current,{render :'Something went wrong', type: "error", autoClose: 3000,isLoading: false,closeOnClick: true,progress: undefined});
        // errorReportToast();
      });
    
    // setgaData([...reportData]);
  }

  return (
    <>
    {
      tokenCheck && 
      <main>
      {/*<ToastContainer />*/}
      <div id="wrapper">
        <Sidebar/>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content" className="position-relaive">
            <Navbar user={loggedInUser}/>
            { loading && !errorState ?
              <div className="slide-progress-bar">
                <div className="progress-bar" ref={progressRef} id="progress-bar"></div>
              </div> : null
            }

            <div className="container-fluid">
              {/* <button onClick={() => getReport('Gnome','180Days',3435,'Ecommerce')}>Get report</button> */}
              <ClientSelector getReportData={getReport}/>
              { gaData.length == 0 && !loading && !errorState ? 
              <div className="placeholderWrap">
                <Image src="/data_analytics_new.gif" width={600} height={450} layout="fixed" alt="placehlder_img"/>
              </div>
              :null
              }
              { loading && !errorState ?  <ShimmerTable row={10} col={6} /> : errorState ? 
              <div className="text-center">
                
                <h3>
                Oops! Looks like you have entered incorrect view ID for the client {selectedClient || queryData.clientLabel}
                </h3>
                <Image src="/error.png" width="400" height="300" alt="Error" />
              </div>
               : (!loading && !errorState && gaData.length > 0) ? <Report reportData={gaData} client={selectedClient} durationData={selectedDuration} /> : null
              }
            </div>
          </div>
        </div>
      </div>
      
    </main>

    }
    </>
    
  );
};



export async function getStaticProps(){
    return {
      props: {
        isBlue: false
      }
    }
  
}
