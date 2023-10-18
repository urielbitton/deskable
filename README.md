###Deskable App

##To Dos

- chats
  - create group chats
  - create single chats
  - add files, media, emojis, record audio to messages
  - conversation info sidebar (participants, files, media, etc) (similar to famillia)
  - add chat search feature
  - use react-tooltip library for important tooltips (e.g. +1 more reactions in message reactions!)

- User onboarding: refactor entire flow (use sendgrid)

- meetings
  - virtual backgrounds
  - record feature
  - invite participants to meetings button
  - fix screen share bug (only participants who join AFTER a user starts screen sharing can see the screen share, if screenshare is closed and restarted no one can see it - has to do with event listeners of screenshare not properly being removed or readded. )
  - test dominantSpeaker feature
  - refactor to show dominant speaker as main video window (if no one is screensharing only)
  - fix remove participants on page close
  - search meetings on meetings home page
  - filter & view toggle meetings on meetings home page
  - chat features

- calendar
  - add meetings and events to calendar
  - allow inviting participants to events
  - create video meeting directly from event on calendar

- General
  - change all wysiwg editors with tinymce basic editor (create a component for it called AppBasicEditor.js - use for comments, posts, etc)
  - let users accept/reject project invitations

- Posts:
  - edit announcements - change all db paths to pathPrefix so you can pass org/orgID/announcements as pathPrefix instead of hardcoded posts (change for comments and files, etc.)
  - announcements cards ui - different than posts - add importance variable
  - design sidebar in posts page (either a filter to find posts/announcements or some stats about posts/announcements -  or both)

- projects bugs:
  - dropping tasks into sprint for first time returns error: non draggable zone
  - deleting a task returns error: cannot read property undefined of columnID

- support:
  - add support system like Halp.

- Employees - emplyees are actual db users that belong to a org. So no creating, just deleting
  - finish refactoring employees

Other Todos
- Create an org (invitation only) flow
- Link preview feature for posts & chats (use your own server for cors bypass)
- app shortcuts - let users add a page (e.g. project page board page, specific chat conversation, resource item page, etc) to their shortcuts on home screen and they can see those in a section on the homepage (or on rightbar under calendar)



Main
- employees data (position, contact methods, contact info, etc.)
- projects management (kanban react)
- calendar system (react calendar npm)
- Team chats (firebase RTDB)
- video meetings (twilio video API or firestore extension)
- posts/announcements (teams can post & comment in social media style, managers can post announcements)
- events (company events) 
- support system (help desk)
- work tools (resources list - for web devs, for finance, for business, etc)
- Apps links (invoice me, etc)

User types
1. Class A Business owner (can manage & track employees data, stats features, create new projects, chats, meetings)
2. Class B user (can create meetings, chats, projects)
3. Class C user (low level employee, must be invited to chats, projects, meetings, etc)


V2 To Dos:
- add project templates when creating projects (software, marketing, design, etc) - templates are principally just a different selection of column titles (software: todo, in progress, in review, done. design: to do, concept, design, launch, testing, etc. or choose blank template) and a few basic tasks