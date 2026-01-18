// Timetable.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";

// Classes
const classes = [
  "YEAR 1","YEAR 2","YEAR 3","YEAR 4S","YEAR 4Z", "Year 5Q", "Year 5T",
  "Year 6P", "Year 6T", "year 7", "year 8", "year 9", "year 10", "year 11"
];

// Subjects
const subjects = [
  "Math", "English","Science", "Biology", "Chemistry", "Physics", "History", 
  "Geography", "Character", "FIQH", "Art", "PE", "Seerah", "Tawheed", 
  "IRE/SAT/SOC", "B/S", "B/S/Soc", "CHEM/GEO/LIT", "Tafsr", "Arabic", 
  "Hadith", "Islamiat", "Assembly", "Clubs", "Qu'ran", "Soclology", 
  "Litreture", "ADAAB", "KISW", "ICT", "ENG(READ)", "SKILLS", "PRACTICALS"
];

// Teachers
const teachers = [
  "Ms. Cathrine","Ms. Divina","Ms. Mourine","Mr. Musin","Ms. Mwanamisi", 
  "Ust. Salim", "Ust. Husna", "Ust. Summayah", "Ust. Ruqayah", "Ust. Ali Noor", 
  "Ust. Fatma Wairimu", "Ms. Ether Munyoki", "Mr. Salim", "Mr. Chimera", 
  "Mr. Yahya", "Mr. Dinar", "Ms Verronicah", "Mr. Dilton", "Mr. Samson", 
  "Ms. Esther Makona", "Mr. Nuria", "Ms. Josphine", "Ust. Jamal", "Ust. Musa", 
  "Ust. Abdulhamid", "Ust. Ahmed", "Ust. Abdulhaman", "Ust. Abubakar", 
  "Ms. Zainab", "Ms. Fatma H", "Ms. Fatma" ,"Mr. Edgar", "Mr. Ainein", 
  "Mr. Omar", "Mr. Brian"
];

// Teacher codes
const teacherCodes = {};
teachers.forEach((t, i) => teacherCodes[t] = String(i + 1).padStart(3, "0"));

// Days
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Subject Colors
const subjectColors = {
  Math: "#00FF00", English: "#800000", Science: "#FF0000", Biology: "#98FB98", 
  Chemistry: "#DDA0DD", Physics: "#FFB6C1", History: "#FFA07A", Geography: "#87CEEB", 
  Character: "#F0E68C", FIQH: "#E6E6FA", Art: "#FF69B4", PE: "#F08080", Seerah: "#AFEEEE", 
  Tawheed: "#90EE90", "IRE/SAT/SOC": "#FFDAB9", "B/S": "#B0C4DE", "B/S/Soc": "#FFE4B5", 
  "CHEM/GEO/LIT": "#F5DEB3", Tafsr: "#D8BFD8", Arabic: "#FFE4E1", Hadith: "#E0FFFF", 
  Islamiat: "#FFFACD", Assembly: "#FAFAD2", Clubs: "#F0FFF0", "Qu'ran": "#F5F5DC", 
  Soclology: "#FFEFD5", Litreture: "#FFD700", ADAAB: "#FFE4C4", KISW: "#F0FFFF", 
  ICT: "#E6E6FA", "ENG(READ)": "#F5F5DC", SKILLS: "#FFF0F5", PRACTICALS: "#F5FFFA"
};

// Special periods
const specialPeriods = {
  5: { label: "Break", color: "#FFD700" },
  8: { label: "Lunch", color: "#FFA500" }
};

export default function Timetable() {
  const [timetable, setTimetable] = useState(
    Array.from({ length: 11 }, (_, period) => {
      const row = { period: period + 1, time: "" };
      days.forEach(day => {
        row[day] = {};
        classes.forEach(cls => {
          row[day][cls] = { subject: subjects[0], teacher: teachers[0] };
        });
      });
      return row;
    })
  );

  // Handle changes
  const handleChange = (periodIndex, day, cls, field, value) => {
    setTimetable(prev => {
      const updated = [...prev];
      updated[periodIndex][day][cls][field] = value;
      return updated;
    });
  };

  const handleTimeChange = (periodIndex, value) => {
    setTimetable(prev => {
      const updated = [...prev];
      updated[periodIndex].time = value;
      return updated;
    });
  };

  // ================= Excel Export (Filled timetable) =================
  const exportExcel = () => {
    const rows = [];
    timetable.forEach(row => {
      const periodNumber = row.period;
      const special = specialPeriods[periodNumber];
      if(special){
        rows.push({
          Day: "All",
          Class: "All",
          Period: row.period,
          Time: row.time,
          Subject: special.label,
          Teacher: ""
        });
      } else {
        days.forEach(day => {
          classes.forEach(cls => {
            const teacher = row[day][cls].teacher;
            const teacherWithCode = `${teacher} (${teacherCodes[teacher] || "000"})`;
            rows.push({
              Day: day,
              Class: cls,
              Period: row.period,
              Time: row.time,
              Subject: row[day][cls].subject,
              Teacher: teacherWithCode,
            });
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "timetable.xlsx");
  };

  // ================= Excel Export (Blank timetable) =================
  const exportBlankExcel = () => {
    const rows = [];
    timetable.forEach(row => {
      const periodNumber = row.period;
      const special = specialPeriods[periodNumber];
      if(special){
        rows.push({
          Day: "All",
          Class: "All",
          Period: row.period,
          Time: row.time || "",
          Subject: special.label,
          Teacher: ""
        });
      } else {
        days.forEach(day => {
          classes.forEach(cls => {
            rows.push({
              Day: day,
              Class: cls,
              Period: row.period,
              Time: row.time || "",
              Subject: "",
              Teacher: ""
            });
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Blank Timetable");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "blank_timetable.xlsx");
  };

  // ================= Word Export (Blank timetable, printable) =================
  const exportWordBlank = async () => {
    const tableRows = [];

    // Header row: Period, Time, all classes
    const headerCells = [
      new TableCell({ children: [new Paragraph({ text: "Period", bold: true })], width: { size: 1000, type: WidthType.DXA } }),
      new TableCell({ children: [new Paragraph({ text: "Time", bold: true })], width: { size: 1500, type: WidthType.DXA } }),
      ...classes.map(cls => new TableCell({ children: [new Paragraph({ text: cls, bold: true })], width: { size: 2000, type: WidthType.DXA } }))
    ];
    tableRows.push(new TableRow({ children: headerCells }));

    // Period rows
    timetable.forEach(row => {
      const periodNumber = row.period;
      const special = specialPeriods[periodNumber];

      const cells = [
        new TableCell({ 
          children: [new Paragraph(String(row.period))], 
          borders: { top: { size: 2 }, bottom: { size: 2 }, left: { size: 2 }, right: { size: 2 } } 
        }),
        new TableCell({ 
          children: [new Paragraph(row.time || "")], 
          borders: { top: { size: 2 }, bottom: { size: 2 }, left: { size: 2 }, right: { size: 2 } } 
        })
      ];

      if (special) {
        cells.push(new TableCell({
          children: [new Paragraph({ text: special.label, bold: true })],
          columnSpan: classes.length,
          shading: { fill: special.color.replace("#", "") },
          borders: { top: { size: 2 }, bottom: { size: 2 }, left: { size: 2 }, right: { size: 2 } }
        }));
      } else {
        classes.forEach(() => {
          cells.push(new TableCell({
            children: [new Paragraph("")],
            borders: { top: { size: 2 }, bottom: { size: 2 }, left: { size: 2 }, right: { size: 2 } }
          }));
        });
      }

      tableRows.push(new TableRow({ children: cells }));
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: "Blank Timetable", heading: "Heading1", spacing: { after: 300 } }),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "blank_timetable.docx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        <img src="/logo.png" alt="School Logo" style={{ width: "80px", height: "auto" }} />
        <h2 style={{ margin: 0 }}>School Time-table</h2>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={exportExcel} style={{ padding: "10px" }}>Download Excel</button>
        <button onClick={exportBlankExcel} style={{ marginLeft: "10px", padding: "10px" }}>Download Blank Timetable (Excel)</button>
        <button onClick={exportWordBlank} style={{ marginLeft: "10px", padding: "10px" }}>Download Blank Timetable (Word)</button>
      </div>

      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        {/* Your existing timetable JSX remains unchanged */}
        <table style={{ borderCollapse: "collapse", width: "max-content" }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ border: "1px solid #333", padding: "8px" }}>Period</th>
              <th rowSpan={2} style={{ border: "1px solid #333", padding: "8px" }}>Time</th>
              {days.map(day => (
                <th key={day} colSpan={classes.length} style={{ border: "1px solid #333", padding: "8px" }}>{day}</th>
              ))}
            </tr>
            <tr>
              {days.map(day => classes.map(cls => (
                <th key={day + cls} style={{ border: "1px solid #333", padding: "8px" }}>{cls}</th>
              )))}
            </tr>
          </thead>
          <tbody>
            {timetable.map((row, periodIndex) => {
              const periodNumber = row.period;
              const special = specialPeriods[periodNumber];
              if(special){
                return (
                  <tr key={periodIndex}>
                    <td style={{ border: "1px solid #333", padding: "8px" }}>{row.period}</td>
                    <td style={{ border: "1px solid #333", padding: "8px" }}>{row.time}</td>
                    <td colSpan={days.length * classes.length} style={{ textAlign: "center", backgroundColor: special.color, fontWeight: "bold" }}>
                      {special.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={periodIndex}>
                  <td style={{ border: "1px solid #333", padding: "8px" }}>{row.period}</td>
                  <td style={{ border: "1px solid #333", padding: "8px" }}>
                    <input type="time" value={row.time} onChange={(e) => handleTimeChange(periodIndex, e.target.value)} />
                  </td>
                  {days.map(day => classes.map(cls => {
                    const cell = row[day][cls];
                    return (
                      <td key={day + cls + periodIndex} style={{
                        border: "1px solid #333",
                        padding: "4px",
                        minWidth: "140px",
                        backgroundColor: subjectColors[cell.subject] || "#fff",
                        transition: "all 0.2s ease",
                        position: "relative",
                        cursor: "pointer"
                      }}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
                      onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", minHeight: "55px" }}>
                          <select value={cell.subject} onChange={(e) => handleChange(periodIndex, day, cls, "subject", e.target.value)} style={{ fontSize: "13px", width: "100%" }}>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <select value={cell.teacher} onChange={(e) => handleChange(periodIndex, day, cls, "teacher", e.target.value)} style={{ fontSize: "13px", width: "100%" }}>
                            {teachers.map(t => <option key={t} value={t}>{t} ({teacherCodes[t]})</option>)}
                          </select>
                        </div>
                        <div style={{ position: "absolute", bottom: "2px", right: "4px", fontSize: "10px", color: "#333", opacity: 0.7 }}>
                          {teacherCodes[cell.teacher]}
                        </div>
                      </td>
                    );
                  }))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
