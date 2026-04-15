import { MOCK_INVENTORY, MOCK_PREP_LIST, InventoryItem, PrepItem } from '../mock-data';

export interface AgentAction {
  id: string;
  agent: 'Inventory' | 'Prep' | 'Labour';
  type: 'alert' | 'decision';
  message: string;
  timestamp: string;
  status: 'pending' | 'executed' | 'overridden';
  metadata?: any;
}

export class KitchenAgents {
  private actions: AgentAction[] = [];

  // Autonomous Inventory Agent
  static checkInventoryDepletion(inventory: InventoryItem[]): AgentAction[] {
    const alerts: AgentAction[] = [];
    
    inventory.forEach(item => {
      if (item.currentStock < item.minThreshold) {
        alerts.push({
          id: `inv-${Date.now()}-${item.id}`,
          agent: 'Inventory',
          type: 'decision',
          message: `Stock for [${item.name}] is critically low (${item.currentStock} ${item.unit}). Suggesting PO for ${item.minThreshold * 2} ${item.unit}.`,
          timestamp: new Date().toISOString(),
          status: 'pending',
          metadata: { itemId: item.id, reorderQty: item.minThreshold * 2 }
        });
      }
    });

    return alerts;
  }

  // Prep Intelligence Engine
  static forecastPrepNeeds(prepList: PrepItem[], reservationSurge: number): AgentAction[] {
    const decisions: AgentAction[] = [];
    
    if (reservationSurge > 0.1) {
      decisions.push({
        id: `prep-${Date.now()}`,
        agent: 'Prep',
        type: 'decision',
        message: `Forecasting ${(reservationSurge * 100).toFixed(0)}% surge in covers. Adjusting [Salmon Filleting] and [Sushi Rice] quantities.`,
        timestamp: new Date().toISOString(),
        status: 'pending',
        metadata: { surge: reservationSurge }
      });
    }

    return decisions;
  }
}
