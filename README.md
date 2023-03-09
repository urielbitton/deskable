###Deskable App

##To Dos
- projects:
  - add landing pages for all empty project pages (e.g. the pages tab, if no pages add a nice illustration with some text and a cta button to create a new page, same with all projects, homepage, etc.)
  - add page for users to request to join project
  - complete sprint logic - ask where to move incomplete tasks (all completed tasks will not be found in backlog nor board and can be found in all tasks page) (when mark sprint complete, add a new sprint with the same tasks except the completed ones - all tasks in last column are marked as done and have their backlogPosition and position values set to null, inSprint: false, status: completed, etc.)
  - projects settings, let users edit project info on this page, and have some basic settings
  - projects updates - show updates like recent tasks, recent comments, recent files, recent pages, recent sprint completions
  - let users accept/reject project invitations
  - add project templates when creating projects (software, marketing, design, etc) - templates are principally just a different selection of column titles (software: todo, in progress, in review, done. design: to do, concept, design, launch, testing, etc. or choose blank template) and a few basic tasks
  - change all wysiwg editors with tinymce basic editor (create a component for it called AppBasicEditor.js - use for comments, posts, etc)

- Posts:
  - edit announcements - change all db paths to pathPrefix so you can pass org/orgID/announcements as pathPrefix instead of hardcoded posts (change for comments and files, etc.)
  - announcements cards ui - different than posts - add importance variable
  - design sidebar in posts page (either a filter to find posts/announcements or some stats about posts/announcements -  or both)

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


Markdown Editors:
- TinyMCE
- Froala
- Summernote
- Draft.js
- CKEditor
- Slate
- React-Quill
- React-Markdown-Editor
- StackEdit
