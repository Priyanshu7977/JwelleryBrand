import { userRepository } from '../repositories/postgres/user.repository';
import { hashPassword, comparePassword, generateToken } from '../utils/crypto';
import { UserPublicProfile, UserEntity } from '../types/index';
import { AppError } from '../middleware/errorHandler.middleware';

function toPublicProfile(user: UserEntity): UserPublicProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    tier: user.tier,
    ordersCount: user.ordersCount,
    savedAddresses: [],
    createdAt: user.createdAt,
  };
}

export class AuthService {
  async register(data: { name: string; email: string; phone?: string; password: string }): Promise<{ token: string; user: UserPublicProfile }> {
    if (!data.name || data.name.trim().length < 2) {
      throw new AppError('Name must be at least 2 characters.', 400, 'INVALID_NAME');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      throw new AppError('A valid email address is required.', 400, 'INVALID_EMAIL');
    }
    if (!data.password || data.password.trim().length < 4) {
      throw new AppError('Password must be at least 4 characters.', 400, 'INVALID_PASSWORD');
    }

    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: 'customer',
      tier: 'Circle Member',
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
    });

    const profile = toPublicProfile(user);
    profile.savedAddresses = await userRepository.getAddresses(user.id);

    return { token, user: profile };
  }

  async login(email: string, password?: string): Promise<{ token: string; user: UserPublicProfile }> {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new AppError('A valid email address is required.', 400, 'INVALID_EMAIL');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    if (password) {
      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
    });

    const profile = toPublicProfile(user);
    profile.savedAddresses = await userRepository.getAddresses(user.id);

    return { token, user: profile };
  }

  async getProfile(userId: string): Promise<UserPublicProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User profile not found.', 404, 'USER_NOT_FOUND');
    }

    const profile = toPublicProfile(user);
    profile.savedAddresses = await userRepository.getAddresses(user.id);
    return profile;
  }
}

export const authService = new AuthService();
