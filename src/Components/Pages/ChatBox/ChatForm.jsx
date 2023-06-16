import React,{ memo } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { AiFillCamera } from 'react-icons/ai'
import { MdComment, MdSubtitles } from 'react-icons/md'
import { ImAttachment } from "react-icons/im";
import { useSelector } from 'react-redux'
import { mediaURL } from '../../Redux/API';
import formchat from './ChatBox.module.scss'
const ChatForm = () => {
    // const state = useSelector(state => state)
    const Globalprofile_pic = useSelector((state) => state && state.profile_pic);
    return (
        <div className={formchat.chatForm}>
            <Form
                // validated={validated}
                // onSubmit={handleSubmit}
                className=""
            >
                <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        md="12"
                        className={`mb-3 ${formchat.imageSection}` }
                    >
                        <Form.Label>
                            <span className={`label-icon ${formchat.labelIcon}`}>
                                <ImAttachment />
                            </span>
                            Attach Image(.jpg)
                            <span className={formchat.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <div className={formchat.setImage}>
                            {/* <img src={state ? mediaURL + state['profile_pic'] : null} alt="usericon" /> */}
                            <img src={Globalprofile_pic ? mediaURL + Globalprofile_pic : null} alt="usericon" />
                            <label
                                htmlFor="chooseProfilePic"
                                className={formchat.cameraIcon}
                            >
                                <AiFillCamera />
                            </label>
                            <input
                                style={{ display: 'none' }}
                                type="file"
                                id="chooseProfilePic"
                                required
                            />
                        </div>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="12"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${formchat.labelIcon}`}>
                                <MdSubtitles />
                            </span>
                            Title
                            <span className={formchat.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup >
                            <Form.Control
                                type="text"
                                placeholder="Title"
                                required
                            />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            Please Enter Title
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}
                        md="12"
                        className='mb-3'
                    >
                        <Form.Label>
                            <span className={`label-icon ${formchat.labelIcon}`}>
                                <MdComment />
                            </span>
                            Caption
                            <span className={formchat.mendatory}>
                                *
                            </span>
                        </Form.Label>
                        <InputGroup >
                            <Form.Control
                                as="textarea"
                                rows={2}
                                required
                                name="caption"
                                placeholder="Caption..."
                            />
                        </InputGroup>
                    </Form.Group>
                </Row>
                <div>
                    <input
                        type="submit"
                        value='Submit'
                        className={formchat.chatSubmitbtn}
                    />
                </div>

            </Form>
        </div>
    )
}

export default memo(ChatForm)