Users:
- userId (primary key)
- username (unique)
- passwordHash
- color
- isActive
- lastSeen
- metadata (JSON)
- settings (JSON)

Messages:
- messageId (primary key)
- roomId (foreign key to ChatRooms)
- senderId (foreign key to Users)
- parentMessageId (self-referencing foreign key, nullable)
- type (enum: text, image, file, etc.)
- content
- sentAt
- isEdited
- editedAt
- status (enum: sent, delivered, read)

ChatRooms:
- roomId (primary key)
- name
- type (enum: direct, group, broadcast)
- createdAt
- updatedAt
- adminUserId (foreign key to Users)
- metadata (JSON)

ChatRoomParticipants:
- participantId (primary key)
- roomId (foreign key to ChatRooms)
- userId (foreign key to Users)
- joinedAt
- role (enum: admin, moderator, member)
- notifications (JSON)

Files:
- fileId (primary key)
- messageId (foreign key to Messages)
- name
- type
- size
- url
- uploadedAt

Reactions:
- reactionId (primary key)
- messageId (foreign key to Messages)
- userId (foreign key to Users)
- type (e.g., like, love, laugh)
- createdAt
