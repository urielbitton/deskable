Deskable App

Main
- employees data (position, salaries, contact info, etc.)
- projects management 
- calendar system (react calendar npm)
- Team chats (firebase RTDB)
- video meetings (twilio video API or firestore extension)
- feed (teams can post & comment in social media style)
- events (company events) 
- work tools (resources list - for web devs, for finance, for business, etc)
- Apps links (invoice me, etc)

User types
1. Class A Business owner (can manage & track employees data, stats features, create new projects, chats, meetings)
2. Class B user (can create meetings, chats, projects)
3. Class C user (low level employee, must be invited to chats, projects, meetings, etc)


To Dos
- projects:
  - fix permissions access for all things in projects (only members of a project can access project, its tasks, pages, etc.) - any user can view all projects (only can't access its page, so that the can request permission to join) - hide tasks/pages in dashboard that user isn't part of
  - All projects
  - projects settings
  - projects updates
  - pages (pages is a new feature which is like confluence pages - use froala or summernote as editor. Pages are simply docs for projects or tasks)
  - complete sprint logic - ask where to move incomplete tasks (all completed tasks will not be found in backlog nor board and can be found in all tasks page) (when mark sprint complete, add a new sprint with the same tasks except the completed ones)
  - let users upload project avatar in project settings, let them edit all info as well
  - let users accept/reject project invitations
  - implement ask org admin for access to project when user does not have permission to view a project
  - add project templates when creating projects (software, marketing, design, etc) - templates are principally just a different selection of column titles (software: todo, in progress, in review, done. design: to do, concept, design, launch, testing, etc. or choose blank template)
  - change wysiwg editor with froala or summernote: (https://www.npmjs.com/package/react-froala-wysiwyg, https://www.npmjs.com/package/react-summernote)

- Posts:
  - edit announcements - change all db paths to pathPrefix so you can pass org/orgID/announcements as pathPrefix instead of hardcoded posts (change for comments and files, etc.)
  - announcements cards ui - different than posts - add importance variable
  - design sidebar in posts page (either a filter to find posts/announcements or some stats about posts/announcements -  or both)

- Employees
  - finish refactoring employees

Other Todos
- start by creating an org (invitation only)
- Link preview feature for posts & chats (use your own server for cors bypass)
- app shortcuts - let users add a page (e.g. project page board page, specific chat conversation, resource item page, etc) to their shortcuts on home screen and they can see those in a section on the homepage (or on rightbar under calendar)
