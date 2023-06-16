import React, { memo, useState } from 'react'
import { AiFillClockCircle } from 'react-icons/ai'
import {  Modal} from 'react-bootstrap'
import { ImSearch } from 'react-icons/im'
import ChatForm from './ChatForm'
import chat from './ChatBox.module.scss'

const ChatBoxMainPage = (props) => {
    const [showForm, setShowForm] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    // const notificationData = [
    //     { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    //     { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    //     { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    //     { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    //     { img: profileUser, title: 'New Report', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    //     { img: profileUser, title: 'New Report', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    // ]
    return (
        <div className="container-fluid">

            <div className={chat.chatPage}>
                <div className={`row ${chat.chatCard}`}>
                    <div className={`usermanagement-search-field col-md-12 ${chat.searchField}`}>
                        <input
                            type="text"
                            placeholder="Search User"
                            className={`usermanagement-search-box  ${chat.searchBox}`}
                            value={searchValue}
                            onChange={(e) => { setSearchValue(e.target.value) }}
                        />
                        <span className={chat.searchIcon}>
                            <ImSearch />
                        </span>
                    </div>
                    {props.chatnotificationData.map((data, i) => {
                        return <div key={i}
                            className={`col-md-3 chat-single-card ${chat.userSingleCard}`}
                        >

                            <div className={chat.userChatImage}>
                                <img src={data.img} alt="usericon" />
                            </div>
                            <div className={chat.userMessage}>
                                <h4 className={chat.userChatContent}>{data.title}</h4>
                            </div>

                            <div className={chat.tokenSection}>
                                <span className={`chat-time-stamp ${chat.timeStamp}`}>
                                    <span>
                                        <AiFillClockCircle />
                                    </span>
                                    {data.time}
                                </span>
                                <h4 className={`user-token ${chat.userToken}`}>#{data.token}</h4>
                            </div>
                            <div className={chat.userCaption}>
                                <h6 className={chat.userCaptionContent}>{data.caption}</h6>
                            </div>
                            <div className={chat.queryBtnSection}>
                                <button className={`close-query-btn ${chat.queryBtn}`}>Close Query</button>
                            </div>
                        </div>
                    })}
                </div>
                <div className={chat.userAddBtn}>
                    <button className={chat.addIcon} onClick={() => setShowForm(true)}>
                        +
                    </button>

                </div>
                <Modal
                    show={showForm}
                    onHide={() => setShowForm(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title> Raise New Query</Modal.Title>
                    </Modal.Header>
                    <ChatForm />

                </Modal>
            </div>
        </div>
    )
}

export default memo(ChatBoxMainPage)