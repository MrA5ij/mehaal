// admin.js - Shared admin panel JS for MEHAAL

document.addEventListener('DOMContentLoaded', function () {
  // Project Add Form
  var showAddProjectBtn = document.getElementById('showAddProjectBtn');
  var addProjectForm = document.getElementById('addForm');
  var cancelAddProjectBtn = document.getElementById('cancelAddProjectBtn');
  if (showAddProjectBtn && addProjectForm) {
    showAddProjectBtn.addEventListener('click', function () {
      addProjectForm.style.display = 'block';
    });
  }
  if (cancelAddProjectBtn && addProjectForm) {
    cancelAddProjectBtn.addEventListener('click', function () {
      addProjectForm.style.display = 'none';
    });
  }

  // Team Add Form
  var showAddTeamBtn = document.getElementById('showAddTeamBtn');
  var cancelAddTeamBtn = document.getElementById('cancelAddTeamBtn');
  if (showAddTeamBtn && addProjectForm) {
    showAddTeamBtn.addEventListener('click', function () {
      addProjectForm.style.display = 'block';
    });
  }
  if (cancelAddTeamBtn && addProjectForm) {
    cancelAddTeamBtn.addEventListener('click', function () {
      addProjectForm.style.display = 'none';
    });
  }

  // Delete Team Member
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-member')) {
      var id = e.target.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this member?')) {
        fetch('/api/team/' + id, { method: 'DELETE' })
          .then(() => location.reload());
      }
    }
  });
});
