import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/db';
import { generateToken } from '../utils/jwt.util';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db('users').where({ email }).first();

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials or account disabled' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, roleId: user.role_id });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('[Auth Error] Login failure:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const setupAdmin = async (req: Request, res: Response) => {
  try {
    const userCount = await db('users').count('id as count').first();
    
    if (userCount && Number(userCount.count) > 0) {
      return res.status(403).json({ error: 'Server is already initialized' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    let adminRole = await db('roles').where({ name: 'Admin' }).first();
    if (!adminRole) {
      [adminRole] = await db('roles').insert({
        name: 'Admin',
        permissions: JSON.stringify({ all: true })
      }).returning('*');
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const [newUser] = await db('users').insert({
      username,
      email,
      password_hash,
      role_id: adminRole.id
    }).returning(['id', 'username', 'email']);

    const token = generateToken({ userId: newUser.id, roleId: adminRole.id });

    return res.status(201).json({
      message: 'Admin account created successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('[Auth Error] Setup failure:', error);
    return res.status(500).json({ error: 'Internal server error during setup' });
  }
};
                                   
