# Ember Returns, Swap & Credit Note Kit

7-day policy, swap scripts, credit notes, refund-last scripts, and a Sheets log so Ember volume does not become a refund queue.

## 7-day rule
Window starts when the customer confirms receipt. Unused + photo. Food, custom, FINAL sale: no return. Our packing error: we pay rider. Change of mind: customer pays rider.

## Decision order
1. Swap if stock exists.
2. 30-day store credit (not cash).
3. Refund to original account only after the item is back.

## Swap opener
Hi [Name], send 2 photos (tag + issue). If we packed wrong, rider is on us. If it is a colour change, rider is ₦[fee].

## Credit note line
Credit [CN-0XX] for ₦[amount] sits on this number until [date]. Not transferable, not cash.

## Refund line
Refund starts when the parcel is in my hand and unused. Same Paystack/transfer account. 24 hours after check-in.

## Ember cut-off
Last return drop 18 Dec 2026.

Import `csv/returns-log.csv`. One row per case.
