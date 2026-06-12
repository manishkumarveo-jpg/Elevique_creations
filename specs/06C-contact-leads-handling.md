# 06C — Contact Leads Handling
> Elevique Client Portal · Public Contact Submissions, Anonymous DB Writes, and Inquiry Managers

This specification defines the public lead capture system and the administrator portal where customer messages are reviewed.

---

## 1. Public Contact Capture pipeline

Elevique publishes a public Contact Form on both the landing page (`ContactSection`) and the dedicated `/contact` subpage. 

- **Data Capture Matrix**:
  - `name` (TEXT, NOT NULL)
  - `email` (TEXT, NOT NULL)
  - `phone` (TEXT, OPTIONAL)
  - `message` (TEXT, NOT NULL)
- **Submit action**: Submissions bypass normal session checks, sending data to a secure public-facing Server Action or API endpoint.

---

## 2. Row Level Security (RLS) Isolation

To permit public entries without compromising database security, the `contact_submissions` table operates under two distinct RLS policy rules:

```sql
-- Allow anonymous user inputs
CREATE POLICY "Allow public insert to contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Restrict read operations strictly to Administrators
CREATE POLICY "Allow admin select/all access to contact_submissions"
  ON contact_submissions FOR ALL
  USING (is_admin());
```

1. **Anonymous Inserts**: The table permits public `INSERT` operations with zero session headers.
2. **Access Protection**: Any `SELECT`, `UPDATE`, or `DELETE` attempt on this table by non-admin authenticated users or public sessions returns an empty set or a database permissions failure.

---

## 3. Admin Inquiries Console (`/admin/inquiries`)

Administrators browse incoming inquiries inside a dedicated layout:
- **Display Grid**: Shows incoming inquiries sorted by `created_at DESC` with copyable contact info.
- **Zod Validation**: Server actions check incoming items using a strict Zod validator:
  ```ts
  const contactSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters")
  });
  ```
- **Actions**: Admin can mark inquiries as addressed or soft-delete them from the inbox.
