export default function Metric(){
    return(
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800">All Clients</h1>
            </div>
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4 comp-block">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-md font-weight-bold text-primary text-uppercase mb-1">Sketch & Etch</div>
                                </div>
                                <div className="col-auto">
                                   <i className="fas fa-fw fa-building"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4 comp-block">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-md font-weight-bold text-primary text-uppercase mb-1">Reggie</div>
                                </div>
                                <div className="col-auto">
                                   <i className="fas fa-fw fa-building"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};