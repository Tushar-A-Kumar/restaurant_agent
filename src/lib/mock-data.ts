export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  lastOrdered?: string;
}

export interface PrepItem {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  neededQuantity: number;
  currentQuantity: number;
  unit: string;
  deadline: string;
  station: string;
}

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Fresh Salmon', category: 'Proteins', currentStock: 4.5, unit: 'kg', minThreshold: 10, costPerUnit: 25.50, lastOrdered: '2026-04-14' },
  { id: '2', name: 'Avocado', category: 'Produce', currentStock: 12, unit: 'pcs', minThreshold: 15, costPerUnit: 1.20, lastOrdered: '2026-04-13' },
  { id: '3', name: 'Heavy Cream', category: 'Dairy', currentStock: 8, unit: 'L', minThreshold: 5, costPerUnit: 4.50, lastOrdered: '2026-04-15' },
  { id: '4', name: 'Unsalted Butter', category: 'Dairy', currentStock: 2, unit: 'kg', minThreshold: 5, costPerUnit: 8.00, lastOrdered: '2026-04-10' },
  { id: '5', name: 'Kosher Salt', category: 'Dry Goods', currentStock: 15, unit: 'kg', minThreshold: 5, costPerUnit: 0.80 },
];

export const MOCK_PREP_LIST: PrepItem[] = [
  { id: 'p1', name: 'Salmon Filleting', status: 'in-progress', neededQuantity: 20, currentQuantity: 8, unit: 'portions', deadline: '11:00 AM', station: 'Grill' },
  { id: 'p2', name: 'Wasabi Aioli', status: 'pending', neededQuantity: 5, currentQuantity: 0, unit: 'L', deadline: '10:30 AM', station: 'Cold Kitchen' },
  { id: 'p3', name: 'Pickled Ginger', status: 'completed', neededQuantity: 2, currentQuantity: 2, unit: 'kg', deadline: '09:00 AM', station: 'Prep' },
  { id: 'p4', name: 'Sushi Rice', status: 'pending', neededQuantity: 15, currentQuantity: 0, unit: 'kg', deadline: '11:30 AM', station: 'Rice' },
];

export const MOCK_AGENT_LOGS = [
  { id: 'l1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), message: 'Autonomous Inventory Agent detected low stock for [Fresh Salmon] (4.5kg < 10kg).', type: 'info' },
  { id: 'l2', timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(), message: 'Agent generated Purchase Order #8821 for 15kg [Fresh Salmon]. Awaiting GM approval.', type: 'action' },
  { id: 'l3', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), message: 'Prep Intelligence Engine adjusted [Wasabi Aioli] quantity (+2L) based on 10% increase in tonight\'s reservations.', type: 'info' },
];
