import bcrypt from 'bcryptjs';
import { withTransaction } from '../config/db.js';
import * as customerModel from '../models/customerModel.js';
import * as adminModel from '../models/adminModel.js';
import * as loyaltyModel from '../models/loyaltyModel.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/auth.js';
import type { UserRole } from '../types/domain.js';

async function formatCustomerSession(customer: customerModel.CustomerRow) {
  const loyalty = await loyaltyModel.findLoyaltyByCustomerId(customer.customerId);

  return {
    token: signToken({
      id: customer.customerId,
      role: 'customer',
      fullName: customer.fullName,
      email: customer.email,
    }),
    user: {
      id: customer.customerId,
      role: 'customer' as const,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      loyaltyPoints: loyalty?.points ?? 0,
      membershipLevel: loyalty?.membershipLevel ?? 'Bronze',
      createdAt: customer.createdAt,
    },
  };
}

async function formatAdminSession(admin: adminModel.AdminRow) {
  return {
    token: signToken({
      id: admin.adminId,
      role: 'admin',
      fullName: admin.fullName,
      email: admin.email,
    }),
    user: {
      id: admin.adminId,
      role: 'admin' as const,
      fullName: admin.fullName,
      email: admin.email,
      createdAt: admin.createdAt,
    },
  };
}

export async function registerCustomer(input: {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}) {
  const existingCustomer = await customerModel.findCustomerByEmail(input.email);
  const existingAdmin = await adminModel.findAdminByEmail(input.email);

  if (existingCustomer || existingAdmin) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const customerId = await withTransaction(async (connection) => {
    const newCustomerId = await customerModel.createCustomer(
      {
        fullName: input.fullName,
        email: input.email,
        phoneNumber: input.phoneNumber,
        passwordHash,
      },
      connection,
    );
    await loyaltyModel.createLoyalty(newCustomerId, connection);
    return newCustomerId;
  });

  const customer = await customerModel.findCustomerById(customerId);

  if (!customer) {
    throw new ApiError(500, 'Unable to create account.');
  }

  return formatCustomerSession(customer);
}

export async function login(input: { email: string; password: string; role?: UserRole }) {
  const customer = await customerModel.findCustomerByEmail(input.email);
  const admin = await adminModel.findAdminByEmail(input.email);
  const targetRole = input.role ?? (admin ? 'admin' : 'customer');

  if (targetRole === 'admin') {
    console.log(`[AUTH] Admin login attempt for: ${input.email}`);
    if (!admin) {
      console.log(`[AUTH] Admin not found: ${input.email}`);
      throw new ApiError(401, 'Invalid email or password.');
    }
    const isMatch = await bcrypt.compare(input.password, admin.passwordHash);
    console.log(`[AUTH] Admin password match: ${isMatch}`);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    return formatAdminSession(admin);
  }

  console.log(`[AUTH] Customer login attempt for: ${input.email}`);
  if (!customer) {
    console.log(`[AUTH] Customer not found: ${input.email}`);
    throw new ApiError(401, 'Invalid email or password.');
  }
  const isMatch = await bcrypt.compare(input.password, customer.passwordHash);
  console.log(`[AUTH] Customer password match: ${isMatch}`);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  return formatCustomerSession(customer);
}

export async function getMe(userId: number, role: UserRole) {
  if (role === 'admin') {
    const admin = await adminModel.findAdminById(userId);

    if (!admin) {
      throw new ApiError(404, 'Admin not found.');
    }

    return formatAdminSession(admin);
  }

  const customer = await customerModel.findCustomerById(userId);

  if (!customer) {
    throw new ApiError(404, 'Customer not found.');
  }

  return formatCustomerSession(customer);
}
