import React, { useRef, useState } from 'react'
import { Form, InputGroup, Row } from 'react-bootstrap'
import { AiOutlineAreaChart } from 'react-icons/ai';
import { BiRupee } from 'react-icons/bi';
import cardStyle from "./Cards.module.scss";

const TodayForm = (props) => {
  const formRef = useRef("");



  // console.log("firstwretg", props.data[0].current)
  const [alertCondition, setAlertCondition] = useState({
    condition: '',
    amount: ''
  })

  const [validated, setValidated] = useState(false);

  

  const handleChange = (e) => {
    setAlertCondition({
      ...alertCondition,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div className={cardStyle.TodayForm}>
      <Form
        noValidate
        ref={formRef}
        validated={validated}
      >
        <Row className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label
              htmlFor="role"
              className="form-label"
            >
              <span className={`label-icon ${cardStyle.labelIcon}`}>
                <AiOutlineAreaChart />
              </span>
              Select Condition
            </Form.Label>
            <Form.Select
              name='condition'
              required
              onChange={handleChange}
              value={alertCondition.condition}
              defaultValue={'Select Condition'}>

              <option value={'Select Condition'} hidden>Select Condition</option>
              <option value="lessthan">Less Than</option>
              <option value="greaterthan">Greater Than</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please Select Condition
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            md="12"
            className='mb-2'
          >
            <Form.Label>
            <span className={`label-icon ${cardStyle.labelIcon}`}>
                <BiRupee />
              </span>
              Alert Amount
            </Form.Label>
            <InputGroup >
              <Form.Control
                type="number"
                placeholder="Enter Alert Amount"
                required
                name="amount"
                value={alertCondition.amount}
                onChange={handleChange}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              Please Enter Alert Amount
            </Form.Control.Feedback>
          </Form.Group>

        </Row>
        <div className={cardStyle.createBtn}>
          <input
            type="submit"
            value='Create Alert'
            className={cardStyle.createAlert}
            onClick={(e)=>{props.handleCreateAlert(e,alertCondition,true);props.onClose(false)}}
          />
        </div>
      </Form>
      

    </div>
  )
}

export default TodayForm