import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = Array.from({ length: 11 }, (_, i) => i + 1);

const specialPeriods = {
  5: { label: "Break", color: "#FFD700" },
  8: { label: "Lunch", color: "#FFA500" }
};

export default function DuplicateTimetable({ timetable, onBack }) {
  const [interactiveTable, setInteractiveTable] = useState(
    periods.map(p => {
      const row = { period: p, time: "" };
      days.forEach(day => row[day] = ""); // placeholder for editable subject
      return row;
    })
  );

  const handleChange = (periodIdx, day, value) => {
    setInteractiveTable(prev => {
      const updated = [...prev];
      updated[periodIdx][day] = value;
      return updated;
    });
  };

  /* ===== EXPORT FUNCTIONS ===== */
  const exportExcel = () => {
    const rows = [];
    interactiveTable.forEach(row => {
      const special = specialPeriods[row.period];
      if(special){
        rows.push({
          Day: "All",
          Period: row.period,
          Time: row.time || "",
          Subject: special.label
        });
      } else {
        days.forEach(day => {
          rows.push({
            Day: day,
            Period: row.period,
            Time: row.time || "",
            Subject: row[day] || ""
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "custom_timetable.xlsx");
  };

  const exportWord = async () => {
    const tableRows = [];

    // Header
    const headerCells = [
      new TableCell({ children: [new Paragraph({ text: "Period", bold: true })], width: { size: 1000, type: WidthType.DXA } }),
      new TableCell({ children: [new Paragraph({ text: "Time", bold: true })], width: { size: 1500, type: WidthType.DXA } }),
      ...days.map(day => new TableCell({ children: [new Paragraph({ text: day, bold: true })], width: { size: 2000, type: WidthType.DXA } }))
    ];
    tableRows.push(new TableRow({ children: headerCells }));

    interactiveTable.forEach(row => {
      const special = specialPeriods[row.period];
      const cells = [
        new TableCell({ children: [new Paragraph(String(row.period))] }),
        new TableCell({ children: [new Paragraph(row.time || "")] })
      ];

      if(special){
        cells.push(new TableCell({
          children: [new Paragraph({ text: special.label, bold: true })],
          columnSpan: days.length,
          shading: { fill: special.color.replace("#", "") }
        }));
      } else {
        days.forEach(day => {
          cells.push(new TableCell({ children: [new Paragraph(row[day] || "")] }));
        });
      }
      tableRows.push(new TableRow({ children: cells }));
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: "Custom Timetable", heading: "Heading1", spacing: { after: 300 } }),
            new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "custom_timetable.docx");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Buttons on LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", alignItems: "flex-start" }}>
        <button onClick={exportExcel} style={{ padding: "10px 15px" }}>Download Excel</button>
        <button onClick={exportWord} style={{ padding: "10px 15px" }}>Download Word</button>
        <button onClick={onBack} style={{ padding: "10px 15px" }}>Back to whole School Timetable</button>
      </div>

      {/* Interactive Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "max-content", minWidth: "800px" }}>
          <thead>
            <tr>
              <th>Period</th>
              <th>Time</th>
              {days.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {interactiveTable.map((row, idx) => {
              const special = specialPeriods[row.period];
              if(special){
                return (
                  <tr key={idx}>
                    <td>{row.period}</td>
                    <td>{row.time || ""}</td>
                    <td colSpan={days.length} style={{ backgroundColor: special.color, textAlign: "center", fontWeight: "bold" }}>
                      {special.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={idx}>
                  <td>{row.period}</td>
                  <td>
                    <input 
                      type="time" 
                      value={row.time} 
                      onChange={(e) => {
                        const updated = [...interactiveTable];
                        updated[idx].time = e.target.value;
                        setInteractiveTable(updated);
                      }} 
                    />
                  </td>
                  {days.map(day => (
                    <td key={day + idx} style={{ border: "1px solid #ccc", minWidth: "120px", height: "50px", padding: "2px" }}>
                      <input 
                        type="text" 
                        value={row[day]} 
                        onChange={(e) => handleChange(idx, day, e.target.value)} 
                        placeholder="Enter Subject"
                        style={{ width: "100%", height: "100%", border: "none", padding: "2px", boxSizing: "border-box" }}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}