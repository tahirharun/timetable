import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const classes = [
  "YEAR 1","YEAR 2","YEAR 3","YEAR 4S","YEAR 4Z", "Year 5Q", "Year 5T",
  "Year 6P", "Year 6T", "year 7", "year 8", "year 9", "year 10", "year 11"
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
  "Ms. Esther Makona", "Mr. Nuria", "Ust. Salim", "Ms. Josphine", "Ust. Jamal", 
  "Ust. Jamal", "Ust. Musa", "Ust. Abdulhamid", "Ust. Ahmed", "Ust. Abdulhaman", 
  "Ust. Abubakar", "Ms. Zainab", "Ms. Fatma H", "Ms. Fatma" ,"Mr. Edgar", 
  "Mr. Ainein", "Mr. Omar", "Mr. Brian"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Timetable() {
  // timetable: periods -> days -> classes
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

  const exportExcel = () => {
    const rows = [];
    timetable.forEach(row => {
      days.forEach(day => {
        classes.forEach(cls => {
          rows.push({
            Day: day,
            Class: cls,
            Period: row.period,
            Time: row.time,
            Subject: row[day][cls].subject,
            Teacher: row[day][cls].teacher,
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "timetable.xlsx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        <img src="/logo.png" alt="School Logo" style={{ width: "80px", height: "auto" }} />
        <h2 style={{ margin: 0 }}>School Time-table</h2>
      </div>

      <button onClick={exportExcel} style={{ marginBottom: "20px", padding: "10px" }}>
        Download Excel
      </button>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th rowSpan={2} style={{ border: "1px solid #333", padding: "8px" }}>Period</th>
            <th rowSpan={2} style={{ border: "1px solid #333", padding: "8px" }}>Time</th>
            {days.map(day => (
              <th key={day} colSpan={classes.length} style={{ border: "1px solid #333", padding: "8px" }}>{day}</th>
            ))}
          </tr>
          <tr>
            {days.map(day => (
              classes.map(cls => (
                <th key={day + cls} style={{ border: "1px solid #333", padding: "8px" }}>{cls}</th>
              ))
            ))}
          </tr>
        </thead>
        <tbody>
          {timetable.map((row, periodIndex) => (
            <tr key={periodIndex}>
              <td style={{ border: "1px solid #333", padding: "8px" }}>{row.period}</td>
              <td style={{ border: "1px solid #333", padding: "8px" }}>
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => handleTimeChange(periodIndex, e.target.value)}
                />
              </td>
              {days.map(day => (
                classes.map(cls => (
                  <td key={day + cls + periodIndex} style={{ border: "1px solid #333", padding: "4px" }}>
                    <select
                      value={row[day][cls].subject}
                      onChange={(e) => handleChange(periodIndex, day, cls, "subject", e.target.value)}
                      style={{ marginBottom: "4px" }}
                    >
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                      value={row[day][cls].teacher}
                      onChange={(e) => handleChange(periodIndex, day, cls, "teacher", e.target.value)}
                    >
                      {teachers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                ))
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}