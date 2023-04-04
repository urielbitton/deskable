###Deskable App

##To Dos
- meetings
  - fix screen share bug (only participants who join AFTER a user starts screen sharing can see the screen share, if screenshare is closed and restarted no one can see it - has to do with event listeners of screenshare not properly being removed or readded. )
  - fix remove participants on page close
  - main features: raise hand, virtual backgounds, fullscreen, closed captions, options.
  - search meetings features
  - filter & view toggle meetings
  - test isTalking feature

- chats
  - import as much code as possible from familia

- General
  - change all wysiwg editors with tinymce basic editor (create a component for it called AppBasicEditor.js - use for comments, posts, etc)
  - let users accept/reject project invitations

- Posts:
  - edit announcements - change all db paths to pathPrefix so you can pass org/orgID/announcements as pathPrefix instead of hardcoded posts (change for comments and files, etc.)
  - announcements cards ui - different than posts - add importance variable
  - design sidebar in posts page (either a filter to find posts/announcements or some stats about posts/announcements -  or both)

- support:
  - add support system like Halp.

- Employees - emplyees are actual db users that belong to a org. So no creating, just deleting
  - finish refactoring employees

- Home
- Meetings
- Chats
- Resources
- Settings


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