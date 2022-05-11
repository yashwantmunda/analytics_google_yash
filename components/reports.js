import { useEffect } from "react";

export default function Reports({reportData,client,durationData}){

	// console.log('gaData',reportData);
	//if (typeof window !== "undefined") {
		//tableToCSV();
		function tableToCSV(client) {
			//e.preventDefault();
		    var csv_data = [];
		 
		    // Get each table data
		    //var table = document.getElementsByTagName("table");
		    //for (var x = 0; x < table.length; x++) {
		    	//Get each table row data
		    	var rows = document.getElementsByTagName("tr");
		    	for (var i = 0; i < rows.length; i++) {
		 
			        // Get each column data
			        var cols = rows[i].querySelectorAll('td,th,a');
			 
			        // Stores each csv row data
			        var csvrow = [];
			        for (var j = 0; j < cols.length; j++) {
			            // Get the text data of each cell of
			            // a row and push it to csvrow
			            csvrow.push(cols[j].innerHTML);
			            //console.log(csvrow);
			        }
			        // Combine each column value with comma
			        csv_data.push(csvrow.join(","));
			    }
		    //}
		    // combine each row data with new line character
		    csv_data = csv_data.join('\n');

		    // Call this function to download csv file 
            downloadCSVFile(csv_data);
		}

		function downloadCSVFile(csv_data) {
		    // Create CSV file object and feed our csv_data into it
		    var CSVFile = new Blob([csv_data], { type: "text/csv" });
		 
		    // Create to temporary link to initiate download process
		    var temp_link = document.createElement('a');
		 
		    // Download csv file
		    temp_link.download = `analytics_${client}.csv`;
		    var url = window.URL.createObjectURL(CSVFile);
		    temp_link.href = url;
		 
		    // This link should not be displayed
		    temp_link.style.display = "none";
		    document.body.appendChild(temp_link);
		 
		    // Automatically click the link to trigger download
		    temp_link.click();
		    document.body.removeChild(temp_link);
		}
	//}

		// let gaData = [];
	useEffect(()=>{
		console.log(client);
	}, [client])


	return(
		
		<>
			<div className="d-sm-flex align-items-center justify-content-between mb-4">
              	<h1 className="h3 mb-0 text-gray-800">Audit report of {client} for previous {durationData}</h1>
              	<div>
              		<button className="btn btn-md btn-warning m-1" onClick={() => tableToCSV(client)}>Export as CSV
              		</button>
              	</div>
            </div>
			{
				reportData.map((item,i) => (
				Object.keys(item).length > 0 &&
				<div key={`${item.key}${i}`} className="tableWrapper mb-5">
					<h2 className="bg-success">{item.title}</h2>
					<div className="tableInnerWrapper table-responsive">
						<table className="table table-bordered table-sm bg-white mb-0" >
							<thead>
								<tr className="first-head bg-success" style={{"display":"none"}}>
									<th scope="col" colSpan="100%" className="fw-bold mb-0 text-white">{item.title}</th>
								</tr>
								{/* <tr className="tr-blank"><td colSpan="100%">
								{item.units ? item.units : ''}
								</td></tr> */}
								<tr>
									{
									 item.header.map((subitem,i) => (
											
											<th scope="col" key={i} title={subitem}>
												{subitem}
											</th>
										
										))
									}
								</tr>
							</thead>
							<tbody>
								{
									item.data.map((subData,i) => (
										<tr key={i}>
											{
												subData.map((subitem,index) => (
													<td key={index} title={subitem} >{isNaN(subitem) ? subitem : parseFloat(subitem).toFixed(2).replace(/[.,]00$/, "")}</td>
												))
											}
											
										</tr>
									))
								}
								
							<tr className="d-none tr-blank"><td colSpan="100%"></td></tr>
							<tr className="d-none tr-blank"><td colSpan="100%"></td></tr>
							</tbody>
						</table>
					</div>
			</div>	
				))
			}
		</>
	);
};