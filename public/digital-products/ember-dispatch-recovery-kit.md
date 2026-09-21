# Ember Dispatch & Failed-Delivery Recovery Kit — instant download

Full working files also live in `digital-products/16-ember-dispatch-recovery-kit/` (ZIP that folder after a Paystack sale if the buyer wants the pack).

## Ember default

- Paid before 2:00pm WAT → same-day dispatch if stock is ready.
- Above ₦15,000 → 100% prepaid from 1 October. No POD arguments at the gate.
- Two attempts included. Third attempt is a paid retry.

## Rider brief (one message)

Parcel ID · name · phone · address · gate code · items (no prices) · collect ₦0 or ₦X · window · photo required.
Call twice. No gateman unless customer types YES. Do not argue price.

## Failed-delivery opener

Hi [Name], rider is at [landmark] with [SKU]. Reply NOW: A) Coming out B) Leave with [person] C) New window. 10 minutes or the rider leaves.

## After two fails

Paused. Send a firm window this week or the order becomes store credit minus rider fees.

## Sheet columns

parcel_id, order_date, customer, phone, city, sku_qty, payment, rider, rider_fee_ngn, window, attempt, status, retry_date, notes

Import `csv/dispatch-log.csv` to start the log.
