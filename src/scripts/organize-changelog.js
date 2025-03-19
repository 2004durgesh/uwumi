import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const changelogPath = path.join(__dirname, '..', '..', 'CHANGELOG.md');
let changelog = fs.readFileSync(changelogPath, 'utf8');

// Extract version and date from the changelog
const versionMatch = changelog.match(/## \[([^\]]+)\] - ([0-9-]+)/);
const version = versionMatch ? versionMatch[1] : '1.0.0';
const date = versionMatch ? versionMatch[2] : new Date().toISOString().split('T')[0];

// Define categories with order priority
const categories = {
  'Breaking Changes': [],
  Features: [],
  'Bug Fixes': [],
  'Performance Improvements': [],
  Security: [],
  'UI Enhancements': [],
  'Code Refactoring': [],
  Documentation: [],
  'Dependency Updates': [],
  Testing: [],
  Miscellaneous: [],
};

// Get all commit lines
const commitRegex = /- (.+?) \[`([a-f0-9]+)`\]/g;
let match;

while ((match = commitRegex.exec(changelog)) !== null) {
  const [fullMatch, message, hash] = match;
  const commitLine = `- ${message} [\`${hash}\`](https://github.com/2004durgesh/uwumi/commit/${hash})`;

  // Categorize based on commit message with more detailed patterns
  if (message.includes('BREAKING CHANGE') || message.startsWith('!:')) {
    categories['Breaking Changes'].push(commitLine);
  } else if (
    message.startsWith('feat:') ||
    message.includes('add ') ||
    message.includes('implement') ||
    message.includes('new')
  ) {
    categories.Features.push(commitLine);
  } else if (
    message.startsWith('fix:') ||
    message.includes('issue') ||
    message.includes('solve') ||
    message.includes('bug')
  ) {
    categories['Bug Fixes'].push(commitLine);
  } else if (
    message.startsWith('perf:') ||
    message.includes('performance') ||
    message.includes('speed') ||
    message.includes('optimize')
  ) {
    categories['Performance Improvements'].push(commitLine);
  } else if (
    message.startsWith('security:') ||
    message.includes('security') ||
    message.includes('auth') ||
    message.includes('vulnerability')
  ) {
    categories.Security.push(commitLine);
  } else if (
    message.includes('ui') ||
    message.includes('theme') ||
    message.includes('style') ||
    message.includes('css')
  ) {
    categories['UI Enhancements'].push(commitLine);
  } else if (message.startsWith('refactor:') || message.includes('clean up') || message.includes('refactor')) {
    categories['Code Refactoring'].push(commitLine);
  } else if (message.startsWith('docs:') || message.includes('documentation') || message.includes('comment')) {
    categories.Documentation.push(commitLine);
  } else if (
    message.includes('dep') ||
    message.includes('package') ||
    message.includes('version') ||
    message.includes('dependency')
  ) {
    categories['Dependency Updates'].push(commitLine);
  } else if (
    message.startsWith('test:') ||
    message.includes('test') ||
    message.includes('spec') ||
    message.includes('unit test')
  ) {
    categories.Testing.push(commitLine);
  } else if (message.startsWith('update:') || message.includes('update')) {
    // Check if it's a specific type of update before defaulting to miscellaneous
    if (message.includes('ui') || message.includes('interface')) {
      categories['UI Enhancements'].push(commitLine);
    } else if (message.includes('performance')) {
      categories['Performance Improvements'].push(commitLine);
    } else if (message.includes('code') || message.includes('refactor')) {
      categories['Code Refactoring'].push(commitLine);
    } else {
      categories.Miscellaneous.push(commitLine);
    }
  } else {
    categories.Miscellaneous.push(commitLine);
  }
}

// Create new formatted changelog
let newChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${date}

`;

// Add each category - only include categories with entries
Object.entries(categories).forEach(([category, commits]) => {
  if (commits.length > 0) {
    newChangelog += `### ${category}\n\n`;
    commits.forEach((commit) => {
      newChangelog += `${commit}\n`;
    });
    newChangelog += '\n';
  }
});

// Add previous versions if they exist
const previousVersionsMatch = changelog.match(/## \[\d+\.\d+\.\d+\] - [0-9-]+[\s\S]*$/);
if (previousVersionsMatch && previousVersionsMatch[0].includes('## [') && version !== '1.0.0') {
  // Extract previous versions from the original changelog, excluding the current version
  const otherVersionsText = previousVersionsMatch[0].replace(/^## \[\d+\.\d+\.\d+\] - [0-9-]+[\s\S]*?(## \[)/, '$1');
  if (otherVersionsText.startsWith('## [')) {
    newChangelog += otherVersionsText;
  }
}

// Write the new changelog
fs.writeFileSync(changelogPath, newChangelog);

console.log(`Changelog has been organized for version ${version}!`);
