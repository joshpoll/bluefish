import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Peritext } from "./examples/peritext";

function App() {
  const [startOpId, setStartOpId] = React.useState("5@B");
  const [rangeval, setRangeval] = React.useState(undefined);

  return (
    <div className="App">
      <input
        type="range"
        className="custom-range"
        min="0"
        max="20"
        // step="0.25"
        onChange={(event) => setRangeval(event.target.value as any)}
      />
      <h4>The range value is {rangeval}</h4>
      <br />
      <select value={startOpId} onChange={(e) => setStartOpId(e.target.value)}>
        {["5@B", "6@B", "7@A"].map((opId) => (
          <option value={opId}>{opId}</option>
        ))}
      </select>
      "OP ID": {startOpId}
      <br />
      {/* <SVG width={1000} height={1000}>
        <Row name={'test-row'} spacing={rangeval ? +rangeval : 10} alignment={'middle'}>
          <Rect fill={'red'} width={100} height={100} />
          <Rect fill={'blue'} width={100} height={100} />
          <Rect fill={'green'} width={100} height={100} />
        </Row>
      </SVG> */}
      <Peritext
        spacing={rangeval}
        chars={[
          { value: "T", opId: "1@A", deleted: false, marks: ["italic"] },
          { value: "h", opId: "2@A", deleted: true, marks: ["italic"] },
          {
            value: "e",
            opId: "5@B",
            deleted: false,
            marks: ["bold", "italic"],
          },
          {
            value: " ",
            opId: "6@B",
            deleted: false,
            marks: ["bold", "italic"],
          },
          { value: "f", opId: "7@A", deleted: false, marks: ["bold"] },
          { value: "o", opId: "8@A", deleted: true, marks: [] },
          { value: "x", opId: "9@A", deleted: false, marks: [] },
        ]}
        markOps={[
          {
            action: "addMark",
            opId: "18@A",
            start: { opId: startOpId },
            end: { opId: "7@A" },
            markType: "bold",
            backgroundColor: "#F9EEEE",
            borderColor: "#E57E97",
          },
          {
            action: "addMark",
            opId: "10@B",
            start: { opId: "1@A" },
            end: { opId: "6@B" },
            markType: "italic",
            backgroundColor: "#E3F2F7",
            borderColor: "#00C2FF",
          },
        ]}
      />
    </div>
  );
}

export default App;
