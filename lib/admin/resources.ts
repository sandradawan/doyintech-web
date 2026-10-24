/**
 * Admin CRM resource registry: every table the live site uses, with typed fields.
 * Shared by the CRUD API (validation, search, permissions) and the admin UI (tables, forms).
 * Contains no secrets; sensitive columns are marked `hidden` and never leave the server.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "url"
  | "number"
  | "kobo" // stored in kobo, shown/edited in naira
  | "naira" // stored in whole naira
  | "select"
  | "boolean"
  | "date"
  | "datetime"
  | "json";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
  /** Shown but never written by the admin (system-managed). */
  readOnly?: boolean;
  /** Never sent to the browser (tokens, secrets). */
  hidden?: boolean;
  /** Shown as a column in the list view. */
  list?: boolean;
  /** Settable when creating even though it's read-only afterwards (e.g. a text primary key). */
  createOnly?: boolean;
  hint?: string;
};

export type Resource = {
  id: string; // table name
  label: string;
  singular: string;
  group: "CRM" | "Sales" | "DoyinTech Store" | "Services" | "Marketing" | "System";
  description: string;
  pk: string;
  orderBy: string;
  titleField: string;
  fields: Field[];
  /** Text columns searched with the search box. */
  search: string[];
  /** Columns offered as filter dropdowns (must be select or boolean fields). */
  filters?: string[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  createDefaults?: Record<string, unknown>;
  /** Column holding a person's email, used to link records to the contact view. */
  emailField?: string;
  warning?: string;
};

export const LEAD_STAGES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export const ACTIVITY_KINDS = ["note", "call", "whatsapp", "email", "meeting", "task"] as const;

const created: Field = { key: "created_at", label: "Created", type: "datetime", readOnly: true, list: true };
const updated: Field = { key: "updated_at", label: "Updated", type: "datetime", readOnly: true };
const uuid = (key = "id", label = "ID"): Field => ({ key, label, type: "text", readOnly: true });

export const RESOURCES: Resource[] = [
  // ─── CRM ──────────────────────────────────────────────────────────────
  {
    id: "site_leads",
    label: "Leads & deals",
    singular: "Lead",
    group: "CRM",
    description: "Every enquiry, audit request and purchase. Move them through the pipeline.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    emailField: "email",
    search: ["name", "email", "phone", "company", "product", "message", "notes"],
    filters: ["status", "type"],
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createDefaults: { status: "new", type: "manual", product: "General", source: "admin" },
    fields: [
      uuid(),
      { key: "name", label: "Name", type: "text", required: true, list: true },
      { key: "company", label: "Company", type: "text", list: true },
      { key: "email", label: "Email", type: "email", list: true },
      { key: "phone", label: "Phone", type: "phone" },
      { key: "status", label: "Stage", type: "select", options: LEAD_STAGES, list: true },
      { key: "value_ngn", label: "Deal value (₦)", type: "naira", list: true },
      { key: "next_follow_up", label: "Next follow-up", type: "date", list: true },
      { key: "product", label: "Interested in", type: "text" },
      {
        key: "type",
        label: "Lead type",
        type: "select",
        options: ["manual", "audit", "purchase", "waitlist", "lead-magnet", "chat", "maintenance", "referral"],
      },
      { key: "owner", label: "Owner", type: "text" },
      { key: "source", label: "Source", type: "text" },
      { key: "message", label: "Their message", type: "textarea" },
      { key: "notes", label: "Private notes", type: "textarea" },
      created,
      updated,
    ],
  },
  {
    id: "crm_activities",
    label: "Activities & tasks",
    singular: "Activity",
    group: "CRM",
    description: "Notes, calls, WhatsApp chats, meetings and follow-up tasks.",
    pk: "id",
    orderBy: "created_at",
    titleField: "body",
    emailField: "contact_email",
    search: ["body", "contact_email", "created_by"],
    filters: ["kind", "done"],
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createDefaults: { kind: "note", done: false },
    fields: [
      uuid(),
      { key: "kind", label: "Type", type: "select", options: ACTIVITY_KINDS, list: true },
      { key: "body", label: "Details", type: "textarea", required: true, list: true },
      { key: "contact_email", label: "Contact email", type: "email", list: true },
      { key: "lead_id", label: "Lead ID", type: "text", hint: "Optional: links this to a lead" },
      { key: "due_at", label: "Due", type: "datetime", list: true },
      { key: "done", label: "Done", type: "boolean", list: true },
      { key: "created_by", label: "By", type: "text", readOnly: true },
      created,
    ],
  },
  {
    id: "email_subscribers",
    label: "Email subscribers",
    singular: "Subscriber",
    group: "Marketing",
    description: "People on the follow-up email sequences.",
    pk: "id",
    orderBy: "created_at",
    titleField: "email",
    emailField: "email",
    search: ["email", "name", "source", "referral"],
    filters: ["sequence"],
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createDefaults: { sequence: "general", step: 0 },
    fields: [
      uuid(),
      { key: "email", label: "Email", type: "email", required: true, list: true },
      { key: "name", label: "Name", type: "text", list: true },
      { key: "sequence", label: "Sequence", type: "select", options: ["general", "tools", "lead", "store"], list: true },
      { key: "step", label: "Last email sent (#)", type: "number", list: true },
      { key: "next_send_at", label: "Next email", type: "datetime", list: true, hint: "Clear to pause the sequence" },
      { key: "source", label: "Source", type: "text" },
      { key: "referral", label: "Referral", type: "text" },
      { key: "converted_at", label: "Became a customer", type: "datetime" },
      { key: "unsubscribed_at", label: "Unsubscribed", type: "datetime" },
      { key: "unsubscribe_token", label: "Token", type: "text", hidden: true },
      created,
    ],
  },

  // ─── Sales ────────────────────────────────────────────────────────────
  {
    id: "subscriptions",
    label: "Subscriptions",
    singular: "Subscription",
    group: "Sales",
    description: "DoyinTech Pro, care plans and Store plans billed by Paystack.",
    pk: "id",
    orderBy: "created_at",
    titleField: "email",
    emailField: "email",
    search: ["email", "plan_id", "subscription_code", "customer_code"],
    filters: ["status", "plan_id"],
    canCreate: false,
    canUpdate: true,
    canDelete: false,
    warning: "Paystack is the billing source of truth. Editing here changes access on the site, not billing.",
    fields: [
      uuid(),
      { key: "email", label: "Email", type: "email", list: true },
      {
        key: "plan_id",
        label: "Plan",
        type: "select",
        options: ["pro-monthly", "pro-annual", "care-essential", "care-growth", "store-monthly", "store-annual"],
        list: true,
      },
      { key: "status", label: "Status", type: "select", options: ["active", "non-renewing", "attention", "cancelled", "completed"], list: true },
      { key: "amount_kobo", label: "Amount", type: "kobo", readOnly: true, list: true },
      { key: "next_payment_date", label: "Next payment", type: "datetime", list: true },
      { key: "subscription_code", label: "Paystack subscription", type: "text", readOnly: true },
      { key: "customer_code", label: "Paystack customer", type: "text", readOnly: true },
      { key: "plan_code", label: "Paystack plan", type: "text", readOnly: true },
      { key: "last_payment_reference", label: "Last payment ref", type: "text", readOnly: true },
      { key: "email_token", label: "Email token", type: "text", hidden: true },
      { key: "metadata", label: "Metadata", type: "json", readOnly: true },
      created,
      updated,
    ],
  },
  {
    id: "payment_claims",
    label: "Payments ledger",
    singular: "Payment",
    group: "Sales",
    description: "Every successful Paystack payment the webhook processed (read-only).",
    pk: "reference",
    orderBy: "created_at",
    titleField: "reference",
    emailField: "email",
    search: ["reference", "email", "product_id"],
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    fields: [
      { key: "reference", label: "Reference", type: "text", readOnly: true, list: true },
      { key: "kind", label: "Source", type: "text", readOnly: true, list: true },
      { key: "product_id", label: "Product", type: "text", readOnly: true, list: true },
      { key: "email", label: "Email", type: "email", readOnly: true, list: true },
      { key: "amount_kobo", label: "Amount", type: "kobo", readOnly: true, list: true },
      created,
    ],
  },
  {
    id: "report_orders",
    label: "Report Studio orders",
    singular: "Report order",
    group: "Services",
    description: "Social and brand presence reports.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    emailField: "email",
    search: ["order_id", "name", "email", "product_name", "profile_url"],
    filters: ["status"],
    canCreate: false,
    canUpdate: true,
    canDelete: true,
    fields: [
      uuid(),
      { key: "order_id", label: "Order", type: "text", readOnly: true, list: true },
      { key: "name", label: "Customer", type: "text", list: true },
      { key: "email", label: "Email", type: "email", list: true },
      { key: "phone", label: "Phone", type: "phone" },
      { key: "product_name", label: "Report", type: "text", readOnly: true, list: true },
      { key: "price_ngn", label: "Price", type: "naira", readOnly: true, list: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["pending_payment", "paid", "processing", "delivered", "completed", "failed", "cancelled"],
        list: true,
      },
      { key: "profile_url", label: "Profile URL", type: "url" },
      { key: "business_category", label: "Category", type: "text" },
      { key: "business_objective", label: "Objective", type: "textarea" },
      { key: "target_audience", label: "Audience", type: "textarea" },
      { key: "notes", label: "Customer notes", type: "textarea" },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
      { key: "paystack_ref", label: "Paystack ref", type: "text", readOnly: true },
      { key: "amount_paid_ngn", label: "Amount paid", type: "naira", readOnly: true },
      { key: "delivered_at", label: "Delivered", type: "datetime", readOnly: true },
      { key: "error_message", label: "Error", type: "textarea", readOnly: true },
      { key: "delivery_token", label: "Delivery token", type: "text", hidden: true },
      { key: "report_content", label: "Report", type: "json", hidden: true },
      { key: "source_data", label: "Source data", type: "json", hidden: true },
      created,
      updated,
    ],
  },
  {
    id: "report_products",
    label: "Report products",
    singular: "Report product",
    group: "Services",
    description: "Reports on sale in Report Studio.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    search: ["id", "name", "report_type"],
    filters: ["is_active"],
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createDefaults: { is_active: true },
    fields: [
      { key: "id", label: "Product ID", type: "text", required: true, readOnly: true, createOnly: true, list: true, hint: "e.g. instagram-audit" },
      { key: "name", label: "Name", type: "text", required: true, list: true },
      { key: "report_type", label: "Report type", type: "text", required: true, list: true },
      { key: "price_ngn", label: "Price (₦)", type: "naira", required: true, list: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "is_active", label: "On sale", type: "boolean", list: true },
      created,
    ],
  },
  {
    id: "student_projects",
    label: "Student projects",
    singular: "Student project",
    group: "Services",
    description: "Guided research support requests and their payments.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    emailField: "email",
    search: ["request_id", "name", "email", "topic", "school"],
    filters: ["status"],
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createDefaults: { status: "pending_payment", stage: "received", package_id: "manual", package_name: "Manual entry", amount_ngn: 0 },
    fields: [
      uuid(),
      { key: "request_id", label: "Request", type: "text", readOnly: true, list: true },
      { key: "name", label: "Student", type: "text", required: true, list: true },
      { key: "email", label: "Email", type: "email", required: true, list: true },
      { key: "phone", label: "Phone", type: "phone" },
      { key: "topic", label: "Topic", type: "textarea", required: true },
      { key: "package_name", label: "Package", type: "text", list: true },
      { key: "amount_ngn", label: "Amount (₦)", type: "naira", list: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["pending_payment", "deposit_paid", "in_progress", "awaiting_balance", "fully_paid", "completed", "cancelled"],
        list: true,
      },
      { key: "stage", label: "Stage", type: "text" },
      { key: "school", label: "School", type: "text" },
      { key: "level", label: "Level", type: "text" },
      { key: "deadline", label: "Deadline", type: "text" },
      { key: "notes", label: "Student notes", type: "textarea" },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
      { key: "paystack_ref", label: "Paystack ref", type: "text", readOnly: true },
      created,
      updated,
    ],
  },

  // ─── DoyinTech Store ──────────────────────────────────────────────────
  {
    id: "storefronts",
    label: "Seller shops",
    singular: "Shop",
    group: "DoyinTech Store",
    description: "Approve online payments by setting Payments to active.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    emailField: "owner_email",
    search: ["name", "slug", "owner_email", "whatsapp", "account_name"],
    filters: ["payments_status", "is_published"],
    canCreate: false,
    canUpdate: true,
    canDelete: true,
    fields: [
      uuid(),
      { key: "name", label: "Shop", type: "text", required: true, list: true },
      { key: "slug", label: "Link", type: "text", readOnly: true, list: true },
      { key: "owner_email", label: "Owner", type: "email", readOnly: true, list: true },
      { key: "whatsapp", label: "WhatsApp", type: "phone" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "featured_until", label: "Sponsored until", type: "datetime", list: true, hint: "Set a date to feature this shop at the top of /shops" },
      { key: "is_published", label: "Visible", type: "boolean", list: true },
      {
        key: "payments_status",
        label: "Payments",
        type: "select",
        options: ["off", "pending_review", "active", "rejected"],
        list: true,
        hint: "Set to active after checking the shop is genuine",
      },
      { key: "account_name", label: "Payout account", type: "text", readOnly: true },
      { key: "bank_name", label: "Bank", type: "text", readOnly: true },
      { key: "account_last4", label: "Account (last 4)", type: "text", readOnly: true },
      { key: "paystack_subaccount_code", label: "Paystack subaccount", type: "text", readOnly: true },
      { key: "delivery_zones", label: "Delivery areas", type: "json", readOnly: true },
      { key: "owner_id", label: "Owner user ID", type: "text", hidden: true },
      created,
      updated,
    ],
  },
  {
    id: "storefront_boosts",
    label: "Sponsored listings",
    singular: "Sponsored listing",
    group: "DoyinTech Store",
    description: "Sellers paying to appear first in the /shops directory.",
    pk: "id",
    orderBy: "created_at",
    titleField: "reference",
    search: ["reference"],
    filters: ["status"],
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    fields: [
      uuid(),
      { key: "reference", label: "Reference", type: "text", readOnly: true, list: true },
      { key: "days", label: "Days", type: "number", readOnly: true, list: true },
      { key: "amount_kobo", label: "Amount", type: "kobo", readOnly: true, list: true },
      { key: "status", label: "Status", type: "select", options: ["pending", "paid", "failed"], readOnly: true, list: true },
      { key: "starts_at", label: "Starts", type: "datetime", readOnly: true },
      { key: "ends_at", label: "Ends", type: "datetime", readOnly: true, list: true },
      { key: "store_id", label: "Shop ID", type: "text", readOnly: true },
      { key: "paid_at", label: "Paid", type: "datetime", readOnly: true },
      created,
    ],
  },
  {
    id: "storefront_products",
    label: "Shop products",
    singular: "Shop product",
    group: "DoyinTech Store",
    description: "Products listed in seller shops.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    search: ["name", "description"],
    filters: ["in_stock"],
    canCreate: false,
    canUpdate: true,
    canDelete: true,
    fields: [
      uuid(),
      { key: "name", label: "Product", type: "text", required: true, list: true },
      { key: "price_kobo", label: "Price", type: "kobo", required: true, list: true },
      { key: "in_stock", label: "In stock", type: "boolean", list: true },
      { key: "store_id", label: "Shop ID", type: "text", readOnly: true, list: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image", type: "url", readOnly: true },
      { key: "sort", label: "Sort", type: "number" },
      created,
    ],
  },
  {
    id: "storefront_orders",
    label: "Shop orders",
    singular: "Shop order",
    group: "DoyinTech Store",
    description: "Orders customers paid online in seller shops.",
    pk: "id",
    orderBy: "created_at",
    titleField: "reference",
    emailField: "customer_email",
    search: ["reference", "customer_name", "customer_email", "customer_phone", "discount_code"],
    filters: ["status"],
    canCreate: false,
    canUpdate: true,
    canDelete: true,
    fields: [
      uuid(),
      { key: "reference", label: "Reference", type: "text", readOnly: true, list: true },
      { key: "customer_name", label: "Customer", type: "text", readOnly: true, list: true },
      { key: "customer_email", label: "Email", type: "email", readOnly: true },
      { key: "customer_phone", label: "Phone", type: "phone", readOnly: true },
      { key: "amount_kobo", label: "Total", type: "kobo", readOnly: true, list: true },
      { key: "status", label: "Status", type: "select", options: ["pending", "paid", "cancelled"], list: true },
      { key: "platform_fee_kobo", label: "Our fee", type: "kobo", readOnly: true, list: true },
      { key: "delivery_zone", label: "Delivery area", type: "text", readOnly: true },
      { key: "delivery_fee_kobo", label: "Delivery fee", type: "kobo", readOnly: true },
      { key: "delivery_address", label: "Address / note", type: "textarea", readOnly: true },
      { key: "discount_code", label: "Discount code", type: "text", readOnly: true },
      { key: "discount_kobo", label: "Discount", type: "kobo", readOnly: true },
      { key: "items", label: "Items", type: "json", readOnly: true },
      { key: "store_id", label: "Shop ID", type: "text", readOnly: true },
      { key: "paid_at", label: "Paid", type: "datetime", readOnly: true },
      created,
    ],
  },
  {
    id: "storefront_discounts",
    label: "Shop discount codes",
    singular: "Discount code",
    group: "DoyinTech Store",
    description: "Codes sellers created for their shops.",
    pk: "id",
    orderBy: "created_at",
    titleField: "code",
    search: ["code"],
    filters: ["active"],
    canCreate: false,
    canUpdate: true,
    canDelete: true,
    fields: [
      uuid(),
      { key: "code", label: "Code", type: "text", readOnly: true, list: true },
      { key: "percent_off", label: "% off", type: "number", readOnly: true, list: true },
      { key: "amount_off_kobo", label: "₦ off", type: "kobo", readOnly: true, list: true },
      { key: "uses", label: "Uses", type: "number", readOnly: true, list: true },
      { key: "max_uses", label: "Max uses", type: "number" },
      { key: "expires_at", label: "Ends", type: "datetime" },
      { key: "active", label: "Active", type: "boolean", list: true },
      { key: "store_id", label: "Shop ID", type: "text", readOnly: true },
      created,
    ],
  },
  {
    id: "storefront_payment_requests",
    label: "Seller payment links",
    singular: "Payment link",
    group: "DoyinTech Store",
    description: "Invoice payment links sellers sent to their customers.",
    pk: "id",
    orderBy: "created_at",
    titleField: "title",
    emailField: "customer_email",
    search: ["reference", "title", "customer_name", "customer_email"],
    filters: ["status"],
    canCreate: false,
    canUpdate: true,
    canDelete: true,
    fields: [
      uuid(),
      { key: "reference", label: "Link", type: "text", readOnly: true, list: true },
      { key: "title", label: "For", type: "text", readOnly: true, list: true },
      { key: "amount_kobo", label: "Amount", type: "kobo", readOnly: true, list: true },
      { key: "status", label: "Status", type: "select", options: ["open", "paid", "cancelled"], list: true },
      { key: "customer_name", label: "Customer", type: "text", readOnly: true },
      { key: "customer_email", label: "Customer email", type: "email", readOnly: true, list: true },
      { key: "due_date", label: "Due", type: "date", list: true },
      { key: "reminders_sent", label: "Reminders sent", type: "number", readOnly: true },
      { key: "platform_fee_kobo", label: "Our fee", type: "kobo", readOnly: true },
      { key: "paystack_reference", label: "Paystack ref", type: "text", readOnly: true },
      { key: "paid_at", label: "Paid", type: "datetime", readOnly: true },
      { key: "store_id", label: "Shop ID", type: "text", readOnly: true },
      created,
    ],
  },

  // ─── Marketing / System ───────────────────────────────────────────────
  {
    id: "site_events",
    label: "Conversion events",
    singular: "Event",
    group: "Marketing",
    description: "Raw tracking events behind the Conversions report.",
    pk: "id",
    orderBy: "created_at",
    titleField: "name",
    search: ["name", "label", "path", "utm_source"],
    filters: ["name"],
    canCreate: false,
    canUpdate: false,
    canDelete: true,
    fields: [
      { key: "id", label: "ID", type: "number", readOnly: true },
      {
        key: "name",
        label: "Event",
        type: "select",
        options: [
          "whatsapp_click",
          "phone_click",
          "email_click",
          "cta_click",
          "tool_download",
          "lead",
          "newsletter_signup",
          "checkout_start",
          "payment",
          "subscription_payment",
          "shop_created",
          "shop_order_paid",
        ],
        readOnly: true,
        list: true,
      },
      { key: "label", label: "Label", type: "text", readOnly: true, list: true },
      { key: "path", label: "Page", type: "text", readOnly: true, list: true },
      { key: "value_kobo", label: "Value", type: "kobo", readOnly: true, list: true },
      { key: "utm_source", label: "Source", type: "text", readOnly: true },
      { key: "utm_medium", label: "Medium", type: "text", readOnly: true },
      { key: "utm_campaign", label: "Campaign", type: "text", readOnly: true },
      { key: "referrer_host", label: "Referrer", type: "text", readOnly: true },
      { key: "session_id", label: "Session", type: "text", readOnly: true },
      created,
    ],
  },
  {
    id: "site_settings",
    label: "Site settings",
    singular: "Setting",
    group: "System",
    description: "Key/value settings such as price overrides (JSON).",
    pk: "key",
    orderBy: "updated_at",
    titleField: "key",
    search: ["key"],
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    createDefaults: { value: {} },
    warning: "These values drive live prices and settings. Double-check JSON before saving.",
    fields: [
      { key: "key", label: "Key", type: "text", required: true, readOnly: true, createOnly: true, list: true },
      { key: "value", label: "Value (JSON)", type: "json", required: true },
      { key: "updated_at", label: "Updated", type: "datetime", readOnly: true, list: true },
    ],
  },
  {
    id: "admin_audit_log",
    label: "Audit log",
    singular: "Audit entry",
    group: "System",
    description: "Every change made in the admin: who, what and when (read-only).",
    pk: "id",
    orderBy: "created_at",
    titleField: "resource",
    search: ["actor", "resource", "record_id"],
    filters: ["action"],
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    fields: [
      { key: "id", label: "ID", type: "number", readOnly: true },
      { key: "actor", label: "Who", type: "text", readOnly: true, list: true },
      { key: "action", label: "Action", type: "select", options: ["create", "update", "delete"], readOnly: true, list: true },
      { key: "resource", label: "Table", type: "text", readOnly: true, list: true },
      { key: "record_id", label: "Record", type: "text", readOnly: true, list: true },
      { key: "changes", label: "Changes", type: "json", readOnly: true },
      created,
    ],
  },
];

export const RESOURCE_GROUPS = ["CRM", "Sales", "Services", "DoyinTech Store", "Marketing", "System"] as const;

export function getResource(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

/** Fields the browser may see. */
export function visibleFields(r: Resource): Field[] {
  return r.fields.filter((f) => !f.hidden);
}

export function koboToNaira(kobo: unknown): string {
  const n = Number(kobo);
  return Number.isFinite(n) ? "₦" + Math.round(n / 100).toLocaleString("en-NG") : "";
}
