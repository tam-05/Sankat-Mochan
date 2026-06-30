import React, { useEffect, useState } from 'react';
import { 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Calendar,  
  Settings, 
  Zap, 
  Bot,
  Circle
} from 'lucide-react';
import {
    getTasks,
    updateTask,
    touchTasks
} from "../../services/taskService";
import styles from './Dashboard.module.css';
import TaskModal from "../../components/TaskModal/TaskModal";
import { useNavigate } from "react-router-dom";
import { generateRoadmap, regenerateRoadmap, getActivityStatus, updateActivity } from "../../services/aiService";
import { createTask } from "../../services/taskService";
import { v4 as uuidv4 } from "uuid";
import { getReminderStatus } from "../../services/reminderService";


const Dashboard: React.FC = () => {
    const navigate = useNavigate();
  const [aiInput, setAiInput] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const userName =
    localStorage.getItem("user_name") || "User";
    const [showCompleted, setShowCompleted] = useState(false);
    const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
    const [fallingBehind, setFallingBehind] = useState(false);
    const [reminder, setReminder] = useState<{
  behind: boolean;
  days: number;
  message: string;
} | null>(null);

    const handleGenerateRoadmap = async () => {

    if (!aiInput.trim()) {

        alert("Please enter a goal.");

        return;
    }

    try {

        setLoadingRoadmap(true);
const response = await generateRoadmap(aiInput);

console.log("RAW RESPONSE:", response);

console.log(typeof response.roadmap);

console.log(response.roadmap);

try {

   let json = response.roadmap.trim();

// Remove ```json
json = json.replace(/^```json\s*/i, "");

// Remove ```
json = json.replace(/```$/i, "");

const parsed = JSON.parse(json);

console.log("PARSED:", parsed);

// Convert all day-wise tasks into one array
console.log("TASKS:", parsed.tasks);

setGeneratedTasks(parsed.tasks);
}
catch(err){

    console.error("JSON ERROR:", err);

    console.log(response.roadmap);

}


    } catch (error) {

        console.error(error);

        alert("Failed to generate roadmap.");

    } finally {

        setLoadingRoadmap(false);

    }

};

const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const loadTasks = async () => {
    try {

        const activity = await getActivityStatus();
        console.log("ACTIVITY:", activity);
        setFallingBehind(activity.falling_behind);

        const data = await getTasks();
        setTasks(data);

        const reminderData = await getReminderStatus();
        setReminder(reminderData);

    } catch (error) {
        console.error(error);
    }
};
useEffect(() => {

    loadTasks();

}, []);

const handleToggle = async (task: any) => {

    try {

        await updateTask(task.id, {

            status:
                task.status === "Pending"
                    ? "Completed"
                    : "Pending"

        });
        await touchTasks();

        await updateActivity();

        await loadTasks();

    } catch (error) {

        console.error(error);

    }

};


 const stats = [

    {
        id:1,
        label:"Today's Tasks",
        value:tasks.length,
        desc:"Active tasks",
        icon:<ListTodo size={20}/>,
        color:"var(--primary)"
    },

    {
        id:2,
        label:"Completed",
        value:tasks.filter(
            task=>task.status==="Completed"
        ).length,

        desc:"Finished",

        icon:<CheckCircle2 size={20}/>,

        color:"var(--success)"
    },

    {
        id:3,
        label:"Pending",

        value:tasks.filter(
            task=>task.status==="Pending"
        ).length,

        desc:"Remaining",

        icon:<Clock size={20}/>,

        color:"var(--warning)"
    },

    {
        id:4,

        label:"Productivity",

        value:
        tasks.length===0
        ?"0%"
        :
        `${Math.round(
            tasks.filter(
                t=>t.status==="Completed"
            ).length
            /
            tasks.length
            *
            100
        )}%`,

        desc:"Completion Rate",

        icon:<TrendingUp size={20}/>,

        color:"var(--secondary-accent)"
    }

];

const pendingTasks = tasks.filter(
    task => task.status === "Pending"
);

const completedTasks = tasks.filter(
    task => task.status === "Completed"
);


const formatDate = (date: string | null) => {

    if (!date) {
        return "No due date";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};
const handleSaveRoadmap = async () => {

    try {
        const roadmapId = uuidv4();
        for (const task of generatedTasks) {

           await createTask({

    title: task.title,

    description: task.description,

    priority: task.priority,

    status: "Pending",

    due_date: null,

    roadmap_id: roadmapId,

    goal: aiInput

});
        }
        await updateActivity();

        await loadTasks();

        setGeneratedTasks([]);

        alert("Roadmap converted into tasks!");



    } catch (error) {

        console.error(error);

        alert("Failed to save tasks.");

    }

};

const handleRegenerateRoadmap = async () => {
    try {
        const response = await regenerateRoadmap();

        alert(response.message);
        await updateActivity();
        await loadTasks();

    } catch (err) {
        console.error(err);
        alert("Failed to regenerate roadmap.");
    }
};

  return (
    <div className={styles.dashboard}>
      {/* Google Fonts Import */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap');
      </style>

      <div className={styles.container}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.greeting}>
             <div className={styles.greeting}>
    <p className={styles.welcomeText}>
        Welcome 👋
    </p>

    <h1 className={styles.userName}>
        {userName}
    </h1>
</div>
              <p>Welcome back. Let's organize your day with AI precision.</p>
              <span className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className={styles.heroActions}>
              <button
    className={styles.primaryBtn}
    onClick={() => setShowTaskModal(true)}
>
                <Plus size={18} /> New Task
              </button>
        
            </div>
          </div>
          <div className={styles.heroGlow} />
        </header>

        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          {stats.map(stat => (
            <div key={stat.id} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                  {stat.icon}
                </div>
                <span className={styles.statValue}>{stat.value}</span>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statDesc}>{stat.desc}</span>
              </div>
              <div className={styles.cardHoverGlow} />
            </div>
          ))}
        </section>

        <div className={styles.mainLayout}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* AI Planner */}
            <section className={styles.aiPlanner}>
             <div className={styles.cardHeader}>
    <h2>Today's Schedule</h2>
</div>
                <div className={styles.titleGroup}>
                  <Bot className={styles.accentIcon} />
                  <h3>AI Strategic Planner</h3>
                </div>
                
                <span className={styles.badge}>Beta </span>
                
        
              <div className={styles.plannerBody}>
                <textarea 
                  placeholder="Describe your work or study goal (e.g., 'Plan a 4-week course for React 19')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className={styles.plannerInput}
                />
                <button
    className={styles.generateBtn}
    onClick={handleGenerateRoadmap}
    disabled={loadingRoadmap}
>
    <Zap size={18} />

    {loadingRoadmap
        ? "Generating..."
        : "Generate Roadmap"}

</button>


{generatedTasks.length > 0 && (
    <div className={styles.roadmapResult}>

        <h3>✨ AI Roadmap</h3>

      

       {generatedTasks.length > 0 && (

<div className={styles.aiPreview}>

    <h3>✨ AI Generated Tasks</h3>

    {generatedTasks.map((task, index) => (

        <div
            key={index}
            className={styles.aiTaskCard}
        >

            <h4>{task.title}</h4>

            <p>{task.description}</p>

            <span
                className={`${styles.priorityBadge} ${
                    styles[task.priority.toLowerCase()]
                }`}
            >
                {task.priority}
            </span>

        </div>

    ))}

    <button
        className={styles.generateBtn}
        onClick={handleSaveRoadmap}
    >
        Save All Tasks
    </button>

</div>

)}
    </div>

)}
              </div>
            </section>

           {/* Task List */}
<section className={styles.taskListCard}>

    <div className={styles.cardHeader}>
   {fallingBehind && (
    <div className={styles.reminderCard}>

        <h3>⚠️ You're Falling Behind</h3>

        <p>
            {reminder?.message ??
                "You haven't been active for over a day. Regenerate your roadmap to get back on track!"}
        </p>

        <button
            className={styles.generateBtn}
            onClick={handleRegenerateRoadmap}
        >
            🔄 Regenerate Roadmap
        </button>

    </div>
)}
        <h2>Today's Schedule</h2>

    </div>

    <div className={styles.tasksList}>

        {tasks.length === 0 ? (

            <p
                style={{
                    textAlign: "center",
                    padding: "30px",
                    opacity: 0.7
                }}
            >
                No tasks yet.
            </p>

        ) : (

            pendingTasks.map(task => (
                <div
    key={task.id}
    className={styles.taskItem}
>
<div className={styles.taskMain}>

    <button
    className={styles.checkBtn}
    onClick={() => handleToggle(task)}
>

        {task.status === "Completed" ? (

            <CheckCircle2
                className={styles.completedIcon}
            />

        ) : (

            <Circle />

        )}

    </button>

    <div className={styles.taskDetails}>

        <div className={styles.taskTop}>

            <h4 className={styles.taskName}>
                {task.title}
            </h4>

            <span
                className={`${styles.priorityBadge}
                ${styles[task.priority.toLowerCase()]}`}
            >
                {task.priority}
            </span>

        </div>

        <p className={styles.taskDescription}>
            {task.description}
        </p>

        <div className={styles.taskFooter}>

           {task.due_date ? (
    <span>
        📅 {formatDate(task.due_date)}
    </span>
) : (
    <span className={styles.noDate}>
        📅 No deadline
    </span>
)}

           <span
    className={`${styles.statusBadge} ${
        task.status === "Completed"
            ? styles.completedStatus
            : styles.pendingStatus
    }`}
>
    {task.status}
</span>
        </div>

    </div>

</div>
</div>

            ))

        )}

    </div>

    <div className={styles.completedSection}>

    <button
        className={styles.completedHeader}
        onClick={() => setShowCompleted(!showCompleted)}
    >
        Completed Tasks ({completedTasks.length})

        <span>
            {showCompleted ? "▲" : "▼"}
        </span>
    </button>

    {showCompleted && (

        <div className={styles.tasksList}>

            {completedTasks.map(task => (

                <div
                    key={task.id}
                    className={styles.taskMain}
                >

                    <button
                        className={styles.checkBtn}
                        onClick={() => handleToggle(task)}
                    >
                        <CheckCircle2
                            className={styles.completedIcon}
                        />
                    </button>

                    <div className={styles.taskDetails}>

                        <div className={styles.taskTop}>

                            <h4 className={styles.taskName}>
                                {task.title}
                            </h4>

                            <span
                                className={`${styles.priorityBadge} ${
                                    styles[task.priority.toLowerCase()]
                                }`}
                            >
                                {task.priority}
                            </span>

                        </div>

                        <div className={styles.taskFooter}>
    <span className={styles.completedStatus}>
        ✅ Completed
    </span>
</div>

                    </div>

                </div>

            ))}

        </div>

    )}

</div>

</section>
</div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <section className={styles.quickActions}>
              <h3>Quick Commands</h3>
              <div className={styles.actionGrid}>

                <button
    className={styles.actionItem}
    onClick={() => setShowTaskModal(true)}
>
    <Plus size={20} />
    <span>Task</span>
</button>
<button
    className={styles.actionItem}
    onClick={() => navigate("/events")}
>
    <Calendar size={20} />
    <span>Events</span>
</button>
                <button
    className={styles.actionItem}
    onClick={() => navigate("/settings")}
>
    <Settings size={20} />
    <span>Settings</span>
</button>
              </div>
            </section>

            {/* Quote Card */}
            <section className={styles.quoteCard}>
              <div className={styles.quoteIcon}>“</div>
              <p>The secret of getting ahead is getting started.</p>
              <span className={styles.quoteAuthor}>— Mark Twain</span>
            </section>
          </div>
        </div>
      </div>

      <TaskModal
    open={showTaskModal}
    onClose={() => setShowTaskModal(false)}
    onTaskCreated={loadTasks}
/>
    </div>
  );
};

export default Dashboard;