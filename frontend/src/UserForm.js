import React, { useState } from "react";
import "./App.css";

const UserForm = () => {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange1 = (event) => {
    setInputValue1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInputValue2(event.target.value);
  };

  const handleInputChange3 = (event) => {
    setInputValue3(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue1) {
      setErrorMessage("Email is required.");
    } else {
      setErrorMessage("");
      const userInput = { email: inputValue1, firstName: inputValue2, lastName: inputValue3 };
      console.log("User input:", userInput);

      fetch('https://dpd15re1sd.execute-api.ca-central-1.amazonaws.com/dev/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      })
        .then(response => response.json())
        .then(data => {
   
          if (data.message === "Successfully subscribed!") {
            alert(data.message);
          }
        })
        .catch(error => {
          // Handle API error here
        });
    }
  };

  return (
    <div className="user-form">
      <div className="input-container">
        <label htmlFor="input1">Email:</label>
        <input
          type="text"
          id="input1"
          value={inputValue1}
          onChange={handleInputChange1}
          placeholder="e.g. me@example.com"
        />
      </div>
      <div className="input-container">
        <label htmlFor="input2">First name (Optional):</label>
        <input
          type="text"
          id="input2"
          value={inputValue2}
          onChange={handleInputChange2}
          placeholder="e.g. Morteza"
        />
      </div>
      <div className="input-container">
        <label htmlFor="input3">Last name (Optional):</label>
        <input
          type="text"
          id="input3"
          value={inputValue3}
          onChange={handleInputChange3}
          placeholder="e.g. Namvar"
        />
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button onClick={handleSubmit}>Subscribe</button>
    </div>
  );
};

export default UserForm;
