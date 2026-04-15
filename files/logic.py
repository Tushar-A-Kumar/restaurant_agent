"""
logic.py — Pure utility functions. No FastAPI imports here.
Member 1 owns this file. Members 2 and 3 import from it freely.
"""

import json
from datetime import datetime

DATA_FILE = "data.json"


# ---------------------------------------------------------------------------
# I/O helpers
# ---------------------------------------------------------------------------

def load_data() -> dict:
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_data(data: dict) -> None:
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


# ---------------------------------------------------------------------------
# Rule-based helpers (used by /alerts endpoint and the agent executor)
# ---------------------------------------------------------------------------

def check_low_stock(menu: list, threshold: int = 5) -> list:
    """Returns menu items at or below threshold stock."""
    return [item for item in menu if item["stock"] <= threshold]


def check_stale_orders(orders: list, minutes: int = 15) -> list:
    """Returns pending orders older than `minutes`."""
    stale = []
    now = datetime.now()
    for order in orders:
        created = datetime.fromisoformat(order["createdAt"])
        age_minutes = (now - created).total_seconds() / 60
        if order["status"] == "pending" and age_minutes > minutes:
            stale.append(order)
    return stale


def get_order_age_minutes(order: dict) -> float:
    """Returns how many minutes ago an order was created."""
    created = datetime.fromisoformat(order["createdAt"])
    return (datetime.now() - created).total_seconds() / 60


def get_staffing_suggestion(order_count: int, current_chefs: int) -> str:
    if order_count > 10:
        extra = max(1, order_count // 5 - current_chefs)
        return f"High load! Add {extra} more chef(s)."
    elif order_count < 3:
        return "Low load. Current staff is sufficient."
    else:
        return "Moderate load. Staff levels are fine."


def get_item_by_id(menu: list, item_id: str) -> dict | None:
    """Looks up a menu item by itemId. Returns None if not found."""
    return next((item for item in menu if item["itemId"] == item_id), None)


def get_order_by_id(orders: list, order_id: str) -> dict | None:
    """Looks up an order by orderId. Returns None if not found."""
    return next((o for o in orders if o["orderId"] == order_id), None)


def build_state_summary(data: dict) -> str:
    """
    Returns a compact plain-text summary of kitchen state.
    Used as context when calling the LLM agent so it doesn't need
    to parse raw JSON itself.
    """
    lines = ["=== KITCHEN STATE SNAPSHOT ==="]

    lines.append("\n-- ORDERS --")
    for o in data["orders"]:
        age = get_order_age_minutes(o)
        lines.append(
            f"  [{o['orderId']}] Table {o['tableNo']} | "
            f"status={o['status']} | priority={o.get('priority','normal')} | "
            f"age={age:.0f}min | items={','.join(o['items'])}"
        )

    lines.append("\n-- INVENTORY --")
    for item in data["menu"]:
        flag = " ⚠ LOW" if item["stock"] <= 3 else (" ! WARN" if item["stock"] <= 5 else "")
        lines.append(
            f"  [{item['itemId']}] {item['name']}: stock={item['stock']}{flag}"
        )

    lines.append("\n-- STAFF --")
    lines.append(
        f"  Chefs: {data['staff']['currentChefs']} | "
        f"Waiters: {data['staff']['currentWaiters']}"
    )

    if data.get("restock_flags"):
        lines.append("\n-- RESTOCK FLAGS --")
        for flag in data["restock_flags"]:
            lines.append(f"  {flag}")

    return "\n".join(lines)
