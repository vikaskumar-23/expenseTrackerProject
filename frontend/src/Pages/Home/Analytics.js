import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100;
  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100;

  // Calculate total income and expense
  const totalIncome = totalIncomeTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalExpense = totalExpenseTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  // Show balance instead of total turnover
  const balance = totalIncome - totalExpense;

  // For the circular progress bars
  const TurnOverIncomePercent = totalIncome === 0 && totalExpense === 0 ? 0 : (totalIncome / (totalIncome + totalExpense)) * 100;
  const TurnOverExpensePercent = totalIncome === 0 && totalExpense === 0 ? 0 : (totalExpense / (totalIncome + totalExpense)) * 100;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    "Groceries": '#FF6384',
    "Rent": '#36A2EB',
    "Salary": '#FFCE56',
    "Tip": '#4BC0C0',
    "Food": '#9966FF',
    "Medical": '#FF9F40',
    "Utilities": '#8AC926',
    "Entertainment": '#6A4C93',
    "Transportation": '#1982C4',
    "Other": '#F45B69',
  };
  
  

  return (
    <>
      <Container className="mt-5 ">
        <Row>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100" style={{
              background: "#fff",
              border: "2px solid #111",
              borderRadius: "12px",
              color: "#111",
              boxShadow: "none"
            }}>
              <div className="card-header bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Total Transactions:</span>{" "}
                {TotalTransactions}
              </div>
              <div className="card-body">
                <h5 className="card-title " style={{color: "green"}}>
                  Income: <ArrowDropUpIcon/>{totalIncomeTransactions.length}
                </h5>
                <h5 className="card-title" style={{color: "red"}}>
                  Expense: <ArrowDropDownIcon />{totalExpenseTransactions.length}
                </h5>

                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={totalIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-2">
                  <CircularProgressBar
                    percentage={totalExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100" style={{
  background: "#fff",
  border: "2px solid #111",
  borderRadius: "12px",
  color: "#111",
  boxShadow: "none"
}}>
              <div className="card-header bg-black text-white ">
                <span style={{ fontWeight: "bold" }}>Balance:</span>{" "}
                {balance}
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{color: "green"}}>Income: <ArrowDropUpIcon /> {totalIncome} <CurrencyRupeeIcon /></h5>
                <h5 className="card-title" style={{color: "red"}}>Expense: <ArrowDropDownIcon />{totalExpense} <CurrencyRupeeIcon /></h5>
                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={TurnOverIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-4">
                  <CircularProgressBar
                    percentage={TurnOverExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100" style={{
  background: "#fff",
  border: "2px solid #111",
  borderRadius: "12px",
  color: "#111",
  boxShadow: "none"
}}>
              <div className="card-header  bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Categorywise Income</span>{" "}
              </div>
              <div className="card-body">
                {categories.map(category => {
                  const income = transactions.filter(transaction => transaction.transactionType === "credit" && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0)
                  // Show percentage of this category's income out of total income
                  const incomePercent = totalIncome === 0 ? 0 : (income / totalIncome) * 100;
                  return(
                    <>
                    {income > 0 &&
                      (<LineProgressBar label={category} percentage={incomePercent.toFixed(0)} lineColor={colors[category]} />)
                    }
                    </>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100" style={{
  background: "#fff",
  border: "2px solid #111",
  borderRadius: "12px",
  color: "#111",
  boxShadow: "none"
}}>
              <div className="card-header  bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Categorywise Expense</span>{" "}
              </div>
              <div className="card-body">
                {categories.map(category => {
                  const expenses = transactions.filter(transaction => transaction.transactionType === "expense" && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0)
                  // Show percentage of this category's expense out of total expense
                  const expensePercent = totalExpense === 0 ? 0 : (expenses / totalExpense) * 100;
                  return(
                    <>
                    {expenses > 0 &&
                      (<LineProgressBar label={category} percentage={expensePercent.toFixed(0)} lineColor={colors[category]}/>)
                    }
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Analytics;

