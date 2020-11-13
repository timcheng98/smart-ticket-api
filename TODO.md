2020-10-06 by Ryan
- Admin Panel - Controller Device - show full Controller Key
- Admin Panel - Controller Device - Status is incorrect
- Admin Panel - Controller Passcode - QR Code record detail error

---

- AMS authentication
- Sorting on tables
- AMS passcode, disable passcode
- AMS update passcode usage count

- company_door table (Craete, Edit, Disable),
  - add field - is_active:
      1 = active,
      -1 = disable => company_door_qrcode, company_user_door: is_active = -2 (temp disable),

- company_door_qrcode, company_user_door table
  - add field: is_active

- company user
  - add qr code operation
  - hide password field

- controller access log
  - put reader column in front of passcode column,
  - reader column can open by modal - api search from company_user_access_log table, QR code search from company_door_qrcode table
  - add date (by default 30 days) sort and controller sort

- Remove all permission check in mobile user api
