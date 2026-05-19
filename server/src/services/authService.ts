import bcrypt from 'bcryptjs';
import { withTransaction } from '../config/db.js';
import * as customerModel from '../models/customerModel.js';
import * as adminModel from '../models/adminModel.js';
import * as hotelOwnerModel from '../models/hotelOwnerModel.js';
import * as hotelStaffModel from '../models/hotelStaffModel.js';
import * as loyaltyModel from '../models/loyaltyModel.js';
import { ApiError } from '../utils/apiError.js';
import { signToken } from '../utils/auth.js';
import type { UserRole } from '../types/domain.js';

async function assertEmailIsAvailable(email: string) {
  const existingCustomer = await customerModel.findCustomerByEmail(email);
  const existingAdmin = await adminModel.findAdminByEmail(email);
  const existingOwner = await hotelOwnerModel.findHotelOwnerByEmail(email);
  const existingStaff = await hotelStaffModel.findHotelStaffByEmail(email);

  if (existingCustomer || existingAdmin || existingOwner || existingStaff) {
    throw new ApiError(409, 'An account with this email already exists.');
  }
}

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

function formatAdminSession(admin: adminModel.AdminRow) {
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

function formatHotelOwnerSession(owner: hotelOwnerModel.HotelOwnerRow) {
  return {
    token: signToken({
      id: owner.ownerId,
      role: 'hotel_owner',
      fullName: owner.fullName,
      email: owner.email,
    }),
    user: {
      id: owner.ownerId,
      role: 'hotel_owner' as const,
      fullName: owner.fullName,
      email: owner.email,
      createdAt: owner.createdAt,
    },
  };
}

function formatHotelStaffSession(staff: hotelStaffModel.HotelStaffRow) {
  return {
    token: signToken({
      id: staff.staffId,
      role: 'hotel_staff',
      fullName: staff.fullName,
      email: staff.email,
      ownerId: staff.ownerId,
    }),
    user: {
      id: staff.staffId,
      role: 'hotel_staff' as const,
      fullName: staff.fullName,
      email: staff.email,
      ownerId: staff.ownerId,
      createdAt: staff.createdAt,
    },
  };
}

export async function registerCustomer(input: {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}) {
  await assertEmailIsAvailable(input.email);

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

export async function registerPartner(input: {
  fullName: string;
  email: string;
  password: string;
  role: 'hotel_owner' | 'hotel_staff';
  ownerEmail?: string;
}) {
  await assertEmailIsAvailable(input.email);

  const passwordHash = await bcrypt.hash(input.password, 10);

  if (input.role === 'hotel_owner') {
    const ownerId = await hotelOwnerModel.createHotelOwner({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
    });

    const owner = await hotelOwnerModel.findHotelOwnerById(ownerId);
    if (!owner) {
      throw new ApiError(500, 'Unable to create hotel owner account.');
    }

    return formatHotelOwnerSession(owner);
  }

  if (!input.ownerEmail?.trim()) {
    throw new ApiError(400, 'Owner email is required for hotel staff accounts.');
  }

  const owner = await hotelOwnerModel.findHotelOwnerByEmail(input.ownerEmail.trim());
  if (!owner) {
    throw new ApiError(404, 'No hotel owner found with that owner email.');
  }

  const staffId = await hotelStaffModel.createHotelStaff({
    ownerId: owner.ownerId,
    fullName: input.fullName,
    email: input.email,
    passwordHash,
  });

  const staff = await hotelStaffModel.findHotelStaffById(staffId);
  if (!staff) {
    throw new ApiError(500, 'Unable to create hotel staff account.');
  }

  return formatHotelStaffSession(staff);
}

export async function login(input: { email: string; password: string; role?: UserRole }) {
  const customer = await customerModel.findCustomerByEmail(input.email);
  const admin = await adminModel.findAdminByEmail(input.email);
  const owner = await hotelOwnerModel.findHotelOwnerByEmail(input.email);
  const staff = await hotelStaffModel.findHotelStaffByEmail(input.email);

  const isAdminRole = admin || owner || staff;
  const targetRole = input.role ?? (isAdminRole ? (admin ? 'admin' : owner ? 'hotel_owner' : 'hotel_staff') : 'customer');

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

  if (targetRole === 'hotel_owner') {
    console.log(`[AUTH] Hotel Owner login attempt for: ${input.email}`);
    if (!owner) {
      console.log(`[AUTH] Hotel Owner not found: ${input.email}`);
      throw new ApiError(401, 'Invalid email or password.');
    }
    const isMatch = await bcrypt.compare(input.password, owner.passwordHash);
    console.log(`[AUTH] Hotel Owner password match: ${isMatch}`);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }
    return formatHotelOwnerSession(owner);
  }

  if (targetRole === 'hotel_staff') {
    console.log(`[AUTH] Hotel Staff login attempt for: ${input.email}`);
    if (!staff) {
      console.log(`[AUTH] Hotel Staff not found: ${input.email}`);
      throw new ApiError(401, 'Invalid email or password.');
    }
    const isMatch = await bcrypt.compare(input.password, staff.passwordHash);
    console.log(`[AUTH] Hotel Staff password match: ${isMatch}`);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }
    return formatHotelStaffSession(staff);
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

  if (role === 'hotel_owner') {
    const owner = await hotelOwnerModel.findHotelOwnerById(userId);
    if (!owner) {
      throw new ApiError(404, 'Hotel Owner not found.');
    }
    return formatHotelOwnerSession(owner);
  }

  if (role === 'hotel_staff') {
    const staff = await hotelStaffModel.findHotelStaffById(userId);
    if (!staff) {
      throw new ApiError(404, 'Hotel Staff not found.');
    }
    return formatHotelStaffSession(staff);
  }

  const customer = await customerModel.findCustomerById(userId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found.');
  }
  return formatCustomerSession(customer);
}
