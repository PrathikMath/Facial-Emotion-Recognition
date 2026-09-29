const readiness = document.querySelector("#readiness");
const requirements = document.querySelector("#requirements-list");
const emotionLabels = document.querySelector("#emotion-labels");
const pipelineList = document.querySelector("#pipeline-list");
const runCommand = document.querySelector("#run-command");
const copyButton = document.querySelector("#copy-command");
const copyFeedback = document.querySelector("#copy-feedback");

function addStatus(label, available, readyText, missingText) {
  const row = document.createElement("div");
  row.className = "status-row";
  const dot = document.createElement("span");
  dot.className = `status-dot ${available ? "" : "missing"}`;
  const text = document.createElement("span");
  text.textContent = label;
  const value = document.createElement("span");
  value.className = "status-value";
  value.textContent = available ? readyText : missingText;
  row.append(dot, text, value);
  readiness.append(row);
}

function addRequirement(label, available) {
  const item = document.createElement("span");
  item.className = `requirement ${available ? "" : "missing"}`;
  item.textContent = `${label}: ${available ? "found" : "not found"}`;
  requirements.append(item);
}

async function loadProject() {
  try {
    const response = await fetch("/api/project");
    if (!response.ok) throw new Error("Project details could not be loaded.");
    const project = await response.json();

    emotionLabels.replaceChildren();
    const title = document.createElement("span");
    title.className = "strip-label";
    title.textContent = `${String(project.labels.length).padStart(2, "0")} OUTPUT CLASSES`;
    emotionLabels.append(title);
    for (const label of project.labels) {
      const tag = document.createElement("span");
      tag.className = "emotion-tag";
      tag.textContent = label;
      emotionLabels.append(tag);
    }

    readiness.replaceChildren();
    addStatus("Pretrained model weights", project.readiness.weights, "READY", "MISSING");
    addStatus("Haar face detector", project.readiness.face_detector, "READY", "MISSING");
    addStatus("FER-2013 train / test folders", project.readiness.training_data, "READY", "OPTIONAL FOR DISPLAY");

    requirements.replaceChildren();
    addRequirement("Model weights · src/model.h5", project.readiness.weights);
    addRequirement("Face detector · src/haarcascade_frontalface_default.xml", project.readiness.face_detector);
    addRequirement("Training data · src/data/train + test", project.readiness.training_data);

    pipelineList.replaceChildren();
    project.pipeline.forEach((description, index) => {
      const item = document.createElement("li");
      const number = document.createElement("span");
      number.className = "step-number";
      number.textContent = String(index + 1).padStart(2, "0");
      const content = document.createElement("div");
      const heading = document.createElement("h3");
      heading.textContent = ["Capture", "Find a face", "Prepare input", "Classify"][index];
      const detail = document.createElement("p");
      detail.textContent = description;
      content.append(heading, detail);
      const mark = document.createElement("span");
      mark.className = "step-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = ["◎", "⌗", "▦", "↗"][index];
      item.append(number, content, mark);
      pipelineList.append(item);
    });

    runCommand.textContent = project.commands.display.replace("cd src; ", "Set-Location .\\src\n");
  } catch (error) {
    readiness.replaceChildren();
    const row = document.createElement("div");
    row.className = "status-row";
    row.textContent = "Project status unavailable. Start the Flask server to load local details.";
    readiness.append(row);
    requirements.textContent = error.message;
  }
}

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(runCommand.textContent);
    copyFeedback.textContent = "COPIED";
  } catch {
    copyFeedback.textContent = "COPY UNAVAILABLE";
  }
  window.setTimeout(() => { copyFeedback.textContent = ""; }, 1800);
});

loadProject();
