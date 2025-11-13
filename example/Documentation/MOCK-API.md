```markdown
# Mock API — Endpoints & Example Requests/Responses

Purpose
- Provide a simple mock API you can use while building the frontend. Use a JSON server or msw to implement these endpoints. The backend will later implement the authoritative versions.

General notes
- All endpoints are versioned under `/api/v1`.
- Authentication is mocked — send `Authorization: Bearer MOCK_TOKEN` in headers for protected endpoints.
- Use integer `coins` amounts (no decimals). Timestamps in ISO 8601.

1) GET /api/v1/user
- Returns basic profile and balances
Request:
```
GET /api/v1/user
Authorization: Bearer MOCK_TOKEN
```
Response:
```json
{
  "id": 1,
  "display_name": "player1",
  "coins": 1200,
  "hog_count": 3,
  "subscription_tier": "free"
}
```

2) GET /api/v1/farm
- Returns layout, hogs and structures
Response:
```json
{
  "farm_id": 1,
  "tiles_w": 20,
  "tiles_h": 12,
  "hogs": [
    {
      "id": 101,
      "name": "Hog #101",
      "rarity": "common",
      "birth_time": "2025-11-10T12:00:00Z",
      "stage": "adult",
      "health": 92,
      "hunger": 60,
      "hydration": 80,
      "production_base": 10,
      "x": 320,
      "y": 200,
      "pregnant": false
    }
  ],
  "structures": [
    { "id": 11, "type": "barn", "x": 5, "y": 3, "durability": 85 }
  ]
}
```

3) POST /api/v1/action/feed
- Feed a hog with an item from inventory
Request:
```json
POST /api/v1/action/feed
Authorization: Bearer MOCK_TOKEN
Content-Type: application/json

{
  "hog_id": 101,
  "item_id": 22
}
```
Response (success):
```json
{
  "ok": true,
  "hog": {
    "id": 101,
    "health": 95,
    "hunger": 100,
    "production_boost_until": "2025-11-13T15:00:00Z"
  },
  "ledger_entry": {
    "id": 501,
    "user_id": 1,
    "change_amount": -50,
    "type": "purchase",
    "ref_id": "purchase:22"
  }
}
```

4) POST /api/v1/breed
- Initiate breeding (natural or sperm)
Request:
```json
POST /api/v1/breed
Authorization: Bearer MOCK_TOKEN
Content-Type: application/json

{
  "mother_id": 101,
  "father_id": 102,
  "pay_with": "coins"
}
```
Response:
```json
{
  "ok": true,
  "pregnancy_id": 9001,
  "due_time": "2025-11-16T12:00:00Z",
  "expected_range": "4-10",
  "success_prob": 0.95
}
```

5) GET /api/v1/pregnancies
- List pregnancies for the user
Response:
```json
{
  "pregnancies": [
    {
      "id": 9001,
      "mother_id": 101,
      "father_id": 102,
      "start_time": "2025-11-13T12:00:00Z",
      "due_time": "2025-11-16T12:00:00Z",
      "status": "pregnant"
    }
  ]
}
```

6) GET /api/v1/marketplace
- Browse listings (pagination)
Request:
`GET /api/v1/marketplace?page=1&rarity=common`
Response:
```json
{
  "page":1,
  "listings": [
    {
      "id": 3001,
      "seller_id": 5,
      "asset_type": "hog",
      "asset_id": 101,
      "price_cents": 12000,
      "rarity": "common",
      "created_at": "2025-11-12T10:00:00Z"
    }
  ]
}
```

7) POST /api/v1/marketplace/buy
- Buy a listing (mock)
Request:
```json
POST /api/v1/marketplace/buy
Authorization: Bearer MOCK_TOKEN
Content-Type: application/json

{ "listing_id": 3001 }
```
Response:
```json
{
  "ok": true,
  "listing_id": 3001,
  "buyer_id": 1,
  "seller_receive_cents": 10800,
  "platform_fee_cents": 1200,
  "ledger_entry": { "id": 701, "change_amount": -12000, "type":"purchase" }
}
```

8) POST /api/v1/npc/sell
- Instant sell to NPC
Request:
```json
POST /api/v1/npc/sell
Authorization: Bearer MOCK_TOKEN
Content-Type: application/json

{ "asset_type": "hog", "asset_id": 101 }
```
Response:
```json
{
  "ok": true,
  "price_cents": 9200,
  "ledger_entry": { "id": 802, "change_amount": 9200, "type":"npc_sale" }
}
```

Mock server tips
- Implement these endpoints in msw or json-server.
- Add slight delays (200–600ms) to simulate network.
- Add variant responses (failures) for testing error handling.

When ready for backend handoff
- Replace mock server with the real API and ensure server returns the same shapes.
- Confirm server validates all actions (no trust in client).
```