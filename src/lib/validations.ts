import { z } from 'zod';

// ============ Common Validation Patterns ============

// Max lengths for database fields
const MAX_NAME = 100;
const MAX_EMAIL = 255;
const MAX_PHONE = 20;
const MAX_TEXT = 500;
const MAX_NOTES = 1000;
const MAX_AMOUNT = 999999999999; // ~1 trillion max

// Common validators
const positiveNumber = z.number().positive({ message: 'মান ০ এর বেশি হতে হবে' }).max(MAX_AMOUNT, { message: 'মান অনেক বড়' });
const nonNegativeNumber = z.number().min(0, { message: 'মান ০ এর কম হতে পারবে না' }).max(MAX_AMOUNT, { message: 'মান অনেক বড়' });
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'অবৈধ তারিখ ফরম্যাট' });
const optionalDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'অবৈধ তারিখ ফরম্যাট' }).optional().or(z.literal(''));
const uuidString = z.string().uuid({ message: 'অবৈধ আইডি' });
const optionalUuid = z.string().uuid().optional().or(z.literal(''));

// ============ Finance Schemas ============

export const expenseSchema = z.object({
  title: z.string().trim().min(1, { message: 'খরচের বিবরণ আবশ্যক' }).max(MAX_NAME * 2, { message: 'বিবরণ অনেক বড়' }),
  amount: z.string().transform((val) => parseFloat(val) || 0).pipe(positiveNumber),
  category: z.string().max(MAX_NAME).optional().or(z.literal('')),
  expense_date: dateString,
  notes: z.string().max(MAX_NOTES, { message: 'নোট অনেক বড়' }).optional().or(z.literal('')),
  status: z.enum(['pending', 'approved', 'rejected'], { message: 'অবৈধ স্ট্যাটাস' }),
});

export const invoiceSchema = z.object({
  invoice_number: z.string().trim().min(1, { message: 'ইনভয়েস নম্বর আবশ্যক' }).max(50, { message: 'নম্বর অনেক বড়' }),
  client_id: optionalUuid,
  project_id: optionalUuid,
  amount: z.string().transform((val) => parseFloat(val) || 0).pipe(nonNegativeNumber),
  tax_amount: z.string().transform((val) => parseFloat(val) || 0).pipe(nonNegativeNumber),
  status: z.enum(['draft', 'pending', 'paid', 'overdue'], { message: 'অবৈধ স্ট্যাটাস' }),
  issue_date: dateString,
  due_date: dateString,
  notes: z.string().max(MAX_NOTES).optional().or(z.literal('')),
});

export const paymentSchema = z.object({
  invoice_id: optionalUuid,
  amount: z.string().transform((val) => parseFloat(val) || 0).pipe(positiveNumber),
  payment_date: dateString,
  payment_method: z.string().max(50).optional(),
  reference_number: z.string().max(100).optional(),
  notes: z.string().max(MAX_NOTES).optional(),
});

// ============ CRM Schemas ============

export const clientSchema = z.object({
  name: z.string().trim().min(1, { message: 'ক্লায়েন্টের নাম আবশ্যক' }).max(MAX_NAME, { message: 'নাম অনেক বড়' }),
  company: z.string().trim().max(MAX_NAME, { message: 'কোম্পানি নাম অনেক বড়' }).optional().or(z.literal('')),
  email: z.string().trim().email({ message: 'অবৈধ ইমেইল' }).max(MAX_EMAIL).optional().or(z.literal('')),
  phone: z.string().trim().max(MAX_PHONE, { message: 'ফোন নম্বর অনেক বড়' }).optional().or(z.literal('')),
  address: z.string().trim().max(MAX_TEXT, { message: 'ঠিকানা অনেক বড়' }).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive'], { message: 'অবৈধ স্ট্যাটাস' }),
});

export const leadSchema = z.object({
  name: z.string().trim().min(1, { message: 'লিডের নাম আবশ্যক' }).max(MAX_NAME, { message: 'নাম অনেক বড়' }),
  company: z.string().trim().max(MAX_NAME).optional().or(z.literal('')),
  email: z.string().trim().email({ message: 'অবৈধ ইমেইল' }).max(MAX_EMAIL).optional().or(z.literal('')),
  phone: z.string().trim().max(MAX_PHONE).optional().or(z.literal('')),
  estimated_value: z.string().optional().transform((val) => val ? parseFloat(val) : null),
  source: z.string().max(MAX_NAME).optional().or(z.literal('')),
  stage: z.enum(['new', 'contacted', 'proposal', 'negotiation', 'won'], { message: 'অবৈধ স্টেজ' }),
  notes: z.string().max(MAX_NOTES).optional().or(z.literal('')),
});

export const dealSchema = z.object({
  title: z.string().trim().min(1, { message: 'ডিলের নাম আবশ্যক' }).max(MAX_NAME * 2),
  client_id: optionalUuid,
  lead_id: optionalUuid,
  amount: z.string().transform((val) => parseFloat(val) || 0).pipe(nonNegativeNumber),
  probability: z.number().min(0).max(100),
  stage: z.enum(['negotiation', 'proposal', 'won', 'lost']),
  expected_close_date: optionalDateString,
  notes: z.string().max(MAX_NOTES).optional(),
});

// ============ HRM Schemas ============

export const employeeSchema = z.object({
  full_name: z.string().trim().min(1, { message: 'কর্মীর নাম আবশ্যক' }).max(MAX_NAME, { message: 'নাম অনেক বড়' }),
  email: z.string().trim().email({ message: 'অবৈধ ইমেইল' }).max(MAX_EMAIL, { message: 'ইমেইল অনেক বড়' }),
  phone: z.string().trim().max(MAX_PHONE).optional().or(z.literal('')),
  designation: z.string().trim().max(MAX_NAME).optional().or(z.literal('')),
  department_id: optionalUuid,
  status: z.enum(['active', 'on_leave', 'inactive'], { message: 'অবৈধ স্ট্যাটাস' }),
  salary: z.string().optional().transform((val) => val ? parseFloat(val) : null),
  join_date: dateString,
});

export const attendanceSchema = z.object({
  employee_id: uuidString,
  date: dateString,
  status: z.enum(['present', 'absent', 'late', 'leave'], { message: 'অবৈধ স্ট্যাটাস' }),
  check_in: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'অবৈধ সময় ফরম্যাট' }).optional().or(z.literal('')),
  check_out: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'অবৈধ সময় ফরম্যাট' }).optional().or(z.literal('')),
  notes: z.string().max(MAX_NOTES).optional().or(z.literal('')),
});

export const leaveRequestSchema = z.object({
  employee_id: uuidString,
  leave_type: z.string().min(1, { message: 'ছুটির ধরন আবশ্যক' }).max(50),
  start_date: dateString,
  end_date: dateString,
  reason: z.string().max(MAX_NOTES).optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export const payrollSchema = z.object({
  employee_id: optionalUuid,
  month: dateString,
  basic_salary: z.number().min(0).max(MAX_AMOUNT),
  allowances: z.number().min(0).max(MAX_AMOUNT),
  deductions: z.number().min(0).max(MAX_AMOUNT),
  bonus: z.number().min(0).max(MAX_AMOUNT),
  status: z.enum(['pending', 'paid']),
  notes: z.string().max(MAX_NOTES).optional(),
});

// ============ Project Schemas ============

export const projectSchema = z.object({
  name: z.string().trim().min(1, { message: 'প্রজেক্ট নাম আবশ্যক' }).max(MAX_NAME * 2, { message: 'নাম অনেক বড়' }),
  client_id: optionalUuid,
  description: z.string().max(MAX_NOTES).optional().or(z.literal('')),
  status: z.enum(['planning', 'in_progress', 'completed', 'delayed', 'on_hold'], { message: 'অবৈধ স্ট্যাটাস' }),
  priority: z.enum(['low', 'medium', 'high'], { message: 'অবৈধ অগ্রাধিকার' }),
  progress: z.string().transform((val) => parseInt(val) || 0).pipe(z.number().min(0).max(100)),
  budget: z.string().optional().transform((val) => val ? parseFloat(val) : null),
  start_date: optionalDateString,
  end_date: optionalDateString,
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, { message: 'টাস্ক নাম আবশ্যক' }).max(MAX_NAME * 2),
  project_id: optionalUuid,
  assigned_to: optionalUuid,
  description: z.string().max(MAX_NOTES).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: optionalDateString,
});

export const timesheetSchema = z.object({
  employee_id: optionalUuid,
  project_id: optionalUuid,
  task_id: optionalUuid,
  work_date: dateString,
  hours_worked: z.number().min(0).max(24),
  description: z.string().max(MAX_NOTES).optional(),
  billable: z.boolean(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

// ============ Product/Inventory Schemas ============

export const productSchema = z.object({
  name: z.string().trim().min(1, { message: 'পণ্যের নাম আবশ্যক' }).max(MAX_NAME, { message: 'নাম অনেক বড়' }),
  description: z.string().max(MAX_NOTES).optional().or(z.literal('')),
  sku: z.string().max(50).optional().or(z.literal('')),
  barcode: z.string().max(50).optional().or(z.literal('')),
  category_id: optionalUuid,
  purchase_price: z.number().min(0).max(MAX_AMOUNT),
  selling_price: z.number().min(0).max(MAX_AMOUNT),
  stock_quantity: z.number().int().min(0).max(999999999),
  min_stock_level: z.number().int().min(0).max(999999999),
  unit: z.string().max(20).optional(),
  status: z.enum(['active', 'inactive']),
});

export const stockAdjustmentSchema = z.object({
  productId: uuidString,
  quantity: z.number().int().min(0, { message: 'পরিমাণ ০ এর কম হতে পারবে না' }),
  type: z.enum(['in', 'out', 'adjustment'], { message: 'অবৈধ টাইপ' }),
  notes: z.string().max(MAX_NOTES).optional(),
});

// ============ POS Schemas ============

export const posPaymentSchema = z.object({
  customerName: z.string().trim().max(MAX_NAME).optional(),
  customerPhone: z.string().trim().max(MAX_PHONE).optional(),
  paymentMethod: z.enum(['cash', 'card', 'mobile'], { message: 'অবৈধ পেমেন্ট মেথড' }),
  receivedAmount: z.number().min(0),
});

// ============ Settings Schemas ============

export const companySettingsSchema = z.object({
  name: z.string().trim().min(1, { message: 'কোম্পানি নাম আবশ্যক' }).max(MAX_NAME),
  address: z.string().max(MAX_TEXT).optional(),
  phone: z.string().max(MAX_PHONE).optional(),
  email: z.string().email({ message: 'অবৈধ ইমেইল' }).max(MAX_EMAIL).optional().or(z.literal('')),
  website: z.string().url({ message: 'অবৈধ ওয়েবসাইট URL' }).max(MAX_EMAIL).optional().or(z.literal('')),
  tax_number: z.string().max(50).optional(),
});

// ============ User Role Schema ============

export const userRoleSchema = z.object({
  user_id: uuidString,
  role: z.enum(['admin', 'manager', 'employee', 'user'], { message: 'অবৈধ রোল' }),
});

// ============ Validation Helper ============

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  onError?: (error: z.ZodError) => void
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    onError?.(result.error);
    return { success: false, error: result.error };
  }
}

// Get first error message from Zod error
export function getFirstErrorMessage(error: z.ZodError): string {
  return error.errors[0]?.message || 'ভ্যালিডেশন ত্রুটি';
}
