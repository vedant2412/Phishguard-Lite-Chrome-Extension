function analyzeEmail(emailData) {
  const text = `${emailData.subject || ""} ${emailData.sender || ""} ${emailData.body || ""}`.toLowerCase();
  const links = emailData.links || [];

  let score = 0;
  const reasons = [];
  const iocs = [];

  const rules = [
    {
      name: "Urgent language detected",
      patterns: ["urgent", "immediately", "act now", "within 24 hours", "limited time", "final warning"],
      points: 15
    },
    {
      name: "Account threat language detected",
      patterns: ["account suspended", "account locked", "verify your account", "unusual activity", "security alert"],
      points: 20
    },
    {
      name: "Credential request detected",
      patterns: ["password", "login", "sign in", "verify identity", "otp", "one-time password", "reset your password"],
      points: 20
    },
    {
      name: "Payment or invoice pressure detected",
      patterns: ["invoice", "payment failed", "billing issue", "wire transfer", "bank account", "refund"],
      points: 15
    },
    {
      name: "Sensitive data request detected",
      patterns: ["ssn", "social security", "credit card", "card number", "bank details", "personal information"],
      points: 20
    },
    {
      name: "Threatening consequence detected",
      patterns: ["will be deleted", "will be suspended", "permanently disabled", "legal action", "unauthorized access"],
      points: 15
    }
  ];

  for (const rule of rules) {
    const matched = rule.patterns.some(pattern => text.includes(pattern));

    if (matched) {
      score += rule.points;
      reasons.push(rule.name);
    }
  }

  if (links.length > 0) {
    score += 10;
    reasons.push("External link found in email");

    for (const link of links) {
      iocs.push(link);
    }
  }

  const shortenedDomains = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "buff.ly",
    "cutt.ly",
    "rebrand.ly"
  ];

  const hasShortenedUrl = links.some(link =>
    shortenedDomains.some(domain => link.toLowerCase().includes(domain))
  );

  if (hasShortenedUrl) {
    score += 20;
    reasons.push("Shortened URL detected");
  }

  const hasIpUrl = links.some(link =>
    /https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(link)
  );

  if (hasIpUrl) {
    score += 25;
    reasons.push("IP-based URL detected");
  }

  const suspiciousTlds = [".xyz", ".top", ".click", ".work", ".support", ".country", ".zip"];

  const hasSuspiciousTld = links.some(link =>
    suspiciousTlds.some(tld => link.toLowerCase().includes(tld))
  );

  if (hasSuspiciousTld) {
    score += 15;
    reasons.push("Suspicious top-level domain detected");
  }

  if (links.length >= 5) {
    score += 10;
    reasons.push("High number of links detected");
  }

  score = Math.min(score, 100);

  let verdict = "Safe";
  let verdictClass = "safe";

  if (score >= 70) {
    verdict = "Likely Phishing";
    verdictClass = "phishing";
  } else if (score >= 35) {
    verdict = "Suspicious";
    verdictClass = "suspicious";
  }

  if (reasons.length === 0) {
    reasons.push("No major phishing indicators detected");
  }

  return {
    score,
    verdict,
    verdictClass,
    reasons,
    iocs
  };
}
