const scanBtn = document.getElementById("scanBtn");
const resultSection = document.getElementById("result");
const scoreElement = document.getElementById("score");
const verdictElement = document.getElementById("verdict");
const reasonsList = document.getElementById("reasons");
const iocsList = document.getElementById("iocs");
const statusElement = document.getElementById("status");

scanBtn.addEventListener("click", async () => {
  scanBtn.disabled = true;
  statusElement.textContent = "Scanning current Gmail email...";

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab || !tab.url || !tab.url.includes("mail.google.com")) {
      throw new Error("Please open Gmail and select an email before scanning.");
    }

    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    const emailData = injectionResults[0].result;

    if (!emailData || (!emailData.subject && !emailData.body)) {
      throw new Error("Could not extract email content. Open a Gmail email thread and try again.");
    }

    const analysis = analyzeEmail(emailData);

    displayResult(analysis);

    statusElement.textContent = "Scan complete.";
  } catch (error) {
    statusElement.textContent = error.message;
    resultSection.classList.add("hidden");
  } finally {
    scanBtn.disabled = false;
  }
});

function displayResult(analysis) {
  scoreElement.textContent = `${analysis.score}/100`;

  verdictElement.textContent = analysis.verdict;
  verdictElement.className = `verdict ${analysis.verdictClass}`;

  reasonsList.innerHTML = "";
  iocsList.innerHTML = "";

  analysis.reasons.forEach(reason => {
    const li = document.createElement("li");
    li.textContent = reason;
    reasonsList.appendChild(li);
  });

  if (analysis.iocs.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No URLs extracted";
    iocsList.appendChild(li);
  } else {
    analysis.iocs.forEach(ioc => {
      const li = document.createElement("li");
      li.textContent = ioc;
      iocsList.appendChild(li);
    });
  }

  resultSection.classList.remove("hidden");
}
