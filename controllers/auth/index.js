const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('@/config/db.config');
const SendMail = require('@/utils/email');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

class AuthController {

  // Login user with JWT token generation
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({
          status: false,
          message: 'Email and password are required',
          data: { message: 'Invalid email or password' }
        });
      }

      // Find user by email
      const query = 'SELECT * FROM auth_users WHERE email = ? AND isActive = true';
      const [rows] = await pool.execute(query, [email]);

      if (rows.length === 0) {
        return res.json({
          status: false,
          message: 'Invalid email or password',
          data: { message: 'Invalid email or password' }
        });
      }

      const user = rows[0];

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.json({
          status: false,
          message: 'Invalid email or password',
          data: { message: 'Invalid email or password' }
        });
      }

      // Generate JWT token
      const tokenPayload = {
        auth_id: user.auth_id,
        email: user.email,
        user_role: user.user_role,
        first_name: user.first_name,
        last_name: user.last_name
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      // Update login_token and last_login in database
      const updateQuery = 'UPDATE auth_users SET login_token = ?, last_login = ? WHERE auth_id = ?';
      const currentDateTime = new Date().toISOString();
      await pool.execute(updateQuery, [token, currentDateTime, user.auth_id]);

      // Remove sensitive data from response
      const { password: _, login_token: __, ...safeUser } = user;

      res.json({
        status: true,
        message: 'Login successful',
        data: {
          user: safeUser,
          token,
          expires_in: JWT_EXPIRE
        }
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error during login',
        error: error.message
      });
    }
  }

  // Verify JWT token middleware
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({
          status: false,
          message: 'Access token is required'
        });
      }

      const token = authHeader.substring(7);
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);


      const query = 'SELECT * FROM auth_users WHERE auth_id = ? AND login_token = ? AND isActive = true';
      const [rows] = await pool.execute(query, [decoded.auth_id, token]);

      if (rows.length === 0) {
        return res.json({
          status: false,
          message: 'Invalid or expired token',
          data: null
        });
      }

      req.user = decoded;
      req.token = token;

     const {password, login_token, publications, created_at, achievements, ...existuser} = rows[0]

      // if (next) {
      //   next();
      // } else {
        res.json({
          status: true,
          message: 'Token is valid',
          data: existuser
        });
      // }
    } catch (error) {
      res.json({
        status: false,
        message: 'Invalid token',
        error: error.message
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({
          status: false,
          message: 'Access token is required'
        });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);

      // Clear login_token from database
      const query = 'UPDATE auth_users SET login_token = NULL WHERE auth_id = ?';
      await pool.execute(query, [decoded.auth_id]);

      res.json({
        status: true,
        message: 'Logout successful',
        data: { logout: true }
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error during logout',
        error: error.message
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({
          status: false,
          message: 'Access token is required'
        });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);

      const query = 'SELECT * FROM auth_users WHERE auth_id = ? AND isActive = true';
      const [rows] = await pool.execute(query, [decoded.auth_id]);

      if (rows.length === 0) {
        return res.json({
          status: false,
          message: 'User not found'
        });
      }

      // Remove sensitive data
      const { password, login_token, ...safeUser } = rows[0];

      res.json({
        status: true,
        message: 'Profile retrieved successfully',
        data: safeUser
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error retrieving profile',
        error: error.message
      });
    }
  }

  // Refresh JWT token
  static async refreshToken(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({
          status: false,
          message: 'Access token is required'
        });
      }

      const oldToken = authHeader.substring(7);
      const decoded = jwt.verify(oldToken, JWT_SECRET);

      // Generate new token
      const tokenPayload = {
        auth_id: decoded.auth_id,
        email: decoded.email,
        user_role: decoded.user_role,
        first_name: decoded.first_name,
        last_name: decoded.last_name
      };

      const newToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

      // Update token in database
      const query = 'UPDATE auth_users SET login_token = ? WHERE auth_id = ?';
      await pool.execute(query, [newToken, decoded.auth_id]);

      res.json({
        status: true,
        message: 'Token refreshed successfully',
        data: {
          token: newToken,
          expires_in: JWT_EXPIRE
        }
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error refreshing token',
        error: error.message
      });
    }
  }

  // Create new user
  static async create(req, res) {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        profile_img_link,
        designation,
        institution,
        achievements,
        publications,
        isEmailVerified,
        isActive,
        user_role,
        created_at
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const profileImg = req.file || req.files && req.filePaths['profile_img'] ? req.filePaths['profile_img'][0] : profile_img_link

      const query = `
        INSERT INTO auth_users (
          email, password, first_name, last_name, 
          profile_img, designation, institution, achievements, 
          publications, isEmailVerified, isActive, user_role, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        email, hashedPassword, first_name, last_name,
        profileImg, designation, institution, achievements,
        publications, isEmailVerified, isActive,
        user_role || 'user', created_at
      ];

      const [result] = await pool.execute(query, values);

      const msg = isEmailVerified ? 'User created Successfully' : 'User created and verification link has been sent to Email!'

      if (isEmailVerified == 0) {
        const emailToken = await AuthController.generateEmailToken({ auth_id: result.insertId, email })
        const verifyUrl = `${process.env.USER_APP_URL}/auth/emailverify/${emailToken}`
        const sendMail = await SendMail.SendMailUsingBravo(verifyUrl, email, `${first_name} ${last_name}`)
    
        return res.json({
          status: true,
          message: msg,
          data: {
            emailToken: emailToken,
            auth_id: result.insertId,
            email,
            first_name,
            last_name
          }
        });
      }


      return res.json({
        status: true,
        message: msg,
        data: {
          auth_id: result.insertId,
          email,
          first_name,
          last_name
        }
      });

    } catch (error) {
      console.log(error)
      res.json({
        status: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  // Update user
  static async update(req, res) {
    try {
      const { auth_id } = req.query;
      const {
        email,
        first_name,
        last_name,
        designation,
        institution,
        achievements,
        publications,
        profile_img_link,
        isEmailVerified,
        isActive,
        user_role,
      } = req.body;

      const profileImg = req.file || req.files && req.filePaths['profile_img'] ? req.filePaths['profile_img'][0] : profile_img_link

      // Validate required fields
      if (!auth_id) {
        return res.status(400).json({
          status: false,
          message: 'User ID is required'
        });
      }

      const query = `
            UPDATE auth_users 
            SET email = '${email}',
                first_name = '${first_name}', 
                last_name = '${last_name}', 
                designation = '${designation}', 
                institution = '${institution}', 
                achievements = '${achievements}', 
                publications = '${publications}', 
                profile_img = '${profileImg}', 
                isEmailVerified = ${isEmailVerified},
                isActive = ${isActive},
                user_role= '${user_role}'
            WHERE auth_id = ${auth_id}
        `;



      const [result] = await pool.query(query);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'User profile updated successfully'
      });

    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete user
  static async delete(req, res) {
    try {
      const { auth_id } = req.query;

      const query = 'DELETE FROM auth_users WHERE auth_id = ?';
      const [result] = await pool.execute(query, [auth_id]);

      if (result.affectedRows === 0) {
        return res.json({
          status: false,
          message: 'User not found'
        });
      }

      res.json({
        status: true,
        message: 'User deleted successfully',
        data: {
          auth_id: parseInt(auth_id)
        }
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }

  // Find one user by ID
  static async findOne(req, res) {
    try {
      const { auth_id } = req.query;

      const query = 'SELECT * FROM auth_users WHERE auth_id = ?';
      const [rows] = await pool.execute(query, [auth_id]);

      if (rows.length === 0) {
        return res.json({
          status: false,
          message: 'User not found'
        });
      }

      // Remove sensitive data from response
      const user = { ...rows[0] };
      // delete user.password;
      // delete user.login_token;

      res.json({
        status: true,
        message: 'User found successfully',
        data: user
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error finding user',
        error: error.message
      });
    }
  }

  // Find all users
  static async findAll(req, res) {
    try {
      const {
        user_role,
        isActive,
        isEmailVerified
      } = req.query;

      let query = 'SELECT * FROM auth_users WHERE 1=1';
      const queryParams = [];

      // Add filters
      if (user_role) {
        query += ' AND user_role = ?';
        queryParams.push(user_role);
      }

      if (isActive !== undefined) {
        query += ' AND isActive = ?';
        queryParams.push(isActive === 'true');
      }

      if (isEmailVerified !== undefined) {
        query += ' AND isEmailVerified = ?';
        queryParams.push(isEmailVerified === 'true');
      }

      const [rows] = await pool.execute(query, queryParams);

      // Remove sensitive data from response
      const users = rows.map(user => {
        const { password, login_token, ...safeUser } = user;
        return safeUser;
      });

      res.json({
        status: true,
        message: 'Users retrieved successfully',
        data: users
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  }

  // Additional helper method to find user by email
  static async findByEmail(req, res) {
    try {
      const { email } = req.params;

      const query = 'SELECT * FROM auth_users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);

      if (rows.length === 0) {
        return res.json({
          status: false,
          message: 'User not found'
        });
      }

      // Remove sensitive data from response
      const user = { ...rows[0] };
      delete user.password;
      delete user.login_token;

      res.json({
        status: true,
        message: 'User found successfully',
        data: user
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error finding user',
        error: error.message
      });
    }
  }

  // Method to update user status (activate/deactivate)
  static async updateStatus(req, res) {
    try {
      const { auth_id } = req.params;
      const { isActive } = req.body;

      const query = 'UPDATE auth_users SET isActive = ? WHERE auth_id = ?';
      const [result] = await pool.execute(query, [isActive, auth_id]);

      if (result.affectedRows === 0) {
        return res.json({
          status: false,
          message: 'User not found'
        });
      }

      res.json({
        status: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
          auth_id: parseInt(auth_id),
          isActive
        }
      });

    } catch (error) {
      res.json({
        status: false,
        message: 'Error updating user status',
        error: error.message
      });
    }
  }


  // Verify with Email----
  static async verifyUserByEmail(req, res) {
    const JWT_MAIL_SECRET = process.env.JWT_EMAIL_TOKEN || 'EMAIL-token'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        status: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7);
    // Verify JWT token
    try {
      const decoded = jwt.verify(token, JWT_MAIL_SECRET);
      const query = 'UPDATE auth_users SET isEmailVerified = ? WHERE auth_id = ?';
      const [result] = await pool.execute(query, [1, decoded.auth_id]);

      if (result.affectedRows === 0) {
        return res.json({
          status: false,
          message: 'User not found'
        });
      }

      const userQuery = `SELECT * FROM auth_users WHERE auth_id = ?`
      const [user] = await pool.execute(userQuery, [decoded.auth_id]);

      const { created_at, login_token, password, ...userData } = user[0]


      res.json({
        status: true,
        message: `User Verified successfully`,
        data: {
          user: userData,
          verified: true
        }
      });
    } catch (error) {
      return res.json({
        status: false,
        message: error.message,
        data: {
          verified: false
        }
      })
    }

  }


  // Generate Email verification token ------
  static async generateEmailToken(payload) {
    const JWT_MAIL_SECRET = process.env.JWT_EMAIL_TOKEN || 'EMAIL-token'
    const token = jwt.sign(payload, JWT_MAIL_SECRET, { expiresIn: '21h' });
    return token
  }
}

module.exports = AuthController;