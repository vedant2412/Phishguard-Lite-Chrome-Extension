function extractGmailEmailData() {
  const subjectElement = document.querySelector("h2[data-thread-perm-id]") ||
                         document.querySelector("h2");

  const senderElement = document.querySelector("span[email]") ||
                        document.querySelector(".gD");

  const bodyElements = document.querySelectorAll(".a3s");

  const subject = subjectElement ? subjectElement.innerText.trim() : "";
  const sender = senderElement
    ? senderElement.getAttribute("email") || senderElement.innerText.trim()
    : "";

  let body = "";

  bodyElements.forEach(element => {
    body += " " + element.innerText;
  });

  const links = Array.from(document.querySelectorAll("a"))
    .map(link => link.href)
    .filter(href =>
      href &&
      href.startsWith("http") &&
      !href.includes("mail.google.com")
    );

  return {
    subject,
    sender,
    body: body.trim(),
    links: [...new Set(links)]
  };
}

extractGmailEmailData();
