import os
import re

entity_dir = r'f:\Projects\wio\wio-api\src\entities'

word_dict = {
    'showHeroImage': 'Hiển thị ảnh cover',
    'heroImageMain': 'Ảnh cover chính',
    'showIntro': 'Hiển thị phần giới thiệu',
    'invitationText': 'Lời mời',
    'showGallery': 'Hiển thị album ảnh',
    'galleryLayout': 'Bố cục album ảnh',
    'showParty': 'Hiển thị thông tin tiệc',
    'partyType': 'Loại tiệc',
    'receptionWelcomeTime': 'Thời gian đón khách',
    'ceremonyAt': 'Thời gian làm lễ',
    'ceremonyVenue': 'Địa điểm làm lễ',
    'ceremonyAddress': 'Địa chỉ làm lễ',
    'ceremonyMapsUrl': 'Link bản đồ làm lễ',
    'ceremonyLat': 'Vĩ độ làm lễ',
    'ceremonyLng': 'Kinh độ làm lễ',
    'receptionAt': 'Thời gian tiệc',
    'receptionVenue': 'Địa điểm tiệc',
    'receptionAddress': 'Địa chỉ tiệc',
    'receptionMapsUrl': 'Link bản đồ tiệc',
    'receptionLat': 'Vĩ độ tiệc',
    'receptionLng': 'Kinh độ tiệc',
    'showCountdown': 'Hiển thị đếm ngược',
    'showMap': 'Hiển thị bản đồ',
    'showDressCode': 'Hiển thị dress code',
    'dressCodes': 'Danh sách dress code',
    'showTimeline': 'Hiển thị lịch trình',
    'timelineTitle': 'Tiêu đề lịch trình',
    'showRsvp': 'Hiển thị form RSVP',
    'rsvpType': 'Loại form RSVP',
    'showGuestbook': 'Hiển thị sổ lời chúc',
    'guestbookStatic': 'Sổ lời chúc tĩnh',
    'guestbookFloating': 'Sổ lời chúc nổi',
    'showThankYou': 'Hiển thị lời cảm ơn',
    'thankYouText': 'Nội dung lời cảm ơn',
    'groomName': 'Tên chú rể',
    'groomShortName': 'Tên ngắn chú rể',
    'groomTitle': 'Danh xưng chú rể',
    'groomAddress': 'Địa chỉ chú rể',
    'groomDob': 'Ngày sinh chú rể',
    'groomFatherName': 'Tên bố chú rể',
    'groomMotherName': 'Tên mẹ chú rể',
    'groomPhotoUrl': 'Ảnh chú rể',
    'groomBankAccount': 'Số tài khoản chú rể',
    'groomBankName': 'Tên ngân hàng chú rể',
    'groomBankOwner': 'Tên chủ tài khoản chú rể',
    'groomQrUrl': 'Ảnh QR chú rể',
    'brideName': 'Tên cô dâu',
    'brideShortName': 'Tên ngắn cô dâu',
    'brideTitle': 'Danh xưng cô dâu',
    'brideAddress': 'Địa chỉ cô dâu',
    'brideDob': 'Ngày sinh cô dâu',
    'brideFatherName': 'Tên bố cô dâu',
    'brideMotherName': 'Tên mẹ cô dâu',
    'bridePhotoUrl': 'Ảnh cô dâu',
    'brideBankAccount': 'Số tài khoản cô dâu',
    'brideBankName': 'Tên ngân hàng cô dâu',
    'brideBankOwner': 'Tên chủ tài khoản cô dâu',
    'brideQrUrl': 'Ảnh QR cô dâu',
    'musicName': 'Tên bài hát',
    'musicUrl': 'Link bài hát',
    'musicType': 'Loại nhạc',
    'musicAutoplay': 'Tự động phát nhạc',
    'userId': 'ID người dùng',
    'templateId': 'ID giao diện',
    'slug': 'Đường dẫn tĩnh',
    'loveStory': 'Câu chuyện tình yêu',
    'hashtag': 'Hashtag',
    'displayOrder': 'Thứ tự hiển thị',
    'events': 'Danh sách sự kiện',
    'timelines': 'Danh sách mốc thời gian',
    'photos': 'Danh sách ảnh',
    'createdAt': 'Ngày tạo',
    'createdBy': 'Người tạo',
    'updatedAt': 'Ngày cập nhật',
    'updatedBy': 'Người cập nhật',
    'isDeleted': 'Đã xóa',
    'status': 'Trạng thái',
    'shareUrl': 'Link chia sẻ',
    'shareQrUrl': 'QR chia sẻ',
    'publishedAt': 'Ngày xuất bản',
    'expiresAt': 'Ngày hết hạn',
    'engagementAt': 'Thời gian ăn hỏi',
    'engagementVenue': 'Địa điểm ăn hỏi',
    'engagementAddress': 'Địa chỉ ăn hỏi',
    'engagementMapsUrl': 'Link bản đồ ăn hỏi',
    'weddingId': 'ID đám cưới',
    'title': 'Tiêu đề',
    'date': 'Ngày',
    'time': 'Thời gian',
    'address': 'Địa chỉ',
    'sortOrder': 'Thứ tự sắp xếp',
    'url': 'Đường dẫn URL',
    'type': 'Phân loại',
    'width': 'Chiều rộng',
    'height': 'Chiều cao',
    'sizeBytes': 'Kích thước (byte)',
    'action': 'Hành động',
    'entityType': 'Loại thực thể',
    'entityId': 'ID thực thể',
    'details': 'Chi tiết',
    'ipAddress': 'Địa chỉ IP',
    'userAgent': 'User Agent',
    'code': 'Mã',
    'fullName': 'Họ và tên',
    'email': 'Email',
    'phone': 'Số điện thoại',
    'gender': 'Giới tính',
    'dateOfBirth': 'Ngày sinh',
    'name': 'Tên',
    'description': 'Mô tả',
    'guestGroupId': 'ID nhóm khách',
    'side': 'Nhà trai/Nhà gái',
    'rsvpStatus': 'Trạng thái RSVP',
    'dietary': 'Chế độ ăn',
    'needsTransport': 'Cần đưa đón',
    'attendingCount': 'Số người tham dự',
    'message': 'Tin nhắn',
    'rsvpAt': 'Ngày RSVP',
    'channel': 'Kênh thông báo',
    'readAt': 'Ngày đọc',
    'isRead': 'Đã đọc',
    'maxPhotos': 'Số ảnh tối đa',
    'allowGuestUpload': 'Cho phép khách tải ảnh',
    'autoApprove': 'Tự động duyệt ảnh',
    'price': 'Giá',
    'durationDays': 'Số ngày hiệu lực',
    'features': 'Tính năng',
    'oldSlug': 'Đường dẫn cũ',
    'newSlug': 'Đường dẫn mới',
    'changedBy': 'Người thay đổi',
    'reason': 'Lý do',
    'servicePlanId': 'ID gói dịch vụ',
    'startDate': 'Ngày bắt đầu',
    'endDate': 'Ngày kết thúc',
    'capacity': 'Sức chứa',
    'category': 'Danh mục',
    'thumbnailUrl': 'Ảnh đại diện',
    'demoUrl': 'Link demo',
    'isPremium': 'Là giao diện Premium',
    'token': 'Token',
    'passwordHash': 'Mật khẩu',
    'role': 'Vai trò',
    'lastLoginAt': 'Đăng nhập lần cuối',
    'otpCode': 'Mã OTP',
}

def to_vietnamese(prop_name):
    if prop_name in word_dict:
        return word_dict[prop_name]
    
    # Split camel case
    words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)|\d+', prop_name)
    return ' '.join(w.capitalize() for w in words)

for filename in os.listdir(entity_dir):
    if not filename.endswith('.entity.ts') and not filename.endswith('.ts'):
        continue
    if filename == 'enums.ts' or filename == 'index.ts':
        continue
        
    filepath = os.path.join(entity_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if we need to add import ApiProperty
    if '@ApiProperty' not in content:
        if "import { ApiProperty } from '@nestjs/swagger';" not in content:
            # Add to top
            content = "import { ApiProperty } from '@nestjs/swagger';\n" + content
            
    lines = content.split('\n')
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Look for property declarations. Usually they have a decorator like @Column, @OneToMany, etc.
        # But wait, there might be multiple decorators.
        # Let's find the actual property name line.
        # Format: `  propertyName: type;` or `  propertyName?: type;`
        # Followed by preceding decorators.
        
        prop_match = re.match(r'^  ([a-zA-Z0-9_]+)(\??):\s*(.+);', line)
        if prop_match and not line.strip().startswith('//') and '=>' not in line:
            prop_name = prop_match.group(1)
            desc = to_vietnamese(prop_name)
            
            # Look backwards to see if there is already a comment or ApiProperty
            has_comment = False
            has_api_prop = False
            
            # Scan backwards for up to 10 lines
            for j in range(len(new_lines)-1, max(-1, len(new_lines)-10), -1):
                prev_line = new_lines[j].strip()
                if prev_line.startswith('//'):
                    has_comment = True
                if prev_line.startswith('@ApiProperty'):
                    has_api_prop = True
                if prev_line == '' or prev_line.startswith('}'):
                    break
                    
            insert_idx = len(new_lines)
            
            # Find the top of decorators to insert comment
            top_decorator_idx = insert_idx
            for j in range(len(new_lines)-1, max(-1, len(new_lines)-10), -1):
                if new_lines[j].strip().startswith('@'):
                    top_decorator_idx = j
                else:
                    break
                    
            if not has_comment:
                new_lines.insert(top_decorator_idx, f"  // {desc}")
                insert_idx += 1
                
            if not has_api_prop:
                # Add @ApiProperty just before the property declaration (insert_idx is current end)
                new_lines.append(f"  @ApiProperty({{ description: '{desc}' }})")
                
            new_lines.append(line)
        else:
            new_lines.append(line)
        i += 1
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

print("Successfully updated all entity files!")
