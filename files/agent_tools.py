"""
agent_tools.py — Tool definitions passed to the LLM (Claude / GPT-4o).
Member 1 owns this file. Member 3 imports TOOLS directly.

These follow the Anthropic tool-use schema. If you switch to OpenAI,
the shape is identical — just pass under the "tools" key with "function" wrapper.
"""

TOOLS = [
    {
        "name": "read_kitchen_state",
        "description": (
            "Returns the full current state of the restaurant: all orders "
            "(with statuses and ages), inventory levels, and staff counts. "
            "Always call this first before deciding on any action."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "update_order_status",
        "description": (
            "Moves an order to a new status. Use this when a stale 'pending' "
            "order should be escalated to 'preparing', or a 'preparing' order "
            "should be marked 'ready'. Do not mark an order 'served' autonomously."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The orderId field from the order object."
                },
                "new_status": {
                    "type": "string",
                    "enum": ["preparing", "ready"],
                    "description": "The target status. Only 'preparing' or 'ready' allowed."
                }
            },
            "required": ["order_id", "new_status"]
        }
    },
    {
        "name": "flag_restock",
        "description": (
            "Flags a menu item as needing urgent restocking. Use when stock <= 3 "
            "or when the item is completely out of stock. Include a short reason "
            "explaining the urgency."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "item_id": {
                    "type": "string",
                    "description": "The itemId of the menu item to flag."
                },
                "reason": {
                    "type": "string",
                    "description": "Brief reason for flagging, e.g. 'Stock at 2, high demand item'."
                }
            },
            "required": ["item_id", "reason"]
        }
    },
    {
        "name": "escalate_order_priority",
        "description": (
            "Raises the priority of an order to 'urgent'. Use for orders that "
            "have been pending more than 20 minutes or where the table has "
            "multiple pending orders."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The orderId to escalate."
                },
                "reason": {
                    "type": "string",
                    "description": "Why this order is being escalated."
                }
            },
            "required": ["order_id", "reason"]
        }
    },
    {
        "name": "log_agent_decision",
        "description": (
            "Appends a timestamped note to the agent_log in the data store. "
            "Always call this once at the end of your turn to record your "
            "reasoning and what actions you took."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "note": {
                    "type": "string",
                    "description": "A 1-2 sentence summary of what you observed and did."
                }
            },
            "required": ["note"]
        }
    }
]


# ---------------------------------------------------------------------------
# System prompt for the agent — import this in agent.py
# ---------------------------------------------------------------------------

AGENT_SYSTEM_PROMPT = """You are an autonomous kitchen operations manager for a busy restaurant.
Your job is to monitor kitchen state and take corrective actions using the tools available.

Rules you must follow:
1. Always call read_kitchen_state first to get the latest data.
2. Flag any item with stock <= 3 for restock.
3. Escalate any order that has been pending for more than 15 minutes.
4. Move stale preparing orders (>20 min) to ready if all items are in stock.
5. Never mark an order as 'served' — that requires human confirmation.
6. Always call log_agent_decision at the end with a summary of your actions.
7. Be concise. Take only necessary actions — don't act on healthy state.

After all tool calls, respond with a plain-English summary of what you found and what you did."""
