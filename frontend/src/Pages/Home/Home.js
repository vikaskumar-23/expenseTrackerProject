import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("365"); // Default to Last Year
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setValues({
      title: "",
      amount: "",
      description: "",
      category: "",
      date: getToday(), // Reset date to today when opening modal
      transactionType: "",
    });
    setShow(true);
  };

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  // Helper to get today's date in YYYY-MM-DD
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: getToday(), // Set default date to today
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } = values;

    if (
      !title ||
      !amount ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
    setLoading(true);

    const { data } = await axios.post(addTransaction, {
      title: title,
      amount: amount,
      description: description || "", // If empty, send empty string
      category: category,
      date: date,
      transactionType: transactionType,
      userId: cUser._id,
    });

    if (data.success === true) {
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("365"); // Set to Last Year
  };


  


  useEffect(() => {
    if (!cUser || !cUser._id) return;
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        console.log(cUser._id, frequency, startDate, endDate, type);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
        });
        console.log(data);
  
        setTransactions(data.transactions);
  
        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      <Header />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container
            style={{
              position: "relative",
              zIndex: "1 !important",
              maxHeight: "calc(100vh - 120px)", 
              overflowY: "auto",
              background: "#bbbbbb",
              paddingBottom: "4rem"
            }}
            className="mt-3"
          >
            <div className="filterRow">
  <div className="filter-controls">
    <Form.Group className="mb-3 filter-group" controlId="formSelectFrequency">
      <Form.Label>Select Frequency</Form.Label>
      <Form.Select
        name="frequency"
        value={frequency}
        onChange={handleChangeFrequency}
        className="filter-select"
      >
        <option value="7">Last Week</option>
        <option value="30">Last Month</option>
        <option value="365">Last Year</option>
        <option value="custom">Custom</option>
      </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3 filter-group" controlId="formSelectType">
      <Form.Label>Type</Form.Label>
      <Form.Select
        name="type"
        value={type}
        onChange={handleSetType}
        className="filter-select"
      >
        <option value="all">All</option>
        <option value="expense">Expense</option>
        <option value="credit">Earned</option>
      </Form.Select>
    </Form.Group>
    <Button
      variant="primary"
      onClick={handleReset}
      className="big-btn filter-btn"
      style={{ alignSelf: "end" }}
    >
      Reset Filter
    </Button>
  </div>
  <div className="iconBtnBox" style={{ flex: 1, justifyContent: "flex-start", marginLeft: "2.5rem" }}>
    <div
                  style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  onClick={handleTableClick}
                  className={view === "table" ? "iconActive" : "iconDeactive"}
                >
                  <FormatListBulletedIcon />
                  <span style={{ marginLeft: 6, fontWeight: 500 }}>Transactions</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", cursor: "pointer", marginLeft: 12 }}
                  onClick={handleChartClick}
                  className={view === "chart" ? "iconActive" : "iconDeactive"}
                >
                  <BarChartIcon />
                  <span style={{ marginLeft: 6, fontWeight: 500 }}>Summary</span>
                </div>
  </div>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1 }}>
    <Button onClick={handleShow} className="addNew big-btn" style={{ marginBottom: "0.5rem" }}>
      Add New
    </Button>
  </div>
</div>
            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {view === "table" ? (
              <>
                <h2 style={{
                  textAlign: "left",
                  color: "#FFD600",
                  fontWeight: 700,
                  margin: "-2rem 0 1em 0",
                  background: "#111",
                  borderRadius: "8px", // Less border radius
                  padding: "0.4rem 2rem",
                  border: "2px solid #ffe066",
                  display: "inline-block",
                  fontSize: "2rem" // Larger font size
                }}>
                  Transaction History
                </h2>
                <TableData data={transactions} user={cUser} triggerRefresh={() => setRefresh(r => !r)} />
              </>
            ) : (
              <>
                <h2 style={{
                  textAlign: "left",
                  color: "#FFD600",
                  fontWeight: 700,
                  margin: "-2rem 0 0em 0",
                  background: "#111",
                  borderRadius: "8px", // Less border radius
                  padding: "0.4rem 2rem",
                  border: "2px solid #ffe066",
                  display: "inline-block",
                  fontSize: "2rem" // Larger font size
                }}>
                  Transaction Summary
                </h2>
                <Analytics transactions={transactions} user={cUser} />
              </>
            )}
            <ToastContainer />

            <Modal show={show} onHide={handleClose} centered contentClassName="minimal-modal">
              <Modal.Header closeButton >
                <Modal.Title>Add Transaction Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      type="text"
                      placeholder="Title"
                      value={values.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      name="amount"
                      type="number"
                      placeholder="Amount"
                      value={values.amount}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose...</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Rent">Rent</option>
                      <option value="Salary">Salary</option>
                      <option value="Tip">Tip</option>
                      <option value="Food">Food</option>
                      <option value="Medical">Medical</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={values.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formTransactionType">
                    <Form.Label>Transaction Type</Form.Label>
                    <Form.Select
                      name="transactionType"
                      value={values.transactionType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose...</option>
                      <option value="credit">Credit</option>
                      <option value="expense">Expense</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit">
                      Add Transaction
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
