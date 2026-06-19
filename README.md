# PhishGuard Lite Chrome Extension

PhishGuard Lite is a Manifest V3 Chrome extension that scans the currently opened Gmail email and performs rule-based phishing risk analysis.

The extension extracts visible email content and links from the Gmail page, analyzes common phishing indicators, and displays an explainable risk score with detection reasons and extracted URLs.

## Features

- Scans the currently opened Gmail email
- Extracts subject, sender, body text, and visible links
- Detects urgent or threatening language
- Detects credential-related requests
- Detects payment and invoice pressure
- Detects shortened URLs
- Detects IP-based URLs
- Detects suspicious top-level domains
- Generates a 0-100 phishing risk score
- Classifies emails as Safe, Suspicious, or Likely Phishing
- Displays explainable reasons for the verdict
- Shows extracted URLs as IOCs
