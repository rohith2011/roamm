import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import { useNavigate, useParams } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {connect} from 'react-redux'
import {getCampaignInfo} from '../Store/Actions/campaign'
import {setParticipantId} from '../Store/Actions/state'
import AlertBox from '../Components/AlertBox'
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import Loader from '../Components/Loader'
import {Auth} from 'aws-amplify';
import { DataGrid } from '@mui/x-data-grid';




function CampaignDashboard(props){
    const [currentSideActive, setCurrentSideActive] = useState(0)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const {managerid} = useParams(); 
    const [participantList, setParticipantList] = useState([])
    const [campaignName, setCampaignName] = useState("")
    const [campaignId, setCampaignId] = useState("")
    const [avgCompliance, setAvgComplinace] = useState(0)
    const [avgWearingTime, setAvgWearingTime] = useState(0)
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const [loader,setLoader] = useState(true);

    const navigate = useNavigate()
    
    useEffect(()=> {
        //handleInfo()
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if(role=="manager" || role == "coordinator" || role == "admin"){
                    handleInfoDummy()
                }
                else{
                    if(role == "participant"){
                        navigate("/participantDashboard")
                    }
                }
            }
            else{
                Auth.signOut()
                navigate("/")     
            }
        }).catch(error => {
            Auth.signOut()
            navigate("/")
        })
    },[]);

    useEffect(() => {
        setCampaignName(props.campaign.campaignName);
        setCampaignId(props.campaign.campaignId);
        setParticipantList(props.campaign.participantList);
    }, [props.campaign]);

    const handleInfo = async (managerId, campaignId) =>{
        await props.getCampaignInfo(props.state.managerId,props.state.campaignId)
    }

    const handleInfoDummy = async () =>{
        setLoader(true)
        try{
            //axios call
            const requestData = {
                campaign_id: localStorage.getItem("campaignId"),
                managerid: localStorage.getItem("managerId")
            }
            const response = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_campaign_dashboard",requestData)
            console.log(response)
            if(response.data.statusCode != 200){
                setLoader(true)
                setAlertShow([true,"danger"])
                setErrorMsg(JSON.parse(response.data.body).message)
            }
            //update the data format required for the dispatch
            else{
                setParticipantList(JSON.parse(response.data.body))
                setCampaignId(localStorage.getItem("campaignId"))
                setCampaignName(localStorage.getItem("campaignId"))
                setLoader(false)
            }
            
            //dispatch the action
            
            }
            catch(err){
                setLoader(true)
                setAlertShow([true,"danger"])
                setErrorMsg(err.message)
                console.log(err)
            }
    }


    return(
        <div style={{height:"100%",overflowY:"auto"}} className="bg-image">
    <NavBar/>
    <div style={{height:"inherit"}}>
        <Container style={{height:"100%"}}>
            <Row style={{height:"100%"}}>
                <Col lg={2} style={{height:"75%"}}>
                <SideNavbar list={["Campaign Dashboard","Create Participant","Configure Watch"]} active={currentSideActive} links={["/campaignDashboard","/createParticipant","/configureWatch"]}/>
                </Col>
                <Col style={{height: "75%",overflow:"auto"}}>
                {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                    <Row>
                        <Col>
                        <FaArrowLeft style={{fontSize:"22px"}} onClick={()=>{navigate("/managerDashboard")}}/>
                        </Col>
                        <Col sm={6}>
                            <Row>
                                <h2 style={{fontFamily:"GentonaLight"}}>Campaign Name: <b>{campaignName}</b></h2>
                            </Row>
                            <Row>
                                <h4 style={{fontFamily:"GentonaLight"}}>Campaign Id: <b>{campaignId}</b></h4>
                            </Row>
                        </Col>
                        <Col style={{display:"flex",justifyContent:"space-around"}} sm={5}>
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"cneter",alignItems:"center"}}>
                            <h2><b>{avgCompliance}%</b></h2>
                        <div>Avg. Compliance</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"cneter",alignItems:"center"}}>
                            <h2><b>{avgWearingTime} hrs</b></h2>
                            <div>Avg. Wear Time</div>
                        </div>
                        </Col>
                    </Row>
                    
                    {loader?<Loader/>: (<Row className="mt-3">
                        

<BootstrapTable  keyField='name' data={participantList} columns={[
                                {
                                    dataField: 'participantid',
                                    text: 'PID'
                                },
                                {
                                    dataField: 'startdate',
                                    text: 'Start Date',
                                    sort: true
                                },
                                {
                                    dataField: 'endtime',
                                    text: 'End Date',
                                    sort: true
                                },
                                {
                                    dataField: 'prompt_count',
                                    text: 'Prompt Count',
                                    sort: true
                                },
                                {
                                    dataField: 'compliance',
                                    text: 'Compliance (% per day)',
                                    sort: true
                                },
                                {
                                    dataField: 'sensor_count',
                                    text: 'Sensor Count',
                                    sort: true
                                },
                                {
                                    dataField: 'battery_decay',
                                    text: 'Battery Decay',
                                    sort: true
                                },
                                {
                                    dataField:"lastdata",
                                    text:"Date of last data (battery) capture",
                                    sort:true
                                }
                                ]} 
                                hover 
                                headerClasses={"table-header-style"} 
                                rowClasses="table-row-style"
                                rowEvents={{
                                    onClick: (e, row, rowIndex)=>{
                                        // props.setParticipantId(row.participant_id)
                                        localStorage.setItem("participantId",row.participantid)
                                        localStorage.setItem("startdate", row.startdate)
                                        localStorage.setItem("enddate", row.endtime)
                                        navigate("/participantDashboard")
                                }}} 
                                />

                    </Row>)}
                </Col>
            </Row>
        </Container>
    </div>

</div>
    );
}


const mapStateToProps = (state) =>{
    return {
        user: state.user,
        manager: state.manager,
        campaign: state.campaign,
        state: state.state
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getCampaignInfo: (managerId,campaignId) => dispatch(getCampaignInfo(managerId,campaignId)),
        setParticipantId: (participantId) => dispatch(setParticipantId(participantId))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(CampaignDashboard);