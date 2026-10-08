import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AdminActivityLog {
  id?: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  createdAt?: any;
}

export async function logAdminActivity(logData: AdminActivityLog): Promise<void> {
  try {
    const col = collection(db, 'auditLogs');
    await addDoc(col, {
      ...logData,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    // Audit log failures should not block critical administrative operations
    console.warn('Audit logging error:', err);
  }
}

export async function getRecentAuditLogs(maxCount = 20): Promise<AdminActivityLog[]> {
  try {
    const col = collection(db, 'auditLogs');
    let snap;
    try {
      const q = query(col, orderBy('createdAt', 'desc'), limit(maxCount));
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(col);
    }

    const logs: AdminActivityLog[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        adminId: data.adminId || '',
        adminEmail: data.adminEmail || '',
        action: data.action || '',
        targetType: data.targetType || '',
        targetId: data.targetId || '',
        details: data.details || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
      });
    });

    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return logs;
  } catch (err) {
    console.warn('Failed to fetch audit logs:', err);
    return [];
  }
}
