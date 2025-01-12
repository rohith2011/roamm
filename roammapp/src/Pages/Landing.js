import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { NavLink, useNavigate } from 'react-router-dom'
import "../index.css"
import { Col, Row } from 'react-bootstrap'
import watch from '../static/watch.png'
import { Image } from 'react-bootstrap'
import { API, Auth} from "aws-amplify";
import { Authenticator, withAuthenticator, useTheme, View, Text, Heading, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import {login} from '../Store/Actions/UserActions'
import {setAdminId,setManagerId,setParticipantId} from '../Store/Actions/state'

function Landing(props) {
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser != null) {
            currentUser.getSession(function (err, session) {
                if (err) {
                    alert(err);
                    return;
                }
                console.log('session validity: ' + session.isValid());
                console.log(session.getIdToken().payload);
                props.login(session.getIdToken().payload)
                console.log(props)
            });
        }
    }, [currentUser])

    const customStyle = {
        card: {
            width: "85%",


        },
        text_field: {
            width: "75%",
            border: "1px solid gray"
        },
        button: {
            marginTop: "5px",
            marginBottom: "20px",
            marginRight: "5px",
            marginLeft: "5px",

        },

        flexing: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '10%',


        },
        modalBackground: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // translucent black
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        },

        modal: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '33rem',
            boxSizing: 'border-box',
            position: "relative"
        },

        closeButtonStyle : {
            position: 'absolute',
            top: '18px',
            right: '35px',
            background: 'transparent',
            border: 'none',
            fontSize: '2em',
            cursor: 'pointer',
          }

    }

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginClose = () =>{
        setShowLoginModal(false);
    };

    return (
        <Row className='login-image' style={customStyle.flexing}>
            <Col sm={4} style={{ alignItems: "center", justifyContent: "center", display: "flex" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <Image alt='ROAMM Watch' style={{ display: "block", height: "auto" }} src={watch} width={250} height={400} />
                    <Button onClick={handleLoginClick} style={{ position: "absolute", bottom: "100px", left: "48%", transform: "translateX(-50%)", padding: "10px 20px", backgroundColor: "var(--ufBlue)", color: "#ffffff", border: "none", borderRadius: "4px", cursor: "pointer" }}>LOGIN</Button>
                   
                   
                    {showLoginModal && (
                        <div style={customStyle.modalBackground}>
                            
                            <div style={customStyle.modal}>
                            <button onClick={handleLoginClose} style={customStyle.closeButtonStyle}>&times;</button>                            

                                <Authenticator hideSignUp={true}>
                                    {({ signOut, user }) => {
                                        setCurrentUser(user);
                                        user.getSession(async function(err, session) {
                                            const temp_role = session.getIdToken().payload["custom:role"];
                                            console.log(props)
                                            if (temp_role == "admin"){
                                                props.setAdminId(session.getIdToken().payload["custom:id"])
                                                navigate("/adminDashboard")
                                            }
                                            else if(temp_role == "manager"){
                                                props.setManagerId(session.getIdToken().payload["custom:id"])
                                                navigate("/managerDashboard")
                                            }
                                            else if(temp_role == "coordinator"){
                                                navigate("/coordinatorDashboard")
                                            }
                                            else{
                                                props.setParticipantId(session.getIdToken().payload["custom:id"])
                                                navigate("/participantDashboard")
                                            }
                                        });
                
                                        return (
                                            <main>
                                                <h1>Hello {user.username}</h1>
                                                <button onClick={signOut}>Sign out</button>
                                            </main>
                                        );
                                    }}
                                </Authenticator>
                            </div>
                        </div>
                    )}


                </div>
            </Col>
            <Col>
                <Card style={customStyle.card} className="m-auto">
                    <Card.Body>
                        <Row>

                            {/*
                    <Col>
                    <Container> 
                    <h3 className='uf_head'>Login</h3><hr/>
                    <Form>
                        <Form.Group className="m-4" controlId='Email'>
                            <Form.Label className='uf_formlabel'>Email</Form.Label>   
                            <Form.Control className="uf_textbox" type="email" required={true}  autoComplete='off' style={{width: "75%",border:"1px solid gray"}}/>
                        </Form.Group>
                        <Form.Group className="m-4" controlId="Password" >
                            <Form.Label className='uf_formlabel'>Password</Form.Label>
                            <Form.Control className="uf_textbox" type="password" required={true}  autoComplete='off' style={customStyle.text_field}/>
                        </Form.Group>
                        <Button className='m-4 uf_button' type="submit">Login</Button>
                        <Card.Footer><NavLink>Forgot Password?</NavLink></Card.Footer>
                    </Form>
                    </Container>
                </Col> */}


                            <Col>
                                <h3 className='uf_head'>Want to know more?</h3><hr />
                                <Row className='uf_toggleparagraphcontainer'><div className='uf_subheading'>ABOUT US</div><div className='uf_toggleparagraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim sit amet venenatis urna. Non blandit massa enim nec dui nunc mattis. Viverra mauris in aliquam sem fringilla. Varius morbi enim nunc faucibus a pellentesque sit.</div></Row>
                                <hr />
                                <Row className='uf_toggleparagraphcontainer'><div className='uf_subheading'>TEAM</div><div className='uf_toggleparagraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim sit amet venenatis urna. Non blandit massa enim nec dui nunc mattis. Viverra mauris in aliquam sem fringilla. Varius morbi enim nunc faucibus a pellentesque sit.</div></Row>
                                <hr />
                                <Row className='uf_toggleparagraphcontainer'><div className='uf_subheading'>PUBLICATIONS</div><div className='uf_toggleparagraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim sit amet venenatis urna. Non blandit massa enim nec dui nunc mattis. Viverra mauris in aliquam sem fringilla. Varius morbi enim nunc faucibus a pellentesque sit.</div></Row>
                                <hr />
                                <Row className='uf_toggleparagraphcontainer'>
                                    <div className='uf_subheading'>SUPPORT</div>
                                    <div className='uf_toggleparagraph'>
                                        <ul>
                                            <li>For any ROAMM watchOS related issues please contact x@ufl.edu for questions and concerns.</li>
                                        </ul>
                                    
                                    </div>
                                </Row>
                                <hr />

                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );

}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (userObject) => dispatch(login(userObject)),
        setAdminId: (adminId) => dispatch(setAdminId(adminId)),
        setManagerId: (managerId) => dispatch(setManagerId(managerId)),
        setParticipantId: (participantId) => dispatch(setParticipantId(participantId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);