#!/usr/bin/env node

const BASE = process.env.BASE_URL || 'http://localhost:8080'

async function req(path, { method = 'GET', token, json, headers = {} } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: json ? JSON.stringify(json) : undefined
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`)
  return data
}

async function login(email, password) {
  const data = await req('/api/auth/login', { method: 'POST', json: { email, password } })
  if (!data?.token) throw new Error('No token returned for ' + email)
  return data.token
}

async function firstRestaurantId() {
  const list = await req('/api/restaurants')
  if (!Array.isArray(list) || !list.length) throw new Error('No restaurants')
  return list[0].id
}

async function firstMenuItemId(restaurantId) {
  // Fallback: use popular items instead of per-restaurant to avoid env-specific 500s
  const items = await req(`/api/menu/popular`)
  if (!Array.isArray(items) || !items.length) throw new Error('No popular menu items available')
  return items[0].id
}

async function addToCart(token, menuItemId, qty = 1) {
  return req(`/api/cart/add/${menuItemId}?qty=${qty}`, { method: 'POST', token })
}

async function createOrder(token) {
  return req('/api/orders/create', { method: 'POST', token })
}

async function markPaid(token, orderId) {
  return req(`/api/orders/${orderId}/mark-paid?paymentId=dummy_pay_123`, { method: 'POST', token })
}

async function track(orderId) {
  return req(`/api/orders/${orderId}/track`)
}

async function updateStatus(token, orderId, status) {
  return req(`/api/orders/${orderId}/status?status=${status}`, { method: 'POST', token })
}

async function run() {
  console.log('Starting E2E order flow against', BASE)

  const customerEmail = process.env.CUST_EMAIL || 'customer@flashfoods.com'
  const customerPass = process.env.CUST_PASS || 'customer123'
  const ownerEmail = process.env.OWNER_EMAIL || 'owner@flashfoods.com'
  const ownerPass = process.env.OWNER_PASS || 'owner123'

  const customerToken = await login(customerEmail, customerPass)
  console.log('Customer login ok')

  const rid = await firstRestaurantId()
  console.log('Restaurant id', rid)

  const mid = await firstMenuItemId(rid)
  console.log('Menu item id', mid)

  await addToCart(customerToken, mid, 2)
  console.log('Added to cart')

  const { orderId, amount } = await createOrder(customerToken)
  console.log('Order created', { orderId, amount })

  await markPaid(customerToken, orderId)
  console.log('Order marked paid')

  let t = await track(orderId)
  console.log('Track after pay', t)

  const ownerToken = await login(ownerEmail, ownerPass)
  console.log('Owner login ok')

  await updateStatus(ownerToken, orderId, 'DISPATCHED')
  console.log('Order dispatched')

  await updateStatus(ownerToken, orderId, 'DELIVERED')
  console.log('Order delivered')

  t = await track(orderId)
  console.log('Final track', t)
}

run().catch(err => { console.error('E2E failed:', err.message); process.exit(1) })