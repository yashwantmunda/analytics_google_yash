const fetchReport = (client, dateRange, viewId, type) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client, dateRange, viewId, type })
    };
    fetch('/api/fetchReport', requestOptions)
        .then(response => response.json())
        .then(data => {
        
            let sessionObject = {};
            let userObject = {};
            // console.log('d',data.data);
            let stationData = [];
            let userDetailRow = [];
            let total = 0;
            let count = 0;
            
            let sameOsObject = {};
            let sameOsDetail = [];
            let userCounter = 0;

            let visitorsObject = {};
            let visitorsDetail = [];


            let updatedData = data.data[0].map((item,i) => {

                if(item.visitors){
                    console.log(item.data);
                    let newVisitor = parseFloat(item.data[0][1]);
                    let oldVisitor = parseFloat(item.data[1][1]);
                    // visitorsDetail.push([...item.data]);
                    visitorsObject['industry'] = item.industry;
                    visitorsObject['header'] = item.header;
                    visitorsObject['key'] = item.key;
                    visitorsObject['title'] = item.title;
                    visitorsObject['subtitle'] = item.subtitle;
                    visitorsObject['columnInverted'] = item.columnInverted;
                    visitorsObject['data'] = [[item.data[0][0],item.data[0][1],(100*(newVisitor/(newVisitor + oldVisitor )))], [item.data[1][0],item.data[1][1],(100*(oldVisitor/(newVisitor + oldVisitor )))]];
                
                
                    //totalVisitorsCount++;
                }
                
                if(item.sameOs){
                    sameOsDetail.push(item.data[0]);
                    sameOsObject['industry'] = item.industry;
                     
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
                        // console.log('n',stationData);
                        // return;
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
                        // stationData;
                        // return;
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
            console.log('i',sessionObject);
            //  gaData = [{...sessionObject},...data.data[0].slice(2)];
            
            let filteredData = data.data[0].filter((item,i) => !item.industry);
            filteredData = filteredData.filter((item,i) => !item.userDetails);
            filteredData = filteredData.filter((item,i) => !item.sameOs);
            filteredData = filteredData.filter((item,i) => !item.visitors);
            filteredData = filteredData.map((item,i) => item.linkAdded ? {...item,"data": item['data'].map((el,i) => [...el.slice(0,2),el[2]+el[0],...el.slice(3)])} : item);
            // console.log('f',filteredData,'s',sessionObject);
            // return false;
            // console.log('filteredReort',filteredData); {...userObject}
            

            setgaData([{...sessionObject},{...userObject},{...sameOsObject},{...visitorsObject},...filteredData]);
        });
}

export default fetchReport;