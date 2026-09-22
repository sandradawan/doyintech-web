# Store credit / credit note

Use this instead of cash when the item is unused but you do not want money leaving the business in Ember week.

```
CREDIT NOTE
Business: [Your name]
Customer: [Name] · WhatsApp: [phone]
Original order: [ORD] · Date: [YYYY-MM-DD]
Reason: [wrong size / change of mind / delay]
Credit value: ₦[amount]
Valid until: [date + 30 days]
Rules: not transferable, not cashable, one WhatsApp number.
Issued by: [staff] · Date: [today]
```

WhatsApp send:
> Credit note [CN-0XX] for ₦[amount] is on your number until [date]. Reply with the new item when you are ready. Credit is not cash.

Sheet column: log `credit_expiry` and set a reminder 5 days before it dies.
