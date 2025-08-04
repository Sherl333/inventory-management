import db from '../config/db.js';

export const getAllUsers = (req, res) => {
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  if(currentUserRole != 'admin'){
    return res.status(403).json({message: "Access denied. Only admins can view all users."});
  }
  const query = 'SELECT * FROM users where id != ?';
  db.query(query,[currentUserId], (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(results);  
  })

}