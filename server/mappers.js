export function mapUser(row) {
  return {
    id: row.id,
    role: row.role,
    fullName: row.full_name,
    companyName: row.company_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    region: row.region,
    avatarInitials: row.avatar_initials,
    isVerified: Boolean(row.is_verified)
  };
}

export function mapMachine(row) {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    name: row.name,
    category: row.category,
    brand_model: row.brand_model,
    power_hp: row.power_hp,
    daily_price: Number(row.daily_price),
    location_city: row.location_city,
    location_region: row.location_region,
    description: row.description,
    images: normalizeJson(row.images, []),
    status: row.status,
    average_rating: Number(row.average_rating),
    supplier: row.supplier_name ? {
      id: row.supplier_id,
      name: row.supplier_name,
      companyName: row.supplier_company,
      city: row.supplier_city,
      region: row.supplier_region
    } : null
  };
}

export function mapBooking(row) {
  return {
    id: row.id,
    machineId: row.machine_id,
    startDate: row.start_date,
    endDate: row.end_date,
    totalDays: Number(row.total_days),
    totalPrice: Number(row.total_price),
    status: row.status,
    deliveryRequired: Boolean(row.delivery_required),
    deliveryAddress: row.delivery_address || '',
    farmerId: row.farmer_id,
    payment: normalizeJson(row.payment_receipt || row.payment, null),
    farmer: row.farmer_name ? {
      id: row.farmer_id,
      name: row.farmer_name,
      city: row.farmer_city,
      region: row.farmer_region
    } : null
  };
}

export function mapNotification(row) {
  return {
    id: row.id,
    text: row.text,
    time: row.time_label,
    isRead: Boolean(row.is_read),
    targetPage: row.target_page
  };
}

function normalizeJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
