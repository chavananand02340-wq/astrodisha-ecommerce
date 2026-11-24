-- MRP / original price for products (optional).
-- `price` stays the selling price the customer pays (cart, checkout and Razorpay
-- keep using it). When `compare_at_price` is set higher than `price`, the website
-- shows it struck through with a "% OFF" badge.
--
-- Run once in Supabase → SQL Editor → New query → paste → Run.

alter table public.products
  add column if not exists compare_at_price numeric(10, 2);

alter table public.products
  drop constraint if exists products_compare_at_price_positive;

alter table public.products
  add constraint products_compare_at_price_positive
  check (compare_at_price is null or compare_at_price > 0);

-- Make the new column visible to the API straight away
notify pgrst, 'reload schema';
