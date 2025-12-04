var express = require('express');
var router = express.Router();

// Minimal in-memory roster for now; replace with DB when needed
var users = [
  { id: 1, name: 'Mehaal Ali', role: 'Founder', timezone: 'Asia/Karachi' },
  { id: 2, name: 'Ahsan Khan', role: 'AI Engineer', timezone: 'Europe/London' }
];

router.get('/', function (req, res) {
  res.json({ users: users });
});

module.exports = router;
