import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('[Auth] No token provided in request');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(`[Auth] Token verified successfully for user ${decoded.id} (${decoded.email})`);
    next();
  } catch (error) {
    console.log('[Auth] Invalid token:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export function checkSubscription(db) {
  return (req, res, next) => {
    const subscription = db.prepare(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ?'
    ).get(req.user.id, 'active');
    
    if (!subscription) {
      return res.status(403).json({ error: 'Active subscription required' });
    }
    
    const expiresAt = new Date(subscription.expires_at);
    if (expiresAt < new Date()) {
      db.prepare('UPDATE subscriptions SET status = ? WHERE id = ?').run('inactive', subscription.id);
      return res.status(403).json({ error: 'Subscription expired' });
    }
    
    next();
  };
}
