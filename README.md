[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Yf9tAXk0)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=13462518)

# PURPOSE

This is your team's repo for the ESN Application, the group project conducted in 18652.

# Documentation

## Useful links

[Haiku](https://app.diagrams.net/#G11XcnXlcFla7T_WahWzuk_Jv2Wx9tn6zp#%7B%22pageId%22%3A%225KNVqeXB596CVV50548k%22%7D)  
[API Specification](https://docs.google.com/spreadsheets/d/1xrMAjeBByDNFLryVAHMHrYF3nyQ-KJPKNUvjBoDPd58/edit#gid=1001548426)  
[OOA](https://app.diagrams.net/#G11XcnXlcFla7T_WahWzuk_Jv2Wx9tn6zp#%7B%22pageId%22%3A%22FPt1q7jEseJJL5PschK8%22%7D)

### Iteration 0

[Iteration0](./docs/iteration-0)

### Iteration 1

[Iteration1](./docs/iteration-1)

# IMPORTANT RULES

- YOU ARE _NOT_ PERMITTED TO SHARE THIS REPO OUTSIDE THIS GITHUB ORG.
- YOU ARE _NOT_ PERMITTED TO FORK THIS REPO UNDER ANY CIRCUMSTANCES.
- YOU ARE _NOT_ PERMITTED TO CREATE ANY PUBLIC REPOS INSIDE THE CMUSV-FSE ORGANIZATION.
- YOU SHOULD HAVE LINKS FROM THIS README FILE TO YOUR PROJECT DOCUMENTS, SUCH AS YOUR REST API SPECS AND YOUR ARCHITECTURE DOCUMENT.
- YOUR GITHUB ACCOUNT'S PRIMARY EMAIL MUST BE ASSOCIATED WITH YOUR ANDREW EMAIL.
- YOUR GITHUB PROFILE MUST BE PUBLIC AND SHOULD HAVE YOUR FULL NAME AND RECOGNIZABLE HEADSHOT PHOTO.
- MAKE SURE TO CHECK AND UPDATE YOUR LOCAL GIT CONFIGURATION IN ORDER TO MATCH YOUR LOCAL GIT CREDENTIALS TO YOUR SE-PROJECT GITHUB CREDENTIALS (COMMIT USING YOUR ANDREW EMAIL ASSOCIATED WITH YOUR GITHUB ACCOUNT): OTHERWISE YOUR COMMITS MAY BE EXCLUDED FROM GITHUB STATISTICS AND REPO AUDITS WILL UNDERESTIMATE YOUR CONTRIBUTION.

# Technology Stack and Database Selection

## Backend

- Node.js
  - Motivation: Requirement of the project
  - Strengths: Event-driven, non-blocking, efficient, widely-used
  - Weaknesses: Not suitable for super heavy computation
- ExpressJS
  - Motivation: Requirement of the project
  - Strengths: Simpe, flexible, good community support
  - Weaknesses: Lack of in-built features

## Frontend

- HTML, CSS, JS
  - Motivation: Requirement of the project
  - Strengths: Simple, portable, flexible, standard
  - Weaknesses: Lack of in-built features
- Tailwind
  - Motivation: More configurable and flexible and lean
  - Strengths: Flexible, leaner than bootstrap
  - Weaknesses: Most of the team members are not familiar with it

## Database

- MongoDB
  - Motivation: Looking ahead, MongoDB has great capabilities when it comes to full text search and document search in the database. We are highly attracted to autocomplete feature
  - Strengths: Indexing, document search capabilities
  - Weaknesses: New to some of the team; not transactional

## Two-Way Communication

- Socket.io
  - Motivation: A common library used for real-time communication between client and server. Satisfy requirement of no client polling.
  - Strengths: Familiar to the team, simple
  - Weaknesses: Does not support authenticaiton

## Authentication

- jwt.js
  - Motivation: A common standard for tokens; widely used in industry application
  - Strengths: Used by major auth libaries; can be used for oAuth
  - Weaknesses: Not familiar to the team
- Write our own authentication route:
  - Motivation: We have experience on our team building OAUTH and decided to code from scratch as opposed to using a library like passport so we have full control/understanding. We are also of the opinion that by the time we have learned the ins and outs of passport.js or other authentication libraries, we could have substantial part of our own authentication route done.
  - Strengths: Flexible, good learning opportunity
  - Weaknesses: Time-consuming

## Unit Testing

- Mocha
  - Motivation: Mocha is a simple and flexible unit-testing framework. The asynchronous testing capability suits JavaScript environments, making writing tests easier and faster.
  - Strengths: simple, good community support
  - Weaknesses: Requires more configuration
