import React, { memo, useState, useRef, useEffect } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { SiConvertio } from "react-icons/si";
import { TradeConversion_API, UpdateTradeConversion_API } from "../Redux/API";
import { Notification } from "../Notification";
import profile from "../ProfilePage/ProfilePage.module.scss";

const ConversionConfig = () => {
  const [validated, setValidated] = useState(false);
  const [conversionDetails, setConversionDetails] = useState([]);

  const [fetchData, setFetchData] = useState([]);
  const [NotifyData, setNotifyData] = useState({
    confirmFlag: false,
    confirmMsg: 'confirm msg',
    successFlag: false,
    successMsg: 'success msg',
    errorFlag: false,
    errorMsg: 'error msg',
    loadingFlag: false,
    loadingMsg: 'loading msg',
    activesession: false
  });

  const formRef = useRef("");

  useEffect(() => {
    async function fetchConversionData(e) {
      // e.preventDefault();
      setNotifyData((data) => ({
        ...data,
        loadingFlag: true,
        loadingMsg: "Retriving Trade converison data...",
      }));
      const ps1 = new Promise((resolve, reject) => {
        resolve(TradeConversion_API({ scripcode: "all" }));
      });
      const rs = await Promise.all([ps1])
        .then((val) => {
          return val[0]["data"];
        })
        .catch((err) => {
          setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err["message"] }));
          return err["response"];
        });
      if (rs["type"] === "success") {
        setNotifyData((data) => ({ ...data, loadingFlag: false }));
        setFetchData(rs["data"]);
      } else {
        setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs["message"] }));
       
      }
    }
    fetchConversionData();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formRef.current.checkValidity() === false) {
      event.stopPropagation();
      setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }
    else {
      setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Add trade conversion configuration data..." }))
      const ps1 = new Promise((resolve, reject) => {
        resolve(UpdateTradeConversion_API(conversionDetails))
      })
      const rs = await Promise.all([ps1]).then((val) => {
        return val[0]['data'];
      }).catch((err) => {
        setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
        console.log("*********", err.response.status);
        (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
        return err["response"]["data"];
      })
      if (rs['type'] === 'success') {
        setFetchData(rs["data"]);
        setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, successFlag: true, successMsg: rs['message'] }))
      } else {
        setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
      }
    }
    setValidated(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newState = [...conversionDetails]
    newState[0][name] = value.toUpperCase();
    setConversionDetails(newState);
  }

  const CloseConfirm = () => {
    setNotifyData((data) => ({ ...data, confirmFlag: false }))
  }

  const CloseError = () => {
    setNotifyData((data) => ({ ...data, errorFlag: false }));
  };

  const CloseSuccess = () => {
    setNotifyData((data) => ({ ...data, successFlag: false }));
  };

  return (
    <div className={`basic-forminfo ${profile.basicInfo}`}>
      <h5 className={profile.basicHeading}>
        <span className={profile.icons}>
          <SiConvertio />
        </span>
        Conversion Configuration
      </h5>
      <Form
        ref={formRef}
        noValidate
        validated={validated}
        // onSubmit={handleSubmit}
        onSubmit={(e) => {
          e.preventDefault();
          setNotifyData((data) => ({
            ...data,
            confirmFlag: true,
            confirmMsg: "Are you sure,  You want to add conversion configuration?",
            confirmAction: (e) =>
              handleSubmit(e)
          }))
        }}
        className={profile.basicInfoSetting}
      >
        <Row className="mb-3">
          <Form.Group
            as={Col}
            md="12"
            controlId="validationCustomFScripcode"
            className="mb-3"
          >
            <Form.Label>Select Product</Form.Label>
            <InputGroup hasValidation>
              <Form.Select
                onChange={(e) => {
                  setConversionDetails(
                    fetchData.filter((fl) => {
                      return (
                        fl.fromscripcode == e.target.value.split(" ")[0] &&
                        fl.fromexchange == e.target.value.split(" ")[1] &&
                        fl.fromsymbol == e.target.value.split(" ")[2] &&
                        fl.fromexpirydate == e.target.value.split(" ")[3]
                      );
                    })
                  );
                }}
                aria-label="Floating label select example"
                defaultValue={"Select Product"}
                required
              >
                <option value="Select Product" hidden >
                  Select Product
                </option>
                {fetchData.map((val) => {
                  return (
                    <option
                      key={val.id}
                      value={
                        val.fromscripcode +
                        " " +
                        val.fromexchange +
                        " " +
                        val.fromsymbol +
                        " " +
                        val.fromexpirydate
                      }
                    >
                      {val.fromscripcode +
                        " " +
                        val.fromexchange +
                        " " +
                        val.fromsymbol +
                        " " +
                        val.fromexpirydate}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please enter Select Product.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomTScripcode"
            className="mb-3"
          >
            <Form.Label>From Scripcode</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="fromscripcode"
                value={conversionDetails.length > 0 ? conversionDetails[0]['fromscripcode'] : " "}
                onChange={handleChange}
                readOnly
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter from Scripcode
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomTScripcode"
            className="mb-3"
          >
            <Form.Label>To Scripcode</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="toscripcode"
                value={conversionDetails.toscripcode && conversionDetails.toscripcode}
                onChange={handleChange}
                placeholder="Enter to-Scripcode"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter To Scripcode
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomFSymbol"
            className="mb-3"
          >
            <Form.Label>From Symbol</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="fromsymbol"
                value={conversionDetails.length > 0 ? conversionDetails[0]['fromsymbol'] : " "}
                readOnly
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your from symbol.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomTSymbol"
            className="mb-3"
          >
            <Form.Label>To Symbol</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="tosymbol"
                value={conversionDetails.tosymbol && conversionDetails.tosymbol}
                onChange={handleChange}
                placeholder="Enter to-symbol"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter To Symbol
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomFExchange"
            className="mb-3"
          >
            <Form.Label>From Exchange</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="fromexchange"
                value={conversionDetails.length > 0 ? conversionDetails[0]['fromexchange'] : " "}
                readOnly
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your From Exchange
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomTExchange"
            className="mb-3"
          >
            <Form.Label>To Exchange</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="toexchange"
                value={conversionDetails.toexchange && conversionDetails.toexchange}
                onChange={handleChange}
                placeholder="Enter to-Exchange Name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter To Exchange
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomFExpiryDate"
            className="mb-3"
          >
            <Form.Label>FromExpiryDate</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                value={conversionDetails.length > 0 ? conversionDetails[0]['fromexpirydate'] : " "}
                readOnly
                name="fromexpirydate"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter From-expiryDate.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomFExpiryDate"
            className="mb-3"
          >
            <Form.Label>To ExpiryDate</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="toexpirydate"
                value={conversionDetails.toexpirydate && conversionDetails.toexpirydate}
                onChange={handleChange}
                placeholder="enter to-expirydate"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter to ExpiryDate
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group
            as={Col}
            md="6"
            controlId="validationCustomTradePriceDivide"
            className="mb-3"
          >
            <Form.Label>Trade Price Divide</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="tradepricedivider"
                value={conversionDetails.length > 0 ? conversionDetails[0]['tradepricedivider'] : " "}
                onChange={handleChange}
                placeholder="Enter Trade-Price-Divide"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter Trade Price Divide
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <div>
          <input type="submit" className={profile.basicInfoBtn} value="Add" />
        </div>
      </Form>
      <Notification
        notify={NotifyData}
        CloseError={CloseError}
        CloseSuccess={CloseSuccess}
        CloseConfirm={CloseConfirm}
      />
    </div>
  );
};

export default memo(ConversionConfig);
