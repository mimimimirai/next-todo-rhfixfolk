import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export function generateToken(user) {
  try {
    console.log("Generating token for user:", user);
    if (!user || typeof user.id !== 'number') {
      throw new Error('Invalid user data: id must be a number');
    }
    
    // シンプルなペイロード構造に変更
    const payload = {
      id: user.id
    };
    
    const token = jwt.sign(payload, SECRET_KEY);
    console.log("Generated token payload:", payload);
    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
}

export function verifyToken(token) {
  try {
    if (!token) {
      console.log("No token provided");
      return null;
    }
    
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);
    
    // デコードされたデータをそのまま返す
    return {
      id: decoded.id
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}