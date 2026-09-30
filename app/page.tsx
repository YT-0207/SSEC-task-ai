"use client";

import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

export default function Home() {
 const [activePage, setActivePage] = useState("工作台");
 const [projects, setProjects] = useState<string[]>(() => {
 
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("projects");

  return saved ? JSON.parse(saved) : [];
});
const [people, setPeople] = useState<string[]>(() => {
  if (typeof window === "undefined") return ["张三", "李四", "王五"];

  const saved = localStorage.getItem("people");

  if (!saved) {
    return ["张三", "李四", "王五"];
  }

  const savedPeople = JSON.parse(saved);

  return Array.from(
    new Set(["张三", "李四", "王五", ...savedPeople])
  );
});
const [confirmedTasks, setConfirmedTasks] = useState<string[]>(() => {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("confirmedTasks");

  return saved ? JSON.parse(saved) : [];
});
const [taskDetails, setTaskDetails] = useState<
  Record<
    string,
    {
      assignee: string;
      deadline: string;
      project?: string;
    }
  >
>(() => {
  if (typeof window === "undefined") return {};

  const saved = localStorage.getItem("taskDetails");

  return saved ? JSON.parse(saved) : {};
});
const [taskStatus, setTaskStatus] = useState<
  Record<string, string>
>(() => {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem("taskStatus");
  return saved ? JSON.parse(saved) : {};
});
const [taskPriority, setTaskPriority] = useState<Record<string,string>>(() => {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem("taskPriority");
  return saved ? JSON.parse(saved) : {};
});


const [draftTask, setDraftTask] = useState("");

const [draftTasks, setDraftTasks] = useState<
  {
    task: string;
    assignee: string;
   deadline: string;
project: string;
  }[]
>([]);

const [draftAssignee, setDraftAssignee] = useState("待指定");
const [draftDeadline, setDraftDeadline] = useState("待识别");
const [showOrganizeModal, setShowOrganizeModal] = useState(false);
  const menuItems = [
    "工作台",
    "信息收集",
    "AI 任务草稿",
    "任务中心",
    "我的任务",
    "项目",
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* 左侧导航 */}
        <aside className="w-64 border-r bg-white p-6">
          <div className="mb-10">
         <h1 className="text-2xl font-bold">SSEC-Task</h1>
            <p className="mt-1 text-sm text-gray-500">
              配管工作协同平台
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActivePage(item)}
                className={`w-full rounded-lg px-4 py-3 text-left font-medium transition ${
                  activePage === item
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* 主内容 */}
        <section className="flex-1 p-8">
         {activePage === "工作台" && (
  <Dashboard
    confirmedTasks={confirmedTasks}
    taskStatus={taskStatus}
    setActivePage={setActivePage}
    draftTask={draftTask}
    projects={projects}
    taskDetails={taskDetails}
  />
)}

        {activePage === "信息收集" && (
  <PagePlaceholder
    title="信息收集"
    setActivePage={setActivePage}
    description="在这里记录会议、聊天和工作中的重要信息。"
    draftTask={draftTask}
    setDraftTask={setDraftTask}
    draftTasks={draftTasks}
    setDraftTasks={setDraftTasks}
    draftAssignee={draftAssignee}
    setDraftAssignee={setDraftAssignee}
    draftDeadline={draftDeadline}
    setDraftDeadline={setDraftDeadline}
   people={people}
projects={projects}
  />
)}

       {activePage === "AI 任务草稿" && (
  <PagePlaceholder
    title="AI 任务草稿"
    description="AI 会把收集到的信息整理成可以执行的任务。"
    confirmedTasks={confirmedTasks}
    setConfirmedTasks={setConfirmedTasks}
    setTaskDetails={setTaskDetails}
    setTaskStatus={setTaskStatus}
      projects={projects}
    draftTask={draftTask}
    setDraftTask={setDraftTask}
    draftTasks={draftTasks}
setDraftTasks={setDraftTasks}
    draftAssignee={draftAssignee}
    setDraftAssignee={setDraftAssignee}
    draftDeadline={draftDeadline}
    setDraftDeadline={setDraftDeadline}
  />
)}
{activePage === "任务中心" && (
  <PagePlaceholder
    title="任务中心"
    description="查看和管理所有项目任务。"
    confirmedTasks={confirmedTasks}
    setConfirmedTasks={setConfirmedTasks}
    taskDetails={taskDetails}
    setTaskDetails={setTaskDetails}
    taskStatus={taskStatus}
    setTaskStatus={setTaskStatus}
  
    projects={projects}
    people={people}
  />
)}

         {activePage === "我的任务" && (
  <PagePlaceholder
    title="我的任务"
    description="这里显示分配给你的工作任务。"
    confirmedTasks={confirmedTasks}
    taskDetails={taskDetails}
      taskStatus={taskStatus}
    projects={projects}
    people={people}
    setTaskStatus={setTaskStatus}
  />
)}

          {activePage === "项目" && (
  <PagePlaceholder
    title="项目"
    description="查看和管理你的项目。"
    projects={projects}
    taskDetails={taskDetails}
    confirmedTasks={confirmedTasks}
    taskStatus={taskStatus}
    setTaskStatus={setTaskStatus}
    setTaskDetails={setTaskDetails}
    setProjects={setProjects}
    people={people}
    setPeople={setPeople}
  />

)}
        </section>
      </div>
    </main>
  );
}


/* =========================
   工作台
========================= */

function Dashboard({
  confirmedTasks,
  taskStatus,
  setActivePage,
  draftTask,
  projects,
  taskDetails,
}: {
  confirmedTasks: string[];
  taskStatus: Record<string, string>;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  draftTask: string;
  projects: string[];
  taskDetails: Record<
    string,
    {
      assignee: string;
      deadline: string;
      project?: string;
    }
  >;
}) {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return null;
}
    const totalCount = confirmedTasks.length;
    const getProjectProgress = (project: string) => {
  const projectTasks = confirmedTasks.filter(
    (task) => taskDetails[task]?.project === project
  );

  if (projectTasks.length === 0) {
    return 0;
  }

  const completedTasks = projectTasks.filter(
    (task) => (taskStatus[task] || "待处理") === "已完成"
  );

  return Math.round(
    (completedTasks.length / projectTasks.length) * 100
  );
};
    const todoCount = confirmedTasks.filter(
  (task) => (taskStatus[task] || "待处理") === "待处理"
).length;
    const doingCount = confirmedTasks.filter(
    (task) => (taskStatus[task] || "待处理") === "进行中"
  ).length;
  const doneCount = confirmedTasks.filter(
  (task) => (taskStatus[task] || "待处理") === "已完成"
).length;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">工作台</h2>
        <p className="mt-2 text-gray-500">
          欢迎回来，这里是你的项目任务总览。
        </p>
      </div>

      {/* 数据统计 */}
      <div className="grid grid-cols-4 gap-5">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">全部任务</p>
          <p className="mt-3 text-3xl font-bold">{totalCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">待处理</p>
          <p className="mt-3 text-3xl font-bold">{todoCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">进行中</p>
          <p className="mt-3 text-3xl font-bold">{doingCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">已完成</p>
          <p className="mt-3 text-3xl font-bold">{doneCount}</p>
        </div>
      </div>

      {/* AI 待审核任务 */}
      <div className="mt-8 rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">
              AI 待审核任务
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              AI 从会议、聊天和文档中提取的任务，需要负责人确认。
            </p>
          </div>

          <button
  onClick={() => setActivePage?.("AI 任务草稿")}
  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
>
  查看全部
</button>
        </div>

       <div className="mt-6 space-y-3">
  {draftTask ? (
    <button
      onClick={() => setActivePage("AI 任务草稿")}
      className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-gray-50"
    >
      <div>
        <p className="font-medium">
          {draftTask}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          来源：信息收集 · AI 提取
        </p>
      </div>

      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
        待审核
      </span>
    </button>
  ) : (
    <p className="text-sm text-gray-500">
      暂无待审核任务
    </p>
  )}
</div>
      </div>

      {/* 项目进度 */}
      <div className="mt-8 rounded-xl border bg-white p-6">
        <h3 className="text-xl font-semibold">
          项目进度
        </h3>

        <div className="mt-5 space-y-5">
          {projects.length === 0 ? (
  <p className="text-sm text-gray-500">
    暂无项目
  </p>
) : (
  projects.map((project) => (
    <ProjectProgress
      key={project}
      name={project}
      progress={getProjectProgress(project)}
    />
  ))
)}
        </div>
      </div>
    </>
  );
}


/* =========================
   项目进度
========================= */

function ProjectProgress({
  name,
  progress,
}: {
  name: string;
  progress: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{name}</span>

        <span className="text-gray-500">
          {progress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}


/* =========================
   其他页面暂时占位
========================= */

function PagePlaceholder({
  title,
  description,

  confirmedTasks,
  
  setConfirmedTasks,
  setActivePage,
  setTaskDetails,
  taskDetails,
   taskStatus,
  setTaskStatus,
  
  draftTask,
  setDraftTask,
  draftTasks,
setDraftTasks,
  draftAssignee,
  setDraftAssignee,
  draftDeadline,
  setDraftDeadline,
  projects,
setProjects,
people,
setPeople,
}: {
  title: string;
  description: string;
 
  confirmedTasks?: string[];
  setConfirmedTasks?: React.Dispatch<React.SetStateAction<string[]>>;
  people?: string[];
setPeople?: React.Dispatch<React.SetStateAction<string[]>>;
  setActivePage?: React.Dispatch<React.SetStateAction<string>>;
  setTaskDetails?: React.Dispatch<
    React.SetStateAction<
     Record<
  string,
  {
    assignee: string;
    deadline: string;
    project?: string;
  }
>
    >
  >;
  taskDetails?: Record<
  string,
  {
    assignee: string;
    deadline: string;
    project?: string;
  }
>;
  taskStatus?: Record<string, string>;
   setTaskStatus?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  draftTask?: string;
  setDraftTask?: React.Dispatch<React.SetStateAction<string>>;
   draftTasks?: {
    task: string;
    assignee: string;
    deadline: string;
    project: string;
  }[];
  setDraftTasks?: React.Dispatch<
  React.SetStateAction<
    {
      task: string;
      assignee: string;
      deadline: string;
      project: string;
    }[]
  >
>;
  draftAssignee?: string;
  setDraftAssignee?: React.Dispatch<React.SetStateAction<string>>;
  draftDeadline?: string;
  setDraftDeadline?: React.Dispatch<React.SetStateAction<string>>;
  projects?: string[];
  setProjects?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
 const [inputText, setInputText] = useState("");
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [openedProject, setOpenedProject] = useState("");
 const [draftProject, setDraftProject] = useState("未指定");
const [showOrganizeModal, setShowOrganizeModal] = useState(false);



const [latestDraftConfirmed, setLatestDraftConfirmed] = useState(false);
const [taskFilter, setTaskFilter] = useState("全部");
const [taskAssigneeFilter, setTaskAssigneeFilter] = useState("全部");
const [taskSearch, setTaskSearch] = useState("");
const [editingTask, setEditingTask] = useState("");
const [editingTaskText, setEditingTaskText] = useState("");
const saveEditedTask = () => {
  if (!editingTask || !editingTaskText.trim()) return;

  const newTaskText = editingTaskText.trim();

  // 1. 更新任务列表
  const newTasks = Array.from(
    new Set(
      (confirmedTasks || []).map((item) =>
        item === editingTask ? newTaskText : item
      )
    )
  );

  setConfirmedTasks?.(newTasks);

  localStorage.setItem(
    "confirmedTasks",
    JSON.stringify(newTasks)
  );

  // 2. 同步更新任务详情
  setTaskDetails?.((details) => {
    if (!details?.[editingTask]) {
      return details;
    }

    const newDetails = {
      ...details,
      [newTaskText]: details[editingTask],
    };

    delete newDetails[editingTask];

    localStorage.setItem(
      "taskDetails",
      JSON.stringify(newDetails)
    );

    return newDetails;
  });

  // 3. 同步更新任务状态
  setTaskStatus?.((statuses) => {
    if (!statuses?.[editingTask]) {
      return statuses;
    }

    const newStatuses = {
      ...statuses,
      [newTaskText]: statuses[editingTask],
    };

    delete newStatuses[editingTask];

    localStorage.setItem(
      "taskStatus",
      JSON.stringify(newStatuses)
    );

    return newStatuses;
  });

  // 4. 退出编辑状态
  setEditingTask("");
  setEditingTaskText("");
};
const [taskProjectFilter, setTaskProjectFilter] = useState("全部");
const [myTaskFilter, setMyTaskFilter] = useState("全部");
const [myTaskSearch, setMyTaskSearch] = useState("");
const [myTaskProjectFilter, setMyTaskProjectFilter] = useState("全部");
const [currentUser, setCurrentUser] = useState("张三");
const [taskNotes, setTaskNotes] = useState<Record<string, string>>(() => {
  if (typeof window === "undefined") return {};

  const saved = localStorage.getItem("taskNotes");

  return saved ? JSON.parse(saved) : {};
});
  if (title === "信息收集") {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold">信息收集</h2>

          <p className="mt-2 text-gray-500">
            把会议记录、聊天内容和工作笔记放进来。
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-xl font-semibold">
            收集新的工作信息
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            可以直接粘贴会议记录、聊天记录或者你的工作笔记。
          </p>

          <textarea
            value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  placeholder="例如：周五之前完成第一版设计，张三负责整理平面图，李四负责检查材料……"
  className="mt-5 min-h-[220px] w-full resize-none rounded-lg border p-4 text-sm outline-none focus:border-black"
/>
<div className="mt-4">
  <label className="inline-flex cursor-pointer items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
    📎 上传图片 / PDF
    <input
  type="file"
  accept="image/*,.pdf"
  className="hidden"
onChange={async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setSelectedFile(file);

  // 如果是 PDF
  if (file.type === "application/pdf") {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log("PDF文字识别结果：", data.text);

    setInputText(data.text || "");

    return;
  }

  // 如果是图片
  const worker = await createWorker("chi_sim");

  const result = await worker.recognize(file);

  console.log("OCR识别结果：", result.data.text);

  setInputText(result.data.text);

  await worker.terminate();
}}
/>
  </label>
</div>
<div className="mt-2 text-sm text-gray-500">
  {selectedFile && `已选择：${selectedFile.name}`}
</div>
          <div className="mt-4 flex justify-end">
         <button
  onClick={() => {
  if (!inputText.trim()) {
    alert("请先输入工作信息！");
    return;
  }

  const text = inputText.trim();

// 按句号、中文句号、换行拆分多个任务

  const taskTexts = text
  .split(/[\n；;]/)
  .map((item) => item.trim())
  .filter(Boolean);

const parsedTasks = taskTexts.flatMap((item) => {
 const results: {
  task: string;
  assignee: string;
  deadline: string;
  project: string;
}[] = [];

  // 1. 先从当前句子中识别项目成员
  const detectedPerson =
  (people || []).find((person) =>
    new RegExp(`^${person}负责`).test(item.trim())
  ) ||
  (people || []).find((person) =>
    new RegExp(`${person}负责`).test(item)
  ) ||
  (people || []).find((person) =>
    item.includes(person)
  );

const assignee = detectedPerson || "待指定";

// 2. 识别截止时间

let deadline = "待识别";

// 今天
if (item.includes("今天")) {
  deadline = "今天";

// 明天
} else if (item.includes("明天")) {
  deadline = "明天";

// 下周一
} else if (item.includes("下周一")) {
  deadline = "下周一";

// 周一
} else if (item.includes("周一")) {

  deadline = "周一";

// 周二
} else if (item.includes("周二")) {

  deadline = "周二";

// 周三
} else if (item.includes("周三")) {

  deadline = "周三";

// 周四
} else if (item.includes("周四")) {

  deadline = "周四";

// 周五
} else if (item.includes("周五")) {

  deadline = "周五";

// 周六
} else if (item.includes("周六")) {

  deadline = "周六";

// 周日
} else if (item.includes("周日")) {

  deadline = "周日";

// 具体日期：9月30日、10月15日、2026年10月20日
} else {
  const dateMatch = item.match(
    /(\d{4}年)?(\d{1,2})月(\d{1,2})日/
  );

  if (dateMatch) {
    const year = dateMatch[1];
    const month = dateMatch[2];
    const day = dateMatch[3];

    deadline = year
      ? `${year}${month}月${day}日`
      : `${month}月${day}日`;

  } else {

    // 具体日期：9/30、10/12
    const slashMatch = item.match(
      /(\d{1,2})\/(\d{1,2})/
    );

    if (slashMatch) {
      const month = slashMatch[1];
      const day = slashMatch[2];

      deadline = `${month}月${day}日`;

    } else {

      // 本月30日、本月30日前
      const thisMonthMatch = item.match(
        /本月(\d{1,2})日?/
      );

      if (thisMonthMatch) {
        const day = thisMonthMatch[1];

        deadline = `本月${day}日`;
      }
    }
  }
}

console.log("【日期测试】原始任务：", item);
console.log("【日期测试】识别结果：", deadline);
  // 3. 识别所属项目
  const detectedProject =
    (projects || []).find((project) =>
      item.includes(project)
    ) || "未指定";
    console.log("当前任务：", item);
console.log("当前项目列表：", projects);
console.log("识别到的项目：", detectedProject);

  // 4. 清理项目名称和负责人姓名
let task = item;

if (detectedProject !== "未指定") {
  task = task.replace(detectedProject, "");
}

  if (detectedPerson) {
  task = task.replace(detectedPerson, "");
  task = task.replace(/负责/g, "");
}

  // 5. 删除句子前面的会议/工作安排背景
  task = task
    .replace(/^.*?项目会议确定[，,：:]?\s*/, "")
    .replace(/^.*?工作安排[：:，,]?\s*/, "")
    .trim();

  // 6. 删除“负责”开头
  task = task
    .replace(/^负责/, "")
    .trim();

 // 7. 删除截止时间相关表达
task = task
  .replace(/下周一之前/g, "")
  .replace(/下周一前/g, "")
  .replace(/下周一/g, "")
  .replace(/周五之前/g, "")
  .replace(/周五前/g, "")
  .replace(/周五/g, "")
  .replace(/明天之前/g, "")
  .replace(/明天前/g, "")
  .replace(/明天/g, "")
  .replace(/今天之前/g, "")
  .replace(/今天前/g, "")
  .replace(/今天的/g, "")
  .replace(/今天/g, "")
.replace(/(?:\d{4}年)?\d{1,2}月\d{1,2}日之前/g, "")
.replace(/(?:\d{4}年)?\d{1,2}月\d{1,2}日前/g, "")
.replace(/(?:\d{4}年)?\d{1,2}月\d{1,2}日/g, "")
.replace(/\d{1,2}\/\d{1,2}之前/g, "")
.replace(/\d{1,2}\/\d{1,2}前/g, "")
.replace(/\d{1,2}\/\d{1,2}/g, "")
.replace(/本月\d{1,2}日之前/g, "")
.replace(/本月\d{1,2}日前/g, "")
.replace(/本月\d{1,2}日?/g, "")
.replace(/之前/g, "")
.replace(/前/g, "");

// 删除具体日期
// 2026年10月20日
// 10月20日
// 9/30
// 10/12
// 本月30日
task = task
  .replace(/(?:\d{4}年)?\d{1,2}月\d{1,2}日/g, "")
  .replace(/\d{1,2}\/\d{1,2}/g, "")
  .replace(/本月\d{1,2}日?/g, "");

  // 8. 删除截止时间后的附加动作
  task = task
    .replace(/并提交/g, "")
    .replace(/提交/g, "")
    .replace(/完成/g, "")
    .replace(/，后发到项目群/g, "")
    .replace(/后发到项目群/g, "")
    .trim();
  // 9. 清理多余标点和空格
task = task
  .replace(/^[，,；;。！？：:\s]+/, "")
  .replace(/[，,；;。！？：:\s]+$/, "")
  .trim();
  console.log("最终任务文字：", task);
 results.push({
  task,
  assignee,
  deadline,
  project: detectedProject,
});

  return results;
});

// 保存 AI 解析出的多条任务
  console.log("最终解析任务：", parsedTasks);
  setDraftTasks?.(parsedTasks);
console.log("【最终日期测试】第一条截止时间：", parsedTasks[0]?.deadline);
  // 同时保留第一条任务到原来的变量
  // 兼容原来的单任务显示逻辑
  if (parsedTasks.length > 0) {
    setDraftTask?.(parsedTasks[0].task);
    setDraftAssignee?.(parsedTasks[0].assignee);
    setDraftDeadline?.(parsedTasks[0].deadline);
  }

  setShowOrganizeModal(true);
}}
  className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
>
  AI 整理
</button>
          </div>
        </div>
{showOrganizeModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            AI 整理结果
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            AI 已从你输入的信息中提取出以下任务
          </p>
        </div>

        <button
          onClick={() => setShowOrganizeModal(false)}
          className="text-xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="mt-6 space-y-4">

  {draftTasks && draftTasks.length > 0 ? (
    draftTasks.map((item, index) => (
      <div
        key={index}
        className="rounded-xl border bg-gray-50 p-4"
      >
        <p className="text-xs text-gray-400">
          任务 {index + 1}
        </p>

        <p className="mt-1 text-base font-medium">
          {item.task}
        </p>

       <div className="mt-3 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400">
              负责人
            </p>
            <p className="mt-1 text-sm font-medium">
              {item.assignee}
            </p>
          </div>
          <div>
  <p className="text-xs text-gray-400">
    所属项目
  </p>
  <p className="mt-1 text-sm font-medium">
    {item.project || "未指定"}
  </p>
</div>

          <div>
            <p className="text-xs text-gray-400">
              截止时间
            </p>
            <p className="mt-1 text-sm font-medium">
              {item.deadline}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="rounded-xl border bg-gray-50 p-4">
      <p className="text-xs text-gray-400">
        任务
      </p>

      <p className="mt-1 text-base font-medium">
        {draftTask}
      </p>
    </div>
  )}

        
      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => setShowOrganizeModal(false)}
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          关闭
        </button>

        <button
  onClick={() => {
    // 把 AI 拆解出来的任务保存下来
    draftTasks?.forEach((item) => {
      setConfirmedTasks?.((tasks) => {
        if (tasks.includes(item.task)) {
          return tasks;
        }

        const newTasks = [...tasks, item.task];

        localStorage.setItem(
          "confirmedTasks",
          JSON.stringify(newTasks)
        );

        return newTasks;
      });

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [item.task]: {
  assignee: item.assignee,
  deadline: item.deadline,
  project: item.project || "未指定",
},
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });

      setTaskStatus?.((statuses) => {
        const newStatuses = {
          ...statuses,
          [item.task]: "待处理",
        };

        localStorage.setItem(
          "taskStatus",
          JSON.stringify(newStatuses)
        );

        return newStatuses;
      });
    });

    setShowOrganizeModal(false);
    setActivePage?.("AI 任务草稿");
  }}
  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
>
  确认
</button>

      </div>
    </div>
  </div>
)}
        <div className="mt-8 rounded-xl border bg-white p-6">
          <h3 className="text-xl font-semibold">
            最近收集的信息
          </h3>

          <div className="mt-5 space-y-3">
            <p className="text-xs text-red-500">
 调试数据：{JSON.stringify(taskDetails)}
</p>
            <div className="rounded-lg border p-4">
              <p className="font-medium">周一项目会议</p>
              <p className="mt-1 text-sm text-gray-500">
                项目方案讨论及任务安排
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="font-medium">项目群聊天记录</p>
              <p className="mt-1 text-sm text-gray-500">
                本周工作进度和待办事项
              </p>
            </div>
          </div>
        </div>
      </div>
     );
  }

  if (title === "AI 任务草稿") {
  console.log(
    "AI草稿页面收到的draftTasks：",
    JSON.stringify(draftTasks, null, 2)
  );

  return (
    <div>
      {/* 你原来的代码 */}

      <div className="space-y-4">
        {draftTasks && draftTasks.length > 0 && (
          <div className="mb-5 rounded-xl border bg-white p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">
          AI 最新草稿
        </h3>

        <div className="mt-4">
  <p className="text-sm text-gray-500">
    任务内容
  </p>

  <div className="mt-2 space-y-2">
  {draftTasks.map((item, index) => (
    <div
      key={index}
      className="rounded-lg border bg-white p-3"
    >
      <p className="text-sm font-medium text-gray-700">
        {item.task}
      </p>

     <div className="mt-2 flex gap-6 text-xs text-gray-500">
  <span>负责人：{item.assignee}</span>
  <span>截止时间：{item.deadline}</span>
  <span>所属项目：{item.project || "未指定"}</span>
</div>
    </div>
  ))}
</div>

 
</div>
      </div>

    <button
onClick={() => {
 

  draftTasks?.forEach((item) => {
  setConfirmedTasks?.((tasks) => {
    const newTasks = tasks.includes(item.task)
      ? tasks
      : [...tasks, item.task];

    localStorage.setItem(
      "confirmedTasks",
      JSON.stringify(newTasks)
    );

    return newTasks;
  });
});

   draftTasks?.forEach((item) => {
  setTaskDetails?.((details) => {
    const newDetails = {
      ...details,
      [item.task]: {
        assignee: item.assignee || "待指定",
        deadline: item.deadline || "待识别",
       project: item.project || "未指定",
      },
    };

    localStorage.setItem(
      "taskDetails",
      JSON.stringify(newDetails)
    );

    return newDetails;
  });
});
draftTasks?.forEach((item) => {
  setTaskStatus?.((statuses) => {
    const newStatuses = {
      ...statuses,
      [item.task]: "待处理",
    };

    localStorage.setItem(
      "taskStatus",
      JSON.stringify(newStatuses)
    );

    return newStatuses;
  });
});
setLatestDraftConfirmed(true);
setDraftTask?.("");
setDraftAssignee?.("待指定");
setDraftDeadline?.("待识别");
setActivePage?.("工作台");
  }}
  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
>
  确认任务
</button>
    </div>
  </div>
)}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  完成第一版设计
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  根据周一项目会议内容完成第一版设计方案。
                </p>
              </div>

              <span
  className={`rounded-full px-3 py-1 text-xs font-medium ${
    confirmedTasks?.includes("完成第一版设计")
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {confirmedTasks?.includes("完成第一版设计")
    ? "已确认"
    : "待审核"}
</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400">
                  负责人
                </p>
                <p className="mt-1 text-sm font-medium">
                  张三
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  截止时间
                </p>
                <p className="mt-1 text-sm font-medium">
                  周五
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  来源
                </p>
                <p className="mt-1 text-sm font-medium">
                  周一项目会议
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-lg border px-4 py-2 text-sm font-medium">
                编辑
              </button>

             <button
  onClick={() => {
    draftTasks?.forEach((item) => {
      setConfirmedTasks?.((tasks) => {
        if (tasks.includes(item.task)) {
          return tasks;
        }

        const newTasks = [...tasks, item.task];

        localStorage.setItem(
          "confirmedTasks",
          JSON.stringify(newTasks)
        );

        return newTasks;
      });
setTaskDetails?.((details) => {
  const newDetails = {
    ...details,
    [item.task]: {
  assignee: item.assignee,
  deadline: item.deadline,
  project: item.project || "未指定",
},
  };

  localStorage.setItem(
    "taskDetails",
    JSON.stringify(newDetails)
  );

  return newDetails;
});
      setTaskStatus?.((statuses) => {
        const newStatuses = {
          ...statuses,
          [item.task]: "待处理",
        };

        localStorage.setItem(
          "taskStatus",
          JSON.stringify(newStatuses)
        );

        return newStatuses;
      });
    });

    alert("任务已确认！");
  }}
  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
>
  确认任务
</button>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  检查材料清单
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  检查项目所需材料，并确认是否存在遗漏。
                </p>
              </div>

             <span
  className={`rounded-full px-3 py-1 text-xs font-medium ${
    confirmedTasks?.includes("检查材料清单")
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {confirmedTasks?.includes("检查材料清单")
    ? "已确认"
    : "待审核"}
</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400">
                  负责人
                </p>
                <p className="mt-1 text-sm font-medium">
                  李四
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  截止时间
                </p>
                <p className="mt-1 text-sm font-medium">
                  下周一
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  来源
                </p>
                <p className="mt-1 text-sm font-medium">
                  项目群聊天记录
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
  onClick={() => {
  setConfirmedTasks?.((tasks) => {
    const newTasks = tasks.includes("检查材料清单")
      ? tasks
      : [...tasks, "检查材料清单"];

    localStorage.setItem(
      "confirmedTasks",
      JSON.stringify(newTasks)
    );

    return newTasks;
  });

  setTaskDetails?.((details) => {
    const newDetails = {
      ...details,
      ["检查材料清单"]: {
        assignee: "李四",
        deadline: "下周一",
      },
    };

    localStorage.setItem(
      "taskDetails",
      JSON.stringify(newDetails)
    );

    return newDetails;
  });

  setTaskStatus?.((statuses) => {
    const newStatuses = {
      ...statuses,
      ["检查材料清单"]: "待处理",
    };

    localStorage.setItem(
      "taskStatus",
      JSON.stringify(newStatuses)
    );

    return newStatuses;
  });

  alert("任务已确认！");
}}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
              >
                确认任务
              </button>

          
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (title === "我的任务") {
 

  const myTasks =
  confirmedTasks?.filter(
    (task) => taskDetails?.[task]?.assignee === currentUser
  ) || [];

const myTodoCount = myTasks.filter(
  (task) =>
    (taskStatus?.[task] || "待处理") === "待处理"
).length;

const myDoingCount = myTasks.filter(
  (task) => (taskStatus?.[task] || "待处理") === "进行中"
).length;

const myDoneCount = myTasks.filter(
  (task) => (taskStatus?.[task] || "待处理") === "已完成"
).length;


const filteredMyTasks = myTasks.filter((task) => {
  const statusMatch =
    myTaskFilter === "全部" ||
    (taskStatus?.[task] || "待处理") === myTaskFilter;

  const projectMatch =
    myTaskProjectFilter === "全部" ||
    (taskDetails?.[task]?.project || "未指定") ===
      myTaskProjectFilter;

  const searchMatch =
    myTaskSearch.trim() === "" ||
    task.toLowerCase().includes(myTaskSearch.trim().toLowerCase());

  return statusMatch && projectMatch && searchMatch;
});
console.log("当前用户：", currentUser);
console.log("已确认任务：", confirmedTasks);
console.log("任务详情：", taskDetails);
console.log("当前项目：", projects);
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          我的任务
        </h2>

        <p className="mt-2 text-gray-500">
          这里显示分配给你的工作任务。
        </p>
        <div className="mt-3 flex items-center gap-4">
          <input
  type="text"
  value={myTaskSearch}
  onChange={(e) => setMyTaskSearch(e.target.value)}
  placeholder="搜索我的任务……"
  className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-black"
/>
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-500">
      当前用户：
    </span>

    <select
      value={currentUser}
      onChange={(e) => {
        setCurrentUser(e.target.value);
      }}
      className="rounded-lg border px-3 py-1.5 text-sm"
    >
<option value="待指定">待指定</option>

{(people || []).map((person) => (
  <option key={person} value={person}>
    {person}
  </option>
))}
    </select>
  </div>

  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-500">
      项目：
    </span>

    <select
      value={myTaskProjectFilter}
      onChange={(e) => {
        setMyTaskProjectFilter(e.target.value);
      }}
      className="rounded-lg border px-3 py-1.5 text-sm"
    >
      <option value="全部">全部项目</option>
      <option value="未指定">未指定项目</option>

      {(projects || []).map((project) => (
        <option key={project} value={project}>
          {project}
        </option>
      ))}
    </select>
  </div>
</div>

      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div
  onClick={() =>
    setMyTaskFilter(
      myTaskFilter === "待处理" ? "全部" : "待处理"
    )
  }
  className={`cursor-pointer rounded-xl border bg-white p-5 ${
    myTaskFilter === "待处理"
      ? "ring-2 ring-gray-400"
      : ""
  }`}
>
  <p className="text-sm text-gray-500">待处理</p>
  <p className="mt-2 text-3xl font-bold">{myTodoCount}</p>
</div>

<div
  onClick={() =>
    setMyTaskFilter(
      myTaskFilter === "进行中" ? "全部" : "进行中"
    )
  }
  className={`cursor-pointer rounded-xl border bg-white p-5 ${
    myTaskFilter === "进行中"
      ? "ring-2 ring-gray-400"
      : ""
  }`}
>
  <p className="text-sm text-gray-500">进行中</p>
  <p className="mt-2 text-3xl font-bold">{myDoingCount}</p>
</div>

<div
  onClick={() =>
    setMyTaskFilter(
      myTaskFilter === "已完成" ? "全部" : "已完成"
    )
  }
  className={`cursor-pointer rounded-xl border bg-white p-5 ${
    myTaskFilter === "已完成"
      ? "ring-2 ring-gray-400"
      : ""
  }`}
>
  <p className="text-sm text-gray-500">已完成</p>
  <p className="mt-2 text-3xl font-bold">{myDoneCount}</p>
</div>
</div>

<div className="rounded-xl border bg-white p-6">
        <h3 className="text-xl font-semibold">
          分配给我的任务
        </h3>

        <div className="mt-5 space-y-3">
          {myTasks.length > 0 ? (
           filteredMyTasks.map((task, index) => (
  <div
  key={index}
  className={`rounded-lg border p-5 ${
   (taskStatus?.[task] || "待处理")=== "已完成"
      ? "bg-gray-50 opacity-60"
      : "bg-white"
  }`}
>
     
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">
                      {task}
                    </p>

                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p>
                        负责人：
                        {taskDetails?.[task]?.assignee || "待指定"}
                      </p>

                       <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p>
                        负责人：
                        {taskDetails?.[task]?.assignee || "待指定"}
                      </p>

                     <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
  <span>截止时间：</span>

  <select
    value={taskDetails?.[task]?.deadline || "待识别"}
    onChange={(e) => {
      const newDeadline = e.target.value;

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [task]: {
            ...details[task],
            deadline: newDeadline,
          },
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });
    }}
    className="rounded border px-2 py-1 text-xs"
  >
    <option value="待识别">待识别</option>
    <option value="今天">今天</option>
    <option value="明天">明天</option>
    <option value="周五">周五</option>
    <option value="下周一">下周一</option>
  </select>
</div>
<div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
  <span>所属项目：</span>

  <select
    value={taskDetails?.[task]?.project || "未指定"}
    onChange={(e) => {
      const newProject = e.target.value;

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [task]: {
            ...details[task],
            project: newProject,
          },
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });
    }}
    className="rounded border px-2 py-1 text-xs"
  >
    <option value="未指定">未指定</option>

    {(projects || []).map((project) => (
      <option key={project} value={project}>
        {project}
      </option>
    ))}
  </select>
</div>
<div className="mt-2">
  <span className="text-xs text-gray-500">
    任务备注：
  </span>

  <textarea
  value={taskNotes?.[task] || ""}
  onChange={(e) => {
    const newNote = e.target.value;

    setTaskNotes?.((notes) => {
      const newNotes = {
        ...notes,
        [task]: newNote,
      };

      localStorage.setItem(
        "taskNotes",
        JSON.stringify(newNotes)
      );

      return newNotes;
    });
  }}
  placeholder="可以填写任务补充说明……"
  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-black"
  rows={2}
/>
</div>
<div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
  <span>
    状态：{taskStatus?.[task] || "待处理"}
  </span>

  {(taskStatus?.[task] || "待处理") !== "已完成" && (
    <button
      onClick={() => {
        const currentStatus =
          taskStatus?.[task] || "待处理";

        const newStatus =
          currentStatus === "进行中"
            ? "已完成"
            : "进行中";

        const newStatuses = {
          ...taskStatus,
          [task]: newStatus,
        };

        setTaskStatus?.(newStatuses);

        localStorage.setItem(
          "taskStatus",
          JSON.stringify(newStatuses)
        );
      }}
      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
    >
      {(taskStatus?.[task] || "待处理") === "进行中"
        ? "完成任务"
        : "开始任务"}
    </button>
  )}
</div>

                     
                    </div>

                    </div>
                  </div>

                  {(taskStatus?.[task] || "待处理") !== "已完成" && (
  <button
    onClick={() => {
 const current =
  taskStatus?.[task] || "待处理";

  const newStatus =
    current === "进行中"
      ? "已完成"
      : "进行中";

  

  setTaskStatus?.((statuses) => {
    const newStatuses = {
      ...statuses,
      [task]: newStatus,
    };

    localStorage.setItem(
      "taskStatus",
      JSON.stringify(newStatuses)
    );

    return newStatuses;
  });
}}
    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
  >
 {(taskStatus?.[task] || "待处理") === "进行中"
  ? "完成任务"
  : "开始任务"}
  </button>
)}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
              暂时没有分配给你的任务
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 if (title === "任务中心") {

  const allTasks = confirmedTasks || [];
const filteredTasks = allTasks.filter((task) => {
  const statusMatch =
    taskFilter === "全部" ||
    (taskStatus?.[task] || "待处理") === taskFilter;

  const projectMatch =
    taskProjectFilter === "全部" ||
    (taskDetails?.[task]?.project || "未指定") === taskProjectFilter;

  const searchMatch =
  taskSearch.trim() === "" ||
  task.toLowerCase().includes(taskSearch.trim().toLowerCase());

const assigneeMatch =
  taskAssigneeFilter === "全部" ||
  (taskDetails?.[task]?.assignee || "待指定") === taskAssigneeFilter;

return statusMatch && projectMatch && searchMatch && assigneeMatch;
});

 const todoCount = allTasks.filter(
  (task) => (taskStatus?.[task] || "待处理") === "待处理"
).length;

 const doingCount = allTasks.filter(
  (task) => (taskStatus?.[task] || "待处理") === "进行中"
).length;

 const doneCount = allTasks.filter(
  (task) => (taskStatus?.[task] || "待处理") === "已完成"
).length;
  const totalCount = allTasks.length;

const progressPercent =
  totalCount === 0
    ? 0
    : Math.round((doneCount / totalCount) * 100);

 return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-4">
  <div
  onClick={() =>
    setTaskFilter(
      taskFilter === "待处理" ? "全部" : "待处理"
    )
  }
  className={`cursor-pointer rounded-xl border bg-white p-5 ${
    taskFilter === "待处理"
      ? "ring-2 ring-gray-400"
      : ""
  }`}
>
  <p className="text-sm text-gray-500">待处理</p>
  <p className="mt-2 text-3xl font-bold">{todoCount}</p>
</div>

  <div
  onClick={() =>
    setTaskFilter(
      taskFilter === "进行中" ? "全部" : "进行中"
    )
  }
  className={`cursor-pointer rounded-xl border bg-white p-5 ${
    taskFilter === "进行中"
      ? "ring-2 ring-gray-400"
      : ""
  }`}
>
  <p className="text-sm text-gray-500">进行中</p>
  <p className="mt-2 text-3xl font-bold">{doingCount}</p>
</div>

  <div
  onClick={() =>
    setTaskFilter(
      taskFilter === "已完成" ? "全部" : "已完成"
    )
  }
  className={`cursor-pointer rounded-xl border bg-white p-5 ${
    taskFilter === "已完成"
      ? "ring-2 ring-gray-400"
      : ""
  }`}
>
  <p className="text-sm text-gray-500">已完成</p>
  <p className="mt-2 text-3xl font-bold">{doneCount}</p>
</div>
</div>

      <div>
        <div className="mb-8">
        <h2 className="text-3xl font-bold">
          任务中心
        </h2>

        <p className="mt-2 text-gray-500">
          查看和管理所有项目任务。
        </p>
       </div>

      <div className="mb-8 rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
  全部任务完成度
</p>

            <p className="mt-1 text-2xl font-bold">
              {progressPercent}%
            </p>
          </div>

          <p className="text-sm text-gray-500">
            {doneCount} / {totalCount} 个任务已完成
          </p>
        </div>

        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-800 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-semibold">
      已确认任务
    </h3>
<input
  type="text"
  value={taskSearch}
  onChange={(e) => setTaskSearch(e.target.value)}
  placeholder="搜索任务……"
  className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
/>
<select
  value={taskFilter}
  onChange={(e) => setTaskFilter(e.target.value)}
  className="rounded-lg border px-3 py-2 text-sm"
>
  <option value="全部">全部状态</option>
  <option value="待处理">待处理</option>
  <option value="进行中">进行中</option>
  <option value="已完成">已完成</option>
</select>
<select
  value={taskAssigneeFilter}
  onChange={(e) => setTaskAssigneeFilter(e.target.value)}
  className="rounded-lg border px-3 py-2 text-sm"
>
  <option value="全部">全部负责人</option>
  <option value="待指定">待指定</option>

  {(people || []).map((person) => (
    <option key={person} value={person}>
      {person}
    </option>
  ))}
</select>
    <select
      value={taskProjectFilter}
      onChange={(e) => setTaskProjectFilter(e.target.value)}
      className="rounded-lg border px-3 py-2 text-sm"
    >
      <option value="全部">全部项目</option>
      <option value="未指定">未指定项目</option>

      {(projects || []).map((project) => (
        <option key={project} value={project}>
          {project}
        </option>
      ))}
    </select>
  </div>

        <div className="mt-5 space-y-3">
         {filteredTasks && filteredTasks.length > 0 ? (
  filteredTasks.map((task, index) => {
            const currentStatus =
  taskStatus?.[task] || "待处理";

              return (
                <div
  key={index}
  className="rounded-lg border bg-white p-5"
>
                  <div className="flex items-center justify-between">
                    <div>
                     {editingTask === task ? (
  <input
  type="text"
  value={editingTaskText}
  onChange={(e) => setEditingTaskText(e.target.value)}
  className="w-full rounded-lg border px-3 py-2 text-sm"
/>

) : (
 <p className="text-lg font-medium">
  {task}
</p>
)}

<div className="mt-2 flex gap-2">
  <button
    onClick={() => {
      setEditingTask(task);
      setEditingTaskText(task);
    }}
    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
  >
    编辑任务
  </button>

  {editingTask === task && (
  <>
    <button
      onClick={saveEditedTask}
      className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
    >
      保存修改
    </button>

    <button
      onClick={() => {
        setEditingTask("");
        setEditingTaskText("");
      }}
      className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
    >
      取消
    </button>
  </>
)}
</div>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
  <span>负责人：</span>

 <select
  value={taskDetails?.[task]?.assignee || "待指定"}
  onChange={(e) => {
    const newAssignee = e.target.value;

    setTaskDetails?.((details) => {
      const newDetails = {
        ...details,
        [task]: {
          ...details[task],
          assignee: newAssignee,
        },
      };

      localStorage.setItem(
        "taskDetails",
        JSON.stringify(newDetails)
      );

      return newDetails;
    });
  }}
  className="rounded border px-2 py-1 text-sm"
>
  <option value="待指定">待指定</option>

  {(people || []).map((person) => (
    <option key={person} value={person}>
      {person}
    </option>
  ))}
</select>
</div>

                       <div className="flex items-center gap-2">
  <span>截止时间：</span>

  <select
    value={taskDetails?.[task]?.deadline || "待识别"}
    onChange={(e) => {
      const newDeadline = e.target.value;

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [task]: {
            ...details[task],
            deadline: newDeadline,
          },
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });
    }}
    className="rounded border px-2 py-1 text-sm"
  >
    <option value="待识别">待识别</option>
    <option value="今天">今天</option>
    <option value="明天">明天</option>
    <option value="周五">周五</option>
    <option value="下周一">下周一</option>
  </select>
</div>
<div className="flex items-center gap-2">
  <span>所属项目：</span>

  <select
    value={taskDetails?.[task]?.project || "未指定"}
    onChange={(e) => {
      const newProject = e.target.value;

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [task]: {
            ...details[task],
            project: newProject,
          },
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });
    }}
    className="rounded border px-2 py-1 text-sm"
  >
    <option value="未指定">未指定</option>

    {(projects || []).map((project) => (
      <option key={project} value={project}>
        {project}
      </option>
    ))}
  </select>
</div>
<div className="flex items-center gap-2">
  <span>备注：</span>

  <input
    type="text"
    value={taskNotes?.[task] || ""}
    onChange={(e) => {
  const newNote = e.target.value;

  setTaskNotes((notes) => {
    const newNotes = { ...notes };

    if (newNote.trim() === "") {
      delete newNotes[task];
    } else {
      newNotes[task] = newNote;
    }

    localStorage.setItem(
      "taskNotes",
      JSON.stringify(newNotes)
    );

    return newNotes;
  });
}}
    placeholder="添加备注"
    className="flex-1 rounded border px-2 py-1 text-sm"
  />
</div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-500">
                            状态：{currentStatus}
                          </p>

                          {currentStatus !== "已完成" && (
                            <button
                              onClick={() => {
  const newStatus =
    currentStatus === "进行中"
      ? "已完成"
      : "进行中";

  const newStatuses = {
    ...taskStatus,
    [task]: newStatus,
  };

  setTaskStatus?.(newStatuses);

  localStorage.setItem(
    "taskStatus",
    JSON.stringify(newStatuses)
  );
}}
                              className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                            >
                              {currentStatus === "进行中"
                                ? "完成任务"
                                : "开始任务"}
                            </button>
                          )}
                       </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const shouldDelete = window.confirm(
                          "确定要删除这个任务吗？"
                        );

                        if (!shouldDelete) return;

                        const newTasks =
                          (confirmedTasks || []).filter(
                            (item) => item !== task
                          );

                        setConfirmedTasks?.(newTasks);

                        localStorage.setItem(
                          "confirmedTasks",
                          JSON.stringify(newTasks)
                        );

                        setTaskDetails?.((details) => {
                          const newDetails = { ...details };
                          delete newDetails[task];

                          localStorage.setItem(
                            "taskDetails",
                            JSON.stringify(newDetails)
                          );

                          return newDetails;
                        });

                        setTaskStatus?.((statuses) => {
                          const newStatuses = { ...statuses };
                          delete newStatuses[task];

                          localStorage.setItem(
                            "taskStatus",
                            JSON.stringify(newStatuses)
                          );

                          return newStatuses;
                        });

                        setTaskNotes((notes) => {
                          const newNotes = { ...notes };
                          delete newNotes[task];

                          localStorage.setItem(
                            "taskNotes",
                            JSON.stringify(newNotes)
                          );

                          return newNotes;
                        });
                      }}
                      className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      删除任务
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">
              暂时还没有已确认的任务。
            </p>
          )}
        </div>
       </div>
    </div>
    </div>
  );
}
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>

        <p className="mt-2 text-gray-500">
          {description}
        </p>
      </div>

     {title === "项目" ? (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">
        我的项目
      </h3>

      <button
        onClick={() => {
          const name = window.prompt("请输入项目名称");

          if (!name?.trim()) return;

          setProjects?.((currentProjects) => {
  const newProjects = [
    ...currentProjects,
    name.trim(),
  ];

  localStorage.setItem(
    "projects",
    JSON.stringify(newProjects)
  );

  return newProjects;
});
        }}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        + 新建项目
      </button>
    </div>

    <div className="rounded-xl border bg-white p-5">
     <div className="flex items-center justify-between">
  <h3 className="text-base font-semibold">
    项目成员
  </h3>

  <button
    onClick={() => {
      const name = window.prompt("请输入成员姓名");

      if (!name?.trim()) return;

      setPeople?.((currentPeople) => {
        const newPeople = currentPeople.includes(name.trim())
          ? currentPeople
          : [...currentPeople, name.trim()];

        localStorage.setItem(
          "people",
          JSON.stringify(newPeople)
        );

        return newPeople;
      });
    }}
    className="rounded-lg border px-3 py-1 text-sm"
  >
    + 添加成员
  </button>
</div>

<div className="mt-3 flex flex-wrap gap-2">
  {(people || []).map((person) => (
    <div
      key={person}
      className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
    >
      <span>{person}</span>

      <button
        onClick={() => {
          const newName = window.prompt(
            "请输入新的成员姓名",
            person
          );

          if (!newName?.trim()) return;

          setPeople?.((currentPeople) => {
            const trimmedName = newName.trim();

            const newPeople = currentPeople.map((item) =>
              item === person ? trimmedName : item
            );

            localStorage.setItem(
              "people",
              JSON.stringify(newPeople)
            );

            return newPeople;
          });
        }}
        className="text-xs text-gray-600 hover:text-black"
      >
        编辑
      </button>

      <button
        onClick={() => {
          const confirmed = window.confirm(
            `确定要删除成员“${person}”吗？`
          );

          if (!confirmed) return;

          setPeople?.((currentPeople) => {
            const newPeople = currentPeople.filter(
              (item) => item !== person
            );

            localStorage.setItem(
              "people",
              JSON.stringify(newPeople)
            );

            return newPeople;
          });
        }}
        className="text-xs text-gray-400 hover:text-red-600"
      >
        删除
      </button>
    </div>
  ))}
</div>
    </div>

    {projects && projects.length > 0 ? (
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
  key={index}
  className="flex items-center justify-between rounded-lg border bg-white p-4"
>
  <div>
 <p className="font-medium">{project}</p>

<p className="mt-1 text-sm text-gray-500">
  项目空间
</p>

<div className="mt-1 text-sm text-gray-500">
  <p>
    {Object.values(taskDetails || {}).filter(
      (detail) => detail.project === project
    ).length} 个任务
  </p>

  <p className="mt-1">
    已完成：
    {
      confirmedTasks?.filter(
        (task) =>
          taskDetails?.[task]?.project === project &&
          (taskStatus?.[task] || "待处理") === "已完成"
      ).length
    } 个
  </p>
</div>

<div className="mt-3 flex gap-4 text-sm">
  <span className="text-gray-500">
    待处理：
    {
      confirmedTasks?.filter(
        (task) =>
          taskDetails?.[task]?.project === project &&
          (taskStatus?.[task] || "待处理") === "待处理"
      ).length
    }
  </span>

  <span className="text-blue-600">
    进行中：
    {
      confirmedTasks?.filter(
        (task) =>
          taskDetails?.[task]?.project === project &&
          (taskStatus?.[task] || "待处理") === "进行中"
      ).length
    }
  </span>

  <span className="text-green-600">
    已完成：
    {
      confirmedTasks?.filter(
        (task) =>
          taskDetails?.[task]?.project === project &&
          (taskStatus?.[task] || "待处理") === "已完成"
      ).length
    }
  </span>
</div>
<div className="mt-4 rounded-lg bg-gray-50 p-3">
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-500">
      项目进度
    </span>

    <span className="text-sm font-semibold">
      {(() => {
        const projectTasks =
          confirmedTasks?.filter(
            (task) =>
              taskDetails?.[task]?.project === project
          ) || [];

        const completedTasks = projectTasks.filter(
          (task) =>
            (taskStatus?.[task] || "待处理") === "已完成"
        );

        return projectTasks.length === 0
          ? 0
          : Math.round(
              (completedTasks.length /
                projectTasks.length) *
                100
            );
      })()}%
    </span>
  </div>
</div>
{(() => {
  const projectTasks =
    confirmedTasks?.filter(
      (task) => taskDetails?.[task]?.project === project
    ) || [];

  const completedTasks = projectTasks.filter(
    (task) => (taskStatus?.[task] || "待处理") === "已完成"
  );

  const progress =
    projectTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length / projectTasks.length) * 100
        );

  return (
    <div className="mt-3 w-64">
      <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
        <span>项目进度</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
})()}
</div>
<div className="flex items-center gap-2">
  <button
 onClick={() => {
  setOpenedProject(project);
}}
  className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
>
  进入项目
</button>

  <button
    onClick={() => {
      setProjects?.((currentProjects) => {
        setTaskDetails?.((details) => {
  const newDetails = { ...details };

  Object.keys(newDetails).forEach((task) => {
    if (newDetails[task]?.project === project) {
      newDetails[task] = {
        ...newDetails[task],
        project: "未指定",
      };
    }
  });

  localStorage.setItem(
    "taskDetails",
    JSON.stringify(newDetails)
  );

  return newDetails;
});
  const newProjects = currentProjects.filter(
    (_, i) => i !== index
  );

  localStorage.setItem(
    "projects",
    JSON.stringify(newProjects)
  );

  return newProjects;
});
    }}
    className="text-sm text-red-500 hover:text-red-700"
  >
    删除
  </button>
</div>
{openedProject === project && (
  <div className="mt-4 border-t pt-4">
    <p className="mb-2 text-sm font-medium">
      项目任务
    </p>

    {confirmedTasks?.filter(
      (task) => taskDetails?.[task]?.project === project
    ).length === 0 ? (
      <p className="text-sm text-gray-500">
        这个项目暂时没有任务
      </p>
    ) : (
      <div className="space-y-2">
        {confirmedTasks
          ?.filter(
            (task) => taskDetails?.[task]?.project === project
          )
          .map((task) => (
           <div
  key={task}
  className="rounded-lg bg-gray-50 p-3"
>
  <p className="text-sm font-medium">
    {task}
  </p>

  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
  <span>负责人：</span>

  <select
    value={taskDetails?.[task]?.assignee || "待指定"}
    onChange={(e) => {
      const newAssignee = e.target.value;

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [task]: {
            ...details[task],
            assignee: newAssignee,
          },
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });
    }}
    className="rounded border px-2 py-1 text-xs"
  >
<option value="待指定">待指定</option>

{(people || []).map((person) => (
  <option key={person} value={person}>
    {person}
  </option>
))}
  </select>
</div>
 <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
  <span>截止时间：</span>

  <select
    value={taskDetails?.[task]?.deadline || "待识别"}
    onChange={(e) => {
      const newDeadline = e.target.value;

      setTaskDetails?.((details) => {
        const newDetails = {
          ...details,
          [task]: {
            ...details[task],
            deadline: newDeadline,
          },
        };

        localStorage.setItem(
          "taskDetails",
          JSON.stringify(newDetails)
        );

        return newDetails;
      });
    }}
    className="rounded border px-2 py-1 text-xs"
  >
    <option value="待识别">待识别</option>
    <option value="今天">今天</option>
    <option value="明天">明天</option>
    <option value="周五">周五</option>
    <option value="下周一">下周一</option>
  </select>
</div>
<div className="mt-3 flex items-center gap-2">
  <span className="text-sm text-gray-500">
    状态
  </span>

  <span
    className={`rounded-full px-3 py-1 text-sm font-medium ${
      (taskStatus?.[task] || "待处理") === "已完成"
        ? "bg-green-100 text-green-700"
        : (taskStatus?.[task] || "待处理") === "进行中"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {taskStatus?.[task] || "待处理"}
  </span>
  <div className="mt-3">
  {taskStatus?.[task] !== "已完成" && (
    <button 
  onClick={() => { 
    const newStatus = 
      (taskStatus?.[task] || "待处理") === "进行中" 
        ? "已完成" 
        : "进行中";

        setTaskStatus?.((statuses) => {
          const newStatuses = {
            ...statuses,
            [task]: newStatus,
          };

          localStorage.setItem(
            "taskStatus",
            JSON.stringify(newStatuses)
          );

          return newStatuses;
        });
      }}
      className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
    >
      {(taskStatus?.[task] || "待处理") === "进行中"
        ? "完成任务"
        : "开始任务"}
    </button>
  )}
</div>
</div>
</div>
          ))}
      </div>
    )}
  </div>
)}
</div>
        ))}
      </div>
    ) : (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-gray-500">
          还没有项目，点击右上角「新建项目」开始创建。
        </p>
      </div>
    )}
  </div>
) : (
  <div className="rounded-xl border bg-white p-8">
    <p className="text-gray-500">
      这个页面我们下一步来完成。
    </p>
  </div>
)}
    </div>
  );
}