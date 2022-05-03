import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Metric from "../components/metric";
import Report from "../components/reports";

export async function getStaticProps() {
  //return { props: { isBlue: false } };

    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await res.json();

    return{
        props:{
            isBlue: false,
            result:data
        }
    }
};


export default function Home({props,result}) {
  return (
    <main>
      <div id="wrapper">
        <Sidebar/>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbar/>
            <div className="container-fluid">
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">All Clients</h1>
              </div>
              <div className="row">
                {
                  result.slice(0, 8).map((elem)=>{ 
                        return(
                            <div className="col-xl-3 col-md-6 mb-4 comp-block" key={elem.id}>
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-md font-weight-bold text-primary text-uppercase mb-1">{elem.title.substring(0, 20)}</div>
                                            </div>
                                            <div className="col-auto">
                                               <i className="fas fa-fw fa-building"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
              </div>
              {/* <Report /> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
