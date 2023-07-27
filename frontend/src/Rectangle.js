import React, { useState } from "react";
import "./App.css";

const Rectangle = () => {
  const [backgroundColor, setBackgroundColor] = useState("#ffcc00");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const handleRectangleClick = async () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    setBackgroundColor(randomColor);

    try {
      const response = await fetch("https://dpd15re1sd.execute-api.ca-central-1.amazonaws.com/dev/qoute"); // Replace with your actual API URL
      const data = await response.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      className="rectangle"
      style={{ backgroundColor: backgroundColor }}
      onClick={handleRectangleClick}
    >
      <p className="rectangle-text">
        {quote ? `"${quote}" - ${author}` : "Click to get a quote"}
      </p>
    </div>
  );
};

export default Rectangle;

