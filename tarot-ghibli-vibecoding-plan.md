# 🌿 KẾ HOẠCH THỰC THI DỰ ÁN TAROT GHIBLI-INSPIRED
> Phiên bản đã chỉnh lại để phù hợp với một dự án static site triển khai dần, ưu tiên làm ra sản phẩm chạy được trước rồi mới nâng cấp độ đẹp.

---

## 1. Mục tiêu dự án

Xây dựng một website Tarot tĩnh, deploy lên GitHub Pages, có giao diện gợi cảm hứng Ghibli/watercolor fantasy và hỗ trợ các luồng chính:

- Rút bài Tarot theo 3 chế độ: 1 lá, 3 lá, Celtic Cross 10 lá
- Xem kết quả trải bài với ý nghĩa cơ bản cho từng lá
- Tra cứu toàn bộ 78 lá
- Hoạt động hoàn toàn client-side, không cần backend

### Mục tiêu thực tế

Tài liệu cũ khá giàu ý tưởng, nhưng nếu triển khai thẳng toàn bộ ngay từ đầu thì sẽ bị nghẽn ở 3 chỗ:

- **Nội dung**: viết sâu cho đủ 78 lá tốn nhiều thời gian hơn phần code
- **Hình ảnh**: 78 minh họa riêng theo đúng phong cách là khối lượng rất lớn
- **Hiệu ứng**: particles, parallax, flip, share screenshot, sound nếu làm cùng lúc sẽ kéo dài đáng kể

Vì vậy kế hoạch mới sẽ chia thành:

- **MVP**: app chạy được, đẹp, có flow hoàn chỉnh
- **V1**: thêm hiệu ứng và polish
- **Content Expansion**: làm giàu dữ liệu và thay thế asset placeholder

---

## 2. Trạng thái hiện tại

Tại thời điểm rà soát, workspace chỉ có đúng file kế hoạch này. Nghĩa là dự án đang ở trạng thái **zero-to-one**:

- Chưa có scaffold Vite
- Chưa có cấu trúc thư mục
- Chưa có dữ liệu 78 lá
- Chưa có asset
- Chưa có pipeline deploy

Điều này có lợi: có thể thiết kế lại cấu trúc ngay từ đầu cho sạch và dễ mở rộng.

---

## 3. Quyết định kỹ thuật

### Tech stack giữ lại

```txt
Framework   : Vite + Vanilla HTML/CSS/JS
Styling     : CSS thuần + CSS Variables
Deploy      : GitHub Pages qua GitHub Actions
Data        : JSON tĩnh trong /public/data
State       : sessionStorage
Animation   : CSS transitions/keyframes, Web Animations API khi cần
```

### Điều chỉnh so với bản cũ

- **Giữ Vite + Vanilla JS** vì phù hợp nhất với GitHub Pages và cho dự án nhỏ đến vừa.
- **Đổi trọng tâm từ "Studio Ghibli style" sang "Ghibli-inspired"** để không bị phụ thuộc vào việc phải tạo 78 minh họa hoàn toàn mới ngay ở giai đoạn đầu.
- **Không coi 78 ảnh riêng là blocker**. MVP có thể dùng:
  - 1 card back đẹp
  - card front dạng khung + icon + texture + màu theo suit
  - một số lá nổi bật có artwork trước, phần còn lại thay sau
- **Không đưa AI API hoặc external API vào core scope**. Nếu có AI summary thì để hậu kỳ.
- **Không làm Dark/Light mode, sound effect, screenshot/share ở MVP**. Đây là nice-to-have, không phải xương sống sản phẩm.

---

## 4. Phạm vi đề xuất

### Phạm vi MVP

- Landing page có visual rõ chất fantasy
- Chọn kiểu trải bài
- Shuffle + draw đúng logic
- Hỗ trợ bài xuôi/ngược, có toggle bật/tắt reversed
- Reading page hiển thị kết quả
- Explore page tra cứu 78 lá
- Search + filter cơ bản
- Responsive tốt trên mobile và desktop
- Build và deploy được lên GitHub Pages

### Phạm vi V1 polish

- Flip animation mượt
- Reveal theo thứ tự
- Background particles nhẹ
- Detail panel đẹp hơn
- Thêm nhiều texture, cloud layer, glow
- Loading state và empty state tử tế

### Phạm vi để sau

- 78 minh họa bespoke hoàn chỉnh
- Sound effect
- Print/share reading thành ảnh
- Theme day/night
- Tổng hợp nâng cao giữa nhiều lá
- Personal journal / lưu lịch sử người dùng

---

## 5. Cấu trúc thư mục đề xuất

Thay vì để toàn bộ JS/CSS nằm ngang ở root, nên dùng cấu trúc sau để dễ quản lý với Vite:

```txt
tarot-ghibli/
├── index.html
├── reading.html
├── explore.html
├── package.json
├── vite.config.js
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── data/
│   │   └── tarot.json
│   └── assets/
│       ├── bg/
│       ├── cards/
│       ├── textures/
│       └── ui/
└── src/
    ├── styles/
    │   ├── tokens.css
    │   ├── base.css
    │   ├── utilities.css
    │   ├── components.css
    │   ├── animations.css
    │   └── pages/
    │       ├── home.css
    │       ├── reading.css
    │       └── explore.css
    ├── scripts/
    │   ├── core/
    │   │   ├── tarot-engine.js
    │   │   ├── tarot-data.js
    │   │   ├── storage.js
    │   │   └── spreads.js
    │   ├── ui/
    │   │   ├── card.js
    │   │   ├── modal.js
    │   │   ├── filters.js
    │   │   └── particles.js
    │   └── pages/
    │       ├── home.js
    │       ├── reading.js
    │       └── explore.js
    └── content/
        └── spread-definitions.js
```

### Lý do chọn cấu trúc này

- `public/` phù hợp cho JSON và asset tĩnh cần giữ nguyên đường dẫn
- `src/scripts/core/` tách logic Tarot khỏi code thao tác DOM
- `src/scripts/pages/` để mỗi trang có entry rõ ràng
- `src/styles/pages/` giúp CSS không lẫn giữa các trang

---

## 6. Chiến lược dữ liệu 78 lá

Đây là phần quan trọng nhất để tránh sa đà.

### Không nên làm ngay từ đầu

- Viết 78 lá với mỗi trường `meaning_upright`, `meaning_reversed`, `love`, `career`, `spiritual` đều rất dài
- Tạo đủ 78 ảnh minh họa chi tiết trước khi app chạy

### Nên làm theo 2 tầng

#### Tầng 1: dữ liệu đủ để app hoạt động

Mỗi lá có:

- `id`
- `name`
- `name_vi`
- `arcana`
- `suit`
- `number`
- `element`
- `keywords_upright`
- `keywords_reversed`
- `meaning_upright`
- `meaning_reversed`
- `image`
- `accent`

Trong MVP, `meaning_upright` và `meaning_reversed` chỉ cần ngắn gọn nhưng đúng nghĩa, khoảng 2-4 câu mỗi trường.

#### Tầng 2: enrich content

Sau khi UI hoàn chỉnh mới thêm dần:

- `love_upright`
- `love_reversed`
- `career_upright`
- `career_reversed`
- `spiritual`
- `numerology`
- `planet`
- `related_cards`

### Kết luận

**MVP không nên bị chặn bởi việc viết encyclopedia siêu sâu.** Trước tiên cần có đủ 78 lá với metadata sạch và meaning cơ bản.

---

## 7. Chiến lược asset

### Bài toán thực tế

78 ảnh front-card độc lập là hạng mục nặng nhất. Nếu cố hoàn tất ngay sẽ làm chậm toàn bộ dự án.

### Hướng triển khai khả thi

#### Giai đoạn MVP

- 1 card back đẹp và nhất quán
- 78 card front dạng template
- Mỗi suit có:
  - màu riêng
  - icon riêng
  - pattern riêng
- Major Arcana có treatment riêng nổi bật hơn Minor Arcana

#### Giai đoạn nâng cấp

- Thay dần từng nhóm ảnh:
  - 22 Major Arcana trước
  - sau đó 4 suit Minor Arcana

### Kết luận

Thiết kế nên cho phép **placeholder artwork vẫn nhìn đẹp**, thay vì phụ thuộc vào artwork bespoke từ đầu.

---

## 8. Kế hoạch triển khai chi tiết

## Phase 0 - Scaffold và deploy nền

### Mục tiêu

Có repo chạy local và deploy được bản tối thiểu.

### Việc cần làm

- Khởi tạo Vite vanilla project
- Thiết lập multi-page: `index.html`, `reading.html`, `explore.html`
- Tạo `vite.config.js` với `base` phù hợp GitHub Pages
- Cấu hình GitHub Actions bằng Pages chính thức
- Tạo skeleton CSS và JS entry
- Xác nhận `npm run build` thành công

### Output

- Repo có cấu trúc sạch
- Trang deploy được lên GitHub Pages dù mới là skeleton

### Tiêu chí hoàn thành

- Chạy local không lỗi
- Build ra thư mục dist ổn định
- Deploy thành công qua GitHub Actions

### Ước lượng

1-2 giờ

---

## Phase 1 - Design foundation và landing page

### Mục tiêu

Tạo cảm giác dự án ngay từ trang đầu: fantasy, mềm, sáng, không generic.

### Việc cần làm

- Tạo `tokens.css` với palette, typography, spacing, shadows, radii
- Tạo background nhiều lớp bằng gradient + texture + cloud blobs
- Dựng hero section
- Làm cụm card deck ở giữa
- Cho người dùng chọn kiểu trải bài
- Thêm nút CTA rõ ràng
- Xây dựng responsive layout trước khi polish animation

### Output

- Trang chủ có ngôn ngữ hình ảnh nhất quán
- Có form/chọn chế độ trải bài sẵn để nối vào engine

### Tiêu chí hoàn thành

- Mobile không vỡ layout
- Desktop có chiều sâu thị giác
- Không phụ thuộc JS để chỉ hiển thị giao diện cơ bản

### Ước lượng

3-4 giờ

---

## Phase 2 - Data model và bộ 78 lá bản đầu

### Mục tiêu

Có dữ liệu đủ để toàn bộ app dùng chung.

### Việc cần làm

- Chốt schema `tarot.json`
- Tạo đủ 78 lá với field tối thiểu
- Chuẩn hóa id, suit, numbering, path image
- Xác định mapping spread labels cho 1/3/10 lá
- Bổ sung dữ liệu reversed

### Output

- `public/data/tarot.json`
- Danh sách spread definitions dùng chung

### Tiêu chí hoàn thành

- Load được toàn bộ dữ liệu không lỗi
- Không có id trùng
- Tất cả card có thể render trong explore page

### Ước lượng

2-4 giờ

---

## Phase 3 - Tarot engine và flow rút bài

### Mục tiêu

Logic hoạt động đúng, đơn giản, dễ test.

### Việc cần làm

- Cài đặt Fisher-Yates shuffle
- Hàm draw theo số lá
- Toggle reversed on/off
- Gắn nhãn vị trí theo spread
- Lưu kết quả vào `sessionStorage`
- Tạo guard nếu người dùng vào `reading.html` mà chưa rút bài

### Output

- Engine có thể dùng chung cho homepage và reading page

### Tiêu chí hoàn thành

- Không rút trùng trong cùng spread
- Reversed hoạt động đúng khi bật
- Refresh reading page có trạng thái xử lý hợp lý

### Ước lượng

2-3 giờ

---

## Phase 4 - Reading page

### Mục tiêu

Biến kết quả random thành trải nghiệm đọc bài rõ ràng.

### Việc cần làm

- Render layout cho 1 lá, 3 lá, 10 lá
- Hiển thị tên vị trí của từng lá
- Cho click vào lá để xem detail panel hoặc modal
- Hiển thị orientation badge: xuôi/ngược
- Thêm reveal animation theo thứ tự
- Viết empty state khi không có dữ liệu

### Output

- Reading page dùng được trên cả mobile và desktop

### Tiêu chí hoàn thành

- Người dùng hiểu từng vị trí trong spread
- Detail panel đọc được, không quá chật trên mobile
- Animation không làm chậm trải nghiệm

### Ước lượng

3-4 giờ

---

## Phase 5 - Explore page

### Mục tiêu

Tra cứu 78 lá là một luồng độc lập, không phụ thuộc rút bài.

### Việc cần làm

- Grid cards
- Filter theo arcana/suit
- Search theo tên và từ khóa
- Modal/detail view
- Điều hướng qua lại mượt giữa grid và detail

### Output

- Explore page hoàn chỉnh cho mục đích tra cứu

### Tiêu chí hoàn thành

- Search phản hồi nhanh
- Filter hoạt động đúng
- Mỗi card có detail xem được

### Ước lượng

3-4 giờ

---

## Phase 6 - Polish, performance, accessibility

### Mục tiêu

Nâng trải nghiệm mà không phá tính ổn định.

### Việc cần làm

- Tối ưu animation chỉ dùng `transform` và `opacity` khi có thể
- Thêm `prefers-reduced-motion`
- Lazy load ảnh
- Tối ưu typography và contrast
- Thêm loading state, empty state, fallback asset
- Kiểm tra keyboard focus cho interactive elements
- Thêm SEO cơ bản và Open Graph

### Output

- Bản phát hành đầu tiên đủ tử tế để public

### Tiêu chí hoàn thành

- Không có lỗi console nghiêm trọng
- Mobile dùng ổn
- Performance tốt trên thiết bị trung bình

### Ước lượng

2-4 giờ

---

## Phase 7 - Content và art expansion

### Mục tiêu

Tăng chiều sâu mà không làm chậm việc phát hành bản đầu.

### Việc cần làm

- Bổ sung meaning sâu hơn cho 78 lá
- Thêm tab Love / Career / Spiritual
- Thay placeholder front-card bằng artwork tốt hơn
- Tạo nhóm related cards
- Cân nhắc summary cho nhiều lá cùng lúc

### Lưu ý

Đây là phase mở rộng, không nên chen vào trước khi MVP ổn.

---

## 9. Thứ tự thực hiện khuyến nghị

Nếu làm trực tiếp cùng AI/coding agent, nên đi theo chuỗi sau:

1. Scaffold repo và deploy trước
2. Làm landing page đủ đẹp để khóa visual direction
3. Chốt data schema và dựng bộ 78 lá bản tối thiểu
4. Làm tarot engine
5. Hoàn tất reading page
6. Hoàn tất explore page
7. Tối ưu mobile, accessibility, performance
8. Sau cùng mới đẩy mạnh art và hiệu ứng cao cấp

Lý do: nếu đi ngược lại, bạn sẽ rất dễ có giao diện đẹp nhưng chưa có sản phẩm dùng được.

---

## 10. Rủi ro chính và cách giảm rủi ro

### Rủi ro 1 - Scope bị phình

Triệu chứng:

- Muốn vừa làm 78 ảnh, vừa viết full meanings, vừa làm particles, vừa deploy

Giảm rủi ro:

- Khóa MVP rõ ràng
- Chỉ thêm hiệu ứng khi flow cốt lõi đã xong

### Rủi ro 2 - Asset làm nghẽn tiến độ

Triệu chứng:

- Dự án dừng nhiều ngày chỉ vì thiếu ảnh bài

Giảm rủi ro:

- Dùng card template đẹp cho toàn bộ deck
- Thay artwork dần về sau

### Rủi ro 3 - GitHub Pages lỗi base path

Triệu chứng:

- Chạy local ổn nhưng deploy lên mất CSS/JS/ảnh

Giảm rủi ro:

- Test build và deploy rất sớm ở Phase 0
- Dùng asset path nhất quán

### Rủi ro 4 - Animation quá nặng trên mobile

Triệu chứng:

- FPS thấp, lag khi flip hoặc scroll

Giảm rủi ro:

- Chỉ animate transform/opacity
- Giới hạn particles
- Có reduced motion mode

### Rủi ro 5 - sessionStorage làm mất trải nghiệm share

Triệu chứng:

- Mở trực tiếp `reading.html` không có dữ liệu

Giảm rủi ro:

- Có empty state rõ ràng
- Có nút quay lại trang chủ để rút lại

---

## 11. Definition of Done cho bản phát hành đầu tiên

Có thể coi phiên bản đầu đã hoàn thành khi đáp ứng đủ:

- Landing page đẹp và chọn được spread
- Draw 1/3/10 lá hoạt động đúng
- Reversed toggle hoạt động
- Reading page hiển thị và giải thích được kết quả
- Explore page tra cứu được 78 lá
- Mobile dùng ổn
- Build và deploy GitHub Pages thành công
- Không có dependency vào backend hay dịch vụ ngoài

---

## 12. Cách làm việc với AI cho hiệu quả

### Quy tắc chính

- Mỗi session chỉ làm **một mục tiêu rõ ràng**
- Luôn nêu file đích cần sửa
- Sau mỗi phase phải chạy local hoặc build để xác nhận
- Không yêu cầu AI “làm toàn bộ app” trong một lượt

### Prompt format nên dùng

```txt
Context:
- Đây là dự án Tarot static site dùng Vite + vanilla JS
- Hiện có các file: [liệt kê ngắn]
- Đang ở phase: [ghi phase]

Task:
- Chỉ sửa các file: [liệt kê]
- Mục tiêu: [một mục tiêu rõ ràng]

Constraints:
- Không thêm framework
- Giữ CSS variables
- Ưu tiên mobile responsive
- Không thêm thư viện animation ngoài

Done when:
- [tiêu chí nghiệm thu]
```

### Ví dụ session hợp lý

- Session 1: tạo scaffold + deploy
- Session 2: landing page visual
- Session 3: tarot.json bản đầu
- Session 4: engine + storage
- Session 5: reading page
- Session 6: explore page
- Session 7: polish + a11y + performance

---

## 13. Timeline thực tế hơn

| Phase | Thời gian | Ghi chú |
|------|-----------|--------|
| 0. Scaffold + deploy | 1-2 giờ | Chốt nền kỹ thuật |
| 1. Landing page | 3-4 giờ | Khóa visual direction |
| 2. Dữ liệu 78 lá bản đầu | 2-4 giờ | Có thể chia nhỏ |
| 3. Engine + storage | 2-3 giờ | Logic cốt lõi |
| 4. Reading page | 3-4 giờ | Flow chính |
| 5. Explore page | 3-4 giờ | Flow tra cứu |
| 6. Polish + QA | 2-4 giờ | Trước khi public |
| **Tổng MVP** | **16-25 giờ** | Tùy độ sâu nội dung |

Nếu cộng cả content expansion và artwork thay thế dần, tổng thời gian sẽ dài hơn khá nhiều. Điều đó bình thường và không nên gộp vào target của MVP.

---

## 14. Kết luận định hướng

Kế hoạch tối ưu cho dự án này không phải là “làm mọi thứ thật đẹp ngay”, mà là:

1. Dựng được app hoàn chỉnh từ đầu đến cuối
2. Giữ visual direction đủ mạnh để không bị generic
3. Không để phần art và content làm chặn phần code
4. Public được bản đầu sớm, rồi nâng cấp có kiểm soát

Tài liệu này nên được xem là **source of truth mới** cho quá trình triển khai.
