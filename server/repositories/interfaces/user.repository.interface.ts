import { UserEntity, UserAddress, UserRole, UserTier } from '../../types/index';

export interface CreateUserDTO {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  role?: UserRole;
  tier?: UserTier;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(data: CreateUserDTO): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
  incrementOrdersCount(id: string): Promise<void>;
  
  // Addresses
  getAddresses(userId: string): Promise<UserAddress[]>;
  addAddress(userId: string, address: Omit<UserAddress, 'id' | 'userId' | 'createdAt'>): Promise<UserAddress>;
  deleteAddress(userId: string, addressId: string): Promise<boolean>;

  // Wishlist
  getWishlist(userId: string): Promise<string[]>;
  toggleWishlist(userId: string, productId: string): Promise<{ productIds: string[]; added: boolean }>;
}
