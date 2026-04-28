import * as customerModel from '../models/customerModel.js';
import * as loyaltyModel from '../models/loyaltyModel.js';
import { ApiError } from '../utils/apiError.js';

export async function listCustomers() {
  const customers = await customerModel.listCustomers();

  return Promise.all(
    customers.map(async (customer) => {
      const loyalty = await loyaltyModel.findLoyaltyByCustomerId(customer.customerId);
      return {
        id: customer.customerId,
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        loyaltyPoints: loyalty?.points ?? 0,
        membershipLevel: loyalty?.membershipLevel ?? 'Bronze',
      };
    }),
  );
}

export async function getCustomer(customerId: number) {
  const customer = await customerModel.findCustomerById(customerId);

  if (!customer) {
    throw new ApiError(404, 'Customer not found.');
  }

  const loyalty = await loyaltyModel.findLoyaltyByCustomerId(customerId);

  return {
    id: customer.customerId,
    fullName: customer.fullName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    loyaltyPoints: loyalty?.points ?? 0,
    membershipLevel: loyalty?.membershipLevel ?? 'Bronze',
  };
}

export async function updateCustomer(customerId: number, input: { fullName: string; phoneNumber?: string }) {
  await customerModel.updateCustomer(customerId, input);
  return getCustomer(customerId);
}

export async function deleteCustomer(customerId: number) {
  await customerModel.deleteCustomer(customerId);
}
