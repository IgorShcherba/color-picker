import React from "react";
import ColorPicker from "./components/ColorPicker";

function App() {
  const onChange = (color: string) => console.log(color);

  return (
    <div className="page">
      <ColorPicker
        colors={["#e90808", "#22e908", "#2a08e9"]}
        value={"#e90808"}
        onChange={onChange}
      />
    </div>
  );
}

export default App;
