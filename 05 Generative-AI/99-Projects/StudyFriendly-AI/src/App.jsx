import { useState, useEffect } from "react";
import "./App.css";
import { generateStudyPlan } from "./Gemini";

function App() {
  // Assignment Form
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [mood, setMood] = useState("");
  const [priority, setPriority] = useState("");

  // AI Coach
  const [studyInput, setStudyInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] =
    useState("All");

  // Local Storage
  const [assignments, setAssignments] =
    useState(() => {
      const saved =
        localStorage.getItem("assignments");

      return saved ? JSON.parse(saved) : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "assignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  // Add Assignment

  const handleAddAssignment = () => {
    if (
      !title ||
      !subject ||
      !deadline ||
      !mood ||
      !priority
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newAssignment = {
      title,
      subject,
      deadline,
      mood,
      priority,
      completed: false,
    };

    setAssignments([
      ...assignments,
      newAssignment,
    ]);

    setTitle("");
    setSubject("");
    setDeadline("");
    setMood("");
    setPriority("");
  };

  // Delete Assignment

  const handleDelete = (index) => {
    const updatedAssignments =
      assignments.filter(
        (_, i) => i !== index
      );

    setAssignments(updatedAssignments);
  };

  // Delete All Assignments

  const handleClearAll = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all assignments?"
    );

    if (confirmDelete) {
      setAssignments([]);
    }
  };

  // Complete Assignment

  const handleComplete = (index) => {
    const updatedAssignments = [...assignments];

    updatedAssignments[index].completed =
      !updatedAssignments[index].completed;

    setAssignments(updatedAssignments);
  };

  // AI Study Coach

  const handleGeneratePlan = async () => {
    if (studyInput.trim() === "") {
      alert("Please enter your study details.");
      return;
    }

    setLoading(true);

    const response =
      await generateStudyPlan(studyInput);

    setAiResponse(response);

    setLoading(false);
  };

  // Progress

  const completedTasks =
    assignments.filter(
      (item) => item.completed
    ).length;

  const pendingTasks =
    assignments.length - completedTasks;

  const progress =
    assignments.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            assignments.length) *
            100
        );

  // Assignment Countdown

  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  const upcomingAssignments =
    assignments
      .filter((item) => {
        const dueDate = new Date(
          item.deadline
        );

        dueDate.setHours(0, 0, 0, 0);

        return (
          !item.completed &&
          dueDate >= currentDate
        );
      })
      .sort(
        (a, b) =>
          new Date(a.deadline) -
          new Date(b.deadline)
      );

  // Search + Filter

  const filteredAssignments =
    assignments.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.subject
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesPriority =
        filterPriority === "All" ||
        item.priority ===
          filterPriority;

      return (
        matchesSearch &&
        matchesPriority
      );
    });

  const today =
    new Date().toLocaleDateString();

  return (
    <div className="container">

      <h1>StudyFriendly AI</h1>

      <p className="subtitle">
        Your AI Academic Survival Assistant
      </p>

      <p className="date">
        Today's Date: {today}
      </p>

      {/* Add Assignment */}

      <div className="card">

        <h2>Add New Assignment</h2>
                <label>Assignment Title</label>

        <input
          type="text"
          placeholder="Enter assignment title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <label>Subject</label>

        <select
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        >
          <option value="">
            Select Subject
          </option>

          <option>Programming</option>
          <option>Blockchain</option>
          <option>Database</option>
          <option>Physics</option>
          <option>Mathematics</option>
          <option>
            Software Engineering
          </option>
        </select>

        <label>Deadline</label>

        <input
          type="date"
          value={deadline}
          onChange={(e) =>
            setDeadline(e.target.value)
          }
        />

        <label>Study Mood</label>

        <select
          value={mood}
          onChange={(e) =>
            setMood(e.target.value)
          }
        >
          <option value="">
            Select Mood
          </option>

          <option>Motivated</option>
          <option>Tired</option>
          <option>Stressed</option>
          <option>Productive</option>
        </select>

        <label>Priority Level</label>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="">
            Select Priority
          </option>

          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          onClick={handleAddAssignment}
        >
          Add Assignment
        </button>

      </div>

      {/* Progress Tracker */}

      <div className="card">

        <h2>Progress Tracker</h2>

        <p>
          <strong>Total:</strong>{" "}
          {assignments.length}
        </p>

        <p>
          <strong>Completed:</strong>{" "}
          {completedTasks}
        </p>

        <p>
          <strong>Pending:</strong>{" "}
          {pendingTasks}
        </p>

        <br />

        <strong>
          Overall Progress
        </strong>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

        <p
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {progress}% Completed
        </p>

      </div>

      {/* Assignment Countdown */}

      <div className="card">

        <h2>
          Assignment Countdown
        </h2>

        {upcomingAssignments.length === 0 ? (

          <p>
            🎉 No upcoming assignments.
          </p>

        ) : (

          upcomingAssignments.map(
            (item, index) => {

              const dueDate =
                new Date(item.deadline);

              const difference =
                Math.ceil(
                  (dueDate - currentDate) /
                  (1000 * 60 * 60 * 24)
                );

              return (

                <div
                  key={index}
                  className="assignment-box"
                >

                  <h3>{item.title}</h3>

                  <p>
                    <strong>
                      Deadline:
                    </strong>{" "}
                    {item.deadline}
                  </p>

                  <p>

                    <strong>
                      Time Left:
                    </strong>{" "}

                    {difference === 0
                      ? "🔴 Due Today"
                      : difference === 1
                      ? "🟡 Tomorrow"
                      : `🟢 ${difference} days left`}

                  </p>

                </div>

              );

            }
          )

        )}

      </div>
            {/* Assignment List */}

      <div className="card">

        <h2>My Assignments</h2>

        <input
          type="text"
          placeholder="🔍 Search assignment..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={{ marginBottom: "15px" }}
        />

        <select
          value={filterPriority}
          onChange={(e) =>
            setFilterPriority(e.target.value)
          }
          style={{ marginBottom: "20px" }}
        >
          <option value="All">
            ⭐ All Priorities
          </option>

          <option value="High">
            🔴 High
          </option>

          <option value="Medium">
            🟡 Medium
          </option>

          <option value="Low">
            🟢 Low
          </option>

        </select>

        {filteredAssignments.length === 0 ? (

          <p>No assignments found.</p>

        ) : (

          filteredAssignments.map((item, index) => (

            <div
              className="assignment-box"
              key={index}
            >

              <h3>{item.title}</h3>

              <p>
                <strong>Subject:</strong>{" "}
                {item.subject}
              </p>

              <p>
                <strong>Deadline:</strong>{" "}
                {item.deadline}
              </p>

              <p>
                <strong>Mood:</strong>{" "}
                {item.mood}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {item.priority}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {item.completed
                  ? "✅ Completed"
                  : "⏳ Pending"}
              </p>

              <button
                onClick={() =>
                  handleComplete(index)
                }
              >
                {item.completed
                  ? "Mark as Pending"
                  : "Mark as Completed"}
              </button>

              <button
                onClick={() =>
                  handleDelete(index)
                }
                style={{
                  background: "#dc3545",
                  marginTop: "10px",
                }}
              >
                Delete Assignment
              </button>

            </div>

          ))

        )}

      </div>

      {/* Assignment Settings */}

      <div className="card">

        <h2>Assignment Settings</h2>

        <button
          onClick={handleClearAll}
          style={{
            background: "#dc3545",
          }}
        >
          🗑 Delete All Assignments
        </button>

      </div>
            {/* AI Study Coach */}

      <div className="card">

        <h2>AI Study Coach</h2>

        <textarea
          placeholder="Example: I have a Blockchain assignment due tomorrow and I can study for 3 hours today."
          value={studyInput}
          onChange={(e) =>
            setStudyInput(e.target.value)
          }
        />

        <button
          onClick={handleGeneratePlan}
        >
          Generate Study Plan
        </button>

        {loading && (

          <p
            style={{
              marginTop: "20px",
              color: "#1f3c88",
              fontWeight: "bold",
            }}
          >
            🤖 Generating your AI Study Plan...
          </p>

        )}

        {aiResponse && (

          <div className="ai-response">

            <h3>AI Response</h3>

            <p>{aiResponse}</p>

          </div>

        )}

      </div>

      {/* Footer */}

      <div className="footer">

        <h3>StudyFriendly AI</h3>

        <p>
          Developed by Khadija Afridi
        </p>

        <p>
          Powered by React • Vite • Google Gemini AI
        </p>

      </div>

    </div>
  );
}

export default App;