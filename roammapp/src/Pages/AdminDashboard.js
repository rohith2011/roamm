import React,{useState,useEffect} from 'react';
import { Col, Row, Container, Table, Form } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import SideNavbar from '../Components/SideNavbar';
import '../index.css'
import {CiPaperplane} from 'react-icons/ci';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {getManagersList} from "../Store/Actions/admin"
import {connect} from 'react-redux'
import {setManagerId} from '../Store/Actions/state'
import {useNavigate} from 'react-router-dom'
import AlertBox from '../Components/AlertBox'
import axios from 'axios';
import Loader from '../Components/Loader';
import { isFriday } from 'date-fns';
import {Auth} from 'aws-amplify'

function AdminDashboard(props){
    const [currentSideActive, setCurrentSideActive] = useState(0)
    const [selectValue, setSelectValue] = useState("totalPar");
    const [order, setOrder] = useState("normal")
    const [managerList, setManagerList] = useState([])
    const navigate = useNavigate()
    const [alertShow,setAlertShow] = useState([false,""])
    const [errorMsg,setErrorMsg] = useState("");
    const [loader,setLoader] = useState(true);

    useEffect(()=>{
        //handleInfo()
        Auth.currentSession().then(session=>{
            if(session.isValid()){
                let role = session.getIdToken().payload["custom:role"];
                if(role=="admin"){
                    handleInfoDummy()
                }
                else{
                    if(role == "manager" || role == "coordinator"){
                        navigate("/managerDashboard")
                    }
                    else if(role == "participant"){
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
        
        
    },[])

    // useEffect(()=>{
    //     setManagerList(props.admin.managerList)
    //     setAlertShow(true)
    // },[props.admin,alertShow])

    // const handleInfo = async () =>{
    //     await props.getManagersList(props.state.adminId)
    // }
   
    const handleInfoDummy = async () => {
        setLoader(true)
        setAlertShow(false)
        try{
        const config = {
            headers: {
                'Custom-Header': 'value',
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post("https://aa2397tzu2-vpce-00569c5e62069a9a0.execute-api.us-east-1.amazonaws.com/roamm/new_admin_dashboard",config)
        console.log(res)
        setManagerList(res.data.body)
        setLoader(false)
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
                            <SideNavbar list={["Manager List", "Create Manager"]} active={currentSideActive} links={["/adminDashboard","/createManager"]}/>
                        </Col>
                        <Col style={{height: "75%"}}>
                            {alertShow[0]?(alertShow[1] == "danger"? <AlertBox type="danger" message={errorMsg}/>:<></>):<></>}
                            <h2>Manager List</h2>
                            <hr/>
                            
                            {loader? <Loader/>:(<Row className="mt-3">
                                
                                <BootstrapTable  keyField='name' data={managerList} columns={[
                                {
                                    dataField: 'managerId',
                                    text: "Id"
                                },
                                {
                                    dataField: 'name',
                                    text: 'Name'
                                },
                                {
                                    dataField: 'totalCamp',
                                    text: 'Total Campaigns',
                                    sort: true
                                },
                                {
                                    dataField: 'totalPar',
                                    text: 'Total Participants',
                                    sort: true
                                },
                                {
                                    dataField: 'activePar',
                                    text: 'Active Participants',
                                    sort: true
                                }
                                ]} 
                                hover 
                                headerClasses={"table-header-style"} 
                                rowClasses="table-row-style"
                                rowEvents={{
                                    onClick: (e, row, rowIndex) =>{
                                        //props.setManagerId(row.managerId)
                                        localStorage.setItem("managerId",row.managerId)
                                        navigate("/managerDashboard")
                                    }
                                }}
                                />

                            </Row>)}
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}

const mapStateToProps = (state,ownProps) =>{
    return {
        user: state.user,
        admin: state.admin,
        state: state.state
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        getManagersList: (adminId) => dispatch(getManagersList(adminId)),
        setManagerId: (managerId) => dispatch(setManagerId(managerId))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(AdminDashboard);



