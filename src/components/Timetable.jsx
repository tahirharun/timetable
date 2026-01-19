import React, { useState } from "react";
import DuplicateTimetable from "./DuplicateTimetable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";

/* ===== CONSTANTS ===== */
const classes = [
  "YEAR 1","YEAR 2","YEAR 3","YEAR 4S","YEAR 4Z",
  "Year 5Q","Year 5T","Year 6P","Year 6T",
  "Year 7","Year 8","Year 9","Year 10","Year 11"
];

const subjects = [
  "Math", "English","Science", "Biology", "Chemistry", "Physics", "History", 
  "Geography", "Character", "FIQH", "Art", "PE", "Seerah", "Tawheed", 
  "IRE/SAT/SOC", "B/S", "B/S/Soc", "CHEM/GEO/LIT", "Tafsr", "Arabic", 
  "Hadith", "Islamiat", "Assembly", "Clubs", "Qu'ran", "Soclology", 
  "Litreture", "ADAAB", "KISW", "ICT", "ENG(READ)", "SKILLS", "PRACTICALS"
];

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

const teacherCodes = {};
teachers.forEach((t, i) => teacherCodes[t] = String(i + 1).padStart(3, "0"));

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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

const specialPeriods = {
  5: { label: "Break", color: "#FFD700" },
  8: { label: "Lunch", color: "#FFA500" }
};

/* ===== COMPONENT ===== */
export default function Timetable() {
  const [view, setView] = useState("original"); // original | duplicate

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

  /* ===== HANDLERS ===== */
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

  /* ===== EXPORT FUNCTIONS ===== */
  const exportExcel = () => { /* same as before */ };
  const exportBlankExcel = () => { /* same as before */ };
  const exportWordBlank = async () => { /* same as before */ };

  /* ===== DUPLICATE VIEW ===== */
  if(view === "duplicate"){
    return <DuplicateTimetable timetable={timetable} onBack={() => setView("original")} />;
  }

  /* ===== ORIGINAL TIMETABLE ===== */
  return (
    <div style={{ padding: "20px" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <img src="/logo.png" alt="School Logo" style={{ width: "80px", height: "auto" }} />
        <h2 style={{ margin: 0 }}>School Timetable</h2>
      </div>

      {/* Buttons on the LEFT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", alignItems: "flex-start" }}>
        <button onClick={exportExcel} style={{ padding: "10px 15px" }}>Download Excel</button>
        <button onClick={exportBlankExcel} style={{ padding: "10px 15px" }}>Download Blank Timetable (Excel)</button>
        <button onClick={exportWordBlank} style={{ padding: "10px 15px" }}>Download Blank Timetable (Word)</button>
        <button onClick={() => setView("duplicate")} style={{ padding: "10px 15px" }}>Open Duplicate Timetable</button>
      </div>

      {/* Timetable Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "max-content" }}>
          <thead>
            <tr>
              <th rowSpan={2}>Period</th>
              <th rowSpan={2}>Time</th>
              {days.map(day => <th key={day} colSpan={classes.length}>{day}</th>)}
            </tr>
            <tr>
              {days.map(day => classes.map(cls => <th key={day + cls}>{cls}</th>))}
            </tr>
          </thead>
          <tbody>
            {timetable.map((row, periodIndex) => {
              const special = specialPeriods[row.period];
              if(special){
                return (
                  <tr key={periodIndex}>
                    <td>{row.period}</td>
                    <td>{row.time}</td>
                    <td colSpan={days.length * classes.length} style={{ backgroundColor: special.color, textAlign: "center", fontWeight: "bold" }}>{special.label}</td>
                  </tr>
                );
              }
              return (
                <tr key={periodIndex}>
                  <td>{row.period}</td>
                  <td>
                    <input type="time" value={row.time} onChange={e => handleTimeChange(periodIndex, e.target.value)} />
                  </td>
                  {days.map(day => classes.map(cls => {
                    const cell = row[day][cls];
                    return (
                      <td key={day + cls + periodIndex} style={{ backgroundColor: subjectColors[cell.subject] || "#fff", border: "1px solid #ccc", minWidth: "140px", position: "relative" }}>
                        <select value={cell.subject} onChange={e => handleChange(periodIndex, day, cls, "subject", e.target.value)} style={{ width: "100%", fontSize: "13px" }}>
                          {subjects.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <select value={cell.teacher} onChange={e => handleChange(periodIndex, day, cls, "teacher", e.target.value)} style={{ width: "100%", fontSize: "13px" }}>
                          {teachers.map(t => <option key={t}>{t} ({teacherCodes[t]})</option>)}
                        </select>
                        <div style={{ position: "absolute", bottom: "2px", right: "4px", fontSize: "10px", opacity: 0.7 }}>{teacherCodes[cell.teacher]}</div>
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