import { NextResponse } from 'next/server';
import { KitchenAgents } from '@/lib/agents';
import { MOCK_INVENTORY, MOCK_PREP_LIST } from '@/lib/mock-data';

export async function GET() {
  // Simulate checking for needs
  const inventoryActions = KitchenAgents.checkInventoryDepletion(MOCK_INVENTORY);
  const prepActions = KitchenAgents.forecastPrepNeeds(MOCK_PREP_LIST, 0.15); // Simulate 15% surge

  const allActions = [...inventoryActions, ...prepActions];

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    actions: allActions,
    status: 'success'
  });
}
