import { CustomerThread, ChatMessage } from '../types';
import { BASE_URL } from './apiService';

const API_BASE = BASE_URL;
const STORAGE_KEY = 'ecotex_customer_messages_v1';
const CHATBOT_THREAD_KEY = 'ecotex_active_chatbot_thread_id';
const EVENT_NAME = 'ecotex_messages_updated';

export const INITIAL_THREADS: CustomerThread[] = [
  {
    id: 'msg-101',
    customerName: 'Liam Henderson',
    company: 'Verde Grocers LLC',
    email: 'liam.h@verdegrocers.com',
    phone: '+1 (415) 890-4421',
    subject: '12oz Heavy Canvas Totes with 2-Color Logo Print',
    status: 'In Discussion',
    isUnread: true,
    channel: 'Direct Web Inquiry',
    lastUpdated: '10 mins ago',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Liam Henderson',
        text: 'Hello EcoTex team! We are looking to replace our conventional grocery totes with your 12oz Heavy Canvas bags across 14 California store locations. Could you send physical fabric swatch samples and confirm wholesale lead times for an initial order of 15,000 units with our custom logo?',
        timestamp: 'Yesterday, 10:14 AM',
        channel: 'web'
      },
      {
        id: 'm2',
        sender: 'admin',
        senderName: 'EcoTex Support Team',
        text: 'Hi Liam, thank you for reaching out! Swatch cards for our natural unbleached and forest green heavy canvas have been prepared and dispatched via FedEx Ground. Our standard turnaround for 15,000 screen-printed units is 14 business days from artwork sign-off.',
        timestamp: 'Yesterday, 11:30 AM'
      },
      {
        id: 'm3',
        sender: 'customer',
        senderName: 'Liam Henderson',
        text: 'Awesome, looking forward to inspecting the swatches! Could you also confirm if your team provides high-resolution digital 3D mockup proofs before we start production?',
        timestamp: 'Today, 09:20 AM',
        channel: 'web'
      }
    ]
  },
  {
    id: 'msg-102',
    customerName: 'Sofia Ramirez',
    company: 'Pure Botanicals Co.',
    email: 'sofia@purebotanicals.com',
    phone: '+1 (310) 554-1928',
    subject: 'GOTS Certified Organic Cotton Drawstring Pouches',
    status: 'New',
    isUnread: true,
    channel: 'Contact Form',
    lastUpdated: '45 mins ago',
    messages: [
      {
        id: 'm4',
        sender: 'customer',
        senderName: 'Sofia Ramirez',
        text: 'Hi, we are launching an organic cosmetics skincare line and require 5,000 small organic cotton drawstring pouches (5" x 7") with gold metallic soy-ink logo print. Could you provide a formal price quotation and freight estimate to Los Angeles, CA?',
        timestamp: 'Today, 10:45 AM',
        channel: 'web'
      }
    ]
  }
];

export function getStoredThreads(): CustomerThread[] {
  if (typeof window === 'undefined') return INITIAL_THREADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored threads:', err);
  }
  return INITIAL_THREADS;
}

export async function fetchRemoteThreads(): Promise<CustomerThread[]> {
  try {
    const res = await fetch(`${API_BASE}/messages`);
    if (res.ok) {
      const serverThreads: CustomerThread[] = await res.json();
      if (Array.isArray(serverThreads) && serverThreads.length > 0) {
        const local = getStoredThreads();
        const map = new Map<string, CustomerThread>();
        local.forEach(t => map.set(t.id, t));
        serverThreads.forEach(t => map.set(t.id, t));
        const merged = Array.from(map.values());
        saveStoredThreads(merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Failed to sync remote threads:', err);
  }
  return getStoredThreads();
}

export function saveStoredThreads(threads: CustomerThread[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: threads }));
  } catch (err) {
    console.warn('Failed to save threads:', err);
  }
}

export function getActiveChatbotThreadId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CHATBOT_THREAD_KEY);
}

export function setActiveChatbotThreadId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHATBOT_THREAD_KEY, id);
}

/**
 * Customer sends a message via chatbot. Creates or appends to a thread.
 */
export async function sendCustomerMessage(params: {
  text: string;
  customerName?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
}): Promise<{ thread: CustomerThread; message: ChatMessage }> {
  const threads = getStoredThreads();
  let threadId = getActiveChatbotThreadId();
  let thread = threadId ? threads.find(t => t.id === threadId) : null;

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const customerMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'customer',
    senderName: params.customerName || thread?.customerName || 'Website Visitor',
    text: params.text,
    timestamp: timeFormatted,
    channel: 'web'
  };

  if (!thread) {
    // Generate new thread
    threadId = `chat-${Date.now()}`;
    setActiveChatbotThreadId(threadId);

    thread = {
      id: threadId,
      customerName: params.customerName || 'Website Visitor',
      company: params.company || 'Live Storefront Visitor',
      email: params.email || 'visitor@livechat.ecotexinc.com',
      phone: params.phone || '',
      subject: params.subject || (params.text.length > 40 ? params.text.slice(0, 40) + '...' : params.text),
      status: 'New',
      isUnread: true,
      channel: 'Live Web Chat',
      lastUpdated: 'Just now',
      messages: [customerMsg]
    };

    const updatedThreads = [thread, ...threads];
    saveStoredThreads(updatedThreads);

    // Sync to backend if available
    try {
      fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thread)
      }).catch(() => {});
    } catch {}

    return { thread, message: customerMsg };
  } else {
    // Append to existing thread
    const updatedMessages = [...thread.messages, customerMsg];
    const updatedThread: CustomerThread = {
      ...thread,
      customerName: params.customerName || thread.customerName,
      email: params.email || thread.email,
      phone: params.phone || thread.phone,
      isUnread: true, // Marked unread for admin
      status: thread.status === 'Resolved' ? 'In Discussion' : thread.status,
      lastUpdated: 'Just now',
      messages: updatedMessages
    };

    const updatedThreads = threads.map(t => t.id === updatedThread.id ? updatedThread : t);
    saveStoredThreads(updatedThreads);

    // Sync to backend if available
    try {
      fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedThread)
      }).catch(() => {});
    } catch {}

    return { thread: updatedThread, message: customerMsg };
  }
}

/**
 * Admin sends a reply to a thread
 */
export async function sendAdminReply(threadId: string, text: string): Promise<CustomerThread | null> {
  const threads = getStoredThreads();
  const thread = threads.find(t => t.id === threadId);
  if (!thread) return null;

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const rawPhone = thread.phone || '';
  let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('03') && cleanPhone.length === 11) {
    cleanPhone = '92' + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith('00')) {
    cleanPhone = cleanPhone.slice(2);
  }
  const hasWhatsApp = Boolean(cleanPhone && cleanPhone.length >= 7);
  const hasEmail = Boolean(thread.email && !thread.email.includes('visitor@livechat') && !thread.email.includes('@whatsapp'));

  const adminMsg: ChatMessage = {
    id: `admin-${Date.now()}`,
    sender: 'admin',
    senderName: 'EcoTex Support Team',
    text: text.trim(),
    timestamp: timeFormatted,
    notifications: {
      whatsapp: {
        target: rawPhone || null,
        dispatched: hasWhatsApp,
        url: hasWhatsApp ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text.trim())}` : null
      },
      email: {
        target: thread.email || null,
        dispatched: hasEmail
      }
    }
  };

  const updatedThread: CustomerThread = {
    ...thread,
    status: thread.status === 'New' ? 'In Discussion' : thread.status,
    isUnread: false,
    lastUpdated: 'Just now',
    messages: [...thread.messages, adminMsg]
  };

  const updatedThreads = threads.map(t => t.id === threadId ? updatedThread : t);
  saveStoredThreads(updatedThreads);

  try {
    fetch(`${API_BASE}/messages/${threadId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }).catch(() => {});
  } catch {}

  return updatedThread;
}

/**
 * Subscribe to message updates across browser tabs & components
 */
export function subscribeToMessages(callback: (threads: CustomerThread[]) => void): () => void {
  const handleCustom = (e: Event) => {
    const custom = e as CustomEvent<CustomerThread[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getStoredThreads());
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredThreads());
    }
  };

  window.addEventListener(EVENT_NAME, handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}
