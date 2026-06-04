import re

file_path = r'f:\Projects\wio\wio-api\src\modules\wedding\wedding.service.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports for entities
content = content.replace("WeddingEntity,", "WeddingEntity, WeddingEventEntity, WeddingTimelineEntity, WeddingPhotoEntity,")

# We just need to use Object.assign(entity, dto) instead of manual mapping for all new fields to save time.
# But Wait, there are nested arrays (events, timelines, gallery).
# In create method
create_mapping = """
    // Automatically map scalar fields
    const excludedFields = ['events', 'timelines', 'gallery', 'userId', 'templateId', 'slug'];
    for (const [key, value] of Object.entries(dto)) {
      if (!excludedFields.includes(key) && value !== undefined) {
        (entity as any)[key] = value;
      }
    }

    if (dto.events && Array.isArray(dto.events)) {
      entity.events = dto.events.map((e, idx) => {
        const ev = new WeddingEventEntity();
        Object.assign(ev, e);
        ev.sortOrder = idx;
        return ev;
      });
    }

    if (dto.timelines && Array.isArray(dto.timelines)) {
      entity.timelines = dto.timelines.map((t, idx) => {
        const tm = new WeddingTimelineEntity();
        Object.assign(tm, t);
        tm.sortOrder = idx;
        return tm;
      });
    }

    if (dto.gallery && Array.isArray(dto.gallery)) {
      entity.photos = dto.gallery.map((url, idx) => {
        const p = new WeddingPhotoEntity();
        p.url = url;
        p.sortOrder = idx;
        return p;
      });
    }
"""

content = re.sub(
    r"if \(dto\.groomName !== undefined\) entity\.groomName = dto\.groomName;[\s\S]*?if \(dto\.expiresAt !== undefined\) entity\.expiresAt = dto\.expiresAt;",
    create_mapping,
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated wedding.service.ts")
