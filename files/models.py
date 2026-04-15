"""
models.py — Pydantic schemas for all API request bodies and shared types.
Member 1 owns this file. Members 2 and 3 import from here — do not rename fields.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


# ---------------------------------------------------------------------------
# Enums / Literal types
# ---------------------------------------------------------------------------

OrderStatus = Literal["pending", "preparing", "ready", "served"]
ItemCategory = Literal["main", "starter", "drink", "dessert"]
OrderPriority = Literal["normal", "high", "urgent"]
AlertSeverity = Literal["low", "medium", "high"]
AlertType = Literal["LOW_STOCK", "STALE_ORDER", "PEAK_LOAD", "OUT_OF_STOCK"]


# ---------------------------------------------------------------------------
# Core domain objects (mirrors data.json shape exactly)
# ---------------------------------------------------------------------------

class MenuItem(BaseModel):
    """A single item on the menu with current stock level."""
    itemId: str
    name: str
    price: float
    category: ItemCategory
    stock: int
    prepTimeMinutes: int


class Order(BaseModel):
    """A placed order as stored in data.json."""
    orderId: str
    tableNo: int
    items: List[str]              # list of itemIds
    status: OrderStatus
    createdAt: str                # ISO 8601 string to stay JSON-serialisable
    priority: OrderPriority = "normal"
    notes: str = ""


class StaffState(BaseModel):
    currentChefs: int
    currentWaiters: int


class RestaurantState(BaseModel):
    """Full snapshot returned by GET /state — used by the agent."""
    menu: List[MenuItem]
    orders: List[Order]
    staff: StaffState
    restock_flags: List[str] = []
    agent_log: List[str] = []


# ---------------------------------------------------------------------------
# Request bodies (Member 2 uses these in route signatures)
# ---------------------------------------------------------------------------

class NewOrder(BaseModel):
    """POST /orders request body."""
    tableNo: int = Field(..., ge=1, description="Table number, must be >= 1")
    items: List[str] = Field(..., min_length=1, description="List of itemIds")
    priority: OrderPriority = "normal"
    notes: str = ""


class StatusUpdate(BaseModel):
    """PATCH /orders/{id}/status request body."""
    status: OrderStatus


class StockUpdate(BaseModel):
    """PATCH /inventory/{id} request body."""
    stock: int = Field(..., ge=0, description="New absolute stock value")


# ---------------------------------------------------------------------------
# Response shapes (used by Members 2 and 3 for consistent API responses)
# ---------------------------------------------------------------------------

class OrderResponse(BaseModel):
    message: str
    order: Order


class InventoryItemResponse(BaseModel):
    message: str
    item: MenuItem


class Alert(BaseModel):
    """A single autonomous alert raised by the alerts endpoint or the agent."""
    type: AlertType
    severity: AlertSeverity
    message: str
    itemId: Optional[str] = None   # set for LOW_STOCK / OUT_OF_STOCK alerts
    orderId: Optional[str] = None  # set for STALE_ORDER alerts


class AlertsResponse(BaseModel):
    total_alerts: int
    alerts: List[Alert]


class SuggestionsResponse(BaseModel):
    activeOrders: int
    staffingSuggestion: str
    removeFromMenuToday: object     # list[str] or the string "All items available"
    recommendedAction: str


# ---------------------------------------------------------------------------
# Agent-specific schemas (Member 3 uses these)
# ---------------------------------------------------------------------------

class AgentAction(BaseModel):
    """One tool call the LLM agent executed, recorded for the response."""
    tool: str
    input: dict
    result: dict


class AgentActResponse(BaseModel):
    """Response from GET /agent/act."""
    actions: List[AgentAction]
    summary: str
    actions_taken_count: int
