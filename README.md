# Website Hạnh Phúc – Dịch vụ trang trí gia tiên & rạp cưới

Đây là mã nguồn cho trang web tĩnh giới thiệu dịch vụ trang trí gia tiên và rạp cưới "Hạnh Phúc". Trang web được thiết kế để dễ dàng cập nhật nội dung thông qua việc chỉnh sửa các file dữ liệu JSON riêng biệt cho từng phần.

## Mục tiêu

*   Giới thiệu dịch vụ trang trí chuyên nghiệp.
*   Cung cấp thông tin gói dịch vụ, bảng giá, hình ảnh thực tế.
*   Tạo ấn tượng với giao diện trang nhã, ấm áp, truyền thống pha hiện đại.
*   Dễ dàng quản lý và cập nhật nội dung.

## Cấu trúc thư mục

```
hanhphuc_wedding_site/
├── css/
│   └── style.css         # File CSS chính (màu sắc, layout, responsive, hiệu ứng)
├── data/
│   ├── site.json         # Thông tin chung (tiêu đề trang, meta description/keywords)
│   ├── header.json       # Dữ liệu logo và menu điều hướng
│   ├── hero.json         # Dữ liệu phần Hero (ảnh nền, tiêu đề, nút CTA)
│   ├── services.json     # Danh sách dịch vụ (tên, mô tả, ảnh)
│   ├── pricing.json      # Bảng giá các gói dịch vụ
│   ├── gallery.json      # Dữ liệu thư viện ảnh (ảnh, danh mục, caption, nút filter)
│   ├── contact.json      # Thông tin liên hệ (form, SĐT, Zalo, FB, địa chỉ, map)
│   └── footer.json       # Dữ liệu phần Footer (logo nhỏ, link, copyright)
├── images/
│   └── ...               # Thư mục chứa hình ảnh (logo, hero, services, gallery...)
├── js/
│   └── script.js         # File JavaScript xử lý fetch JSON, render nội dung, gallery filter, lightbox
├── index.html            # File HTML khung sườn chính
└── README.md             # File hướng dẫn này
```

## Cách cập nhật nội dung

Điểm mạnh của website này là bạn có thể thay đổi hầu hết nội dung hiển thị (văn bản, link, ảnh, giá cả...) bằng cách **chỉnh sửa các file `.json` trong thư mục `data/`**. Bạn không cần phải động vào code HTML hay JavaScript.

**Các bước cơ bản:**

1.  Xác định nội dung bạn muốn thay đổi thuộc về phần nào của trang web (ví dụ: Bảng giá, Thông tin liên hệ, Ảnh gallery...).
2.  Mở thư mục `data/`.
3.  Tìm file JSON tương ứng với phần đó (ví dụ: `pricing.json` cho bảng giá, `contact.json` cho liên hệ, `gallery.json` cho thư viện ảnh).
4.  Mở file JSON bằng một trình soạn thảo văn bản (như Notepad++, VS Code, Sublime Text...).
5.  Tìm đến trường dữ liệu cần sửa và thay đổi giá trị của nó.
6.  Lưu file JSON lại.
7.  Kiểm tra lại trang web (tốt nhất là trên môi trường đã deploy) để xem thay đổi.

**Ví dụ cụ thể:**

*   **Thay đổi số điện thoại Hotline:** Mở `data/contact.json`, tìm đến `"contact_info"` -> `"phone"`, sửa giá trị của `"text"` và `"link"`.
*   **Cập nhật giá Gói Tiêu Chuẩn:** Mở `data/pricing.json`, tìm đến mảng `"packages"`, tìm đối tượng có `"name": "Gói Tiêu Chuẩn"`, sửa giá trị của `"price"`.
*   **Thêm ảnh mới vào Gallery:**
    *   Đặt file ảnh thumbnail (ví dụ: `gallery-new-thumb.jpg`) và ảnh full (ví dụ: `gallery-new-full.jpg`) vào thư mục `images/gallery/`.
    *   Mở `data/gallery.json`, tìm đến mảng `"images"`.
    *   Thêm một đối tượng mới vào cuối mảng theo cấu trúc:
        ```json
        {
          "category": "gia-tien", // Hoặc "rap-cuoi", "combo"
          "thumb_url": "images/gallery/gallery-new-thumb.jpg",
          "full_url": "images/gallery/gallery-new-full.jpg",
          "alt": "Mô tả ảnh mới",
          "caption": "Chú thích ảnh mới (hiển thị trong lightbox)"
        }
        ```
    *   Nhớ thêm dấu phẩy `,` sau đối tượng ảnh trước đó nếu đây không phải là đối tượng cuối cùng trong mảng.
*   **Thay đổi ảnh nền Hero:** Mở `data/hero.json`, sửa giá trị `"background_image"` thành đường dẫn ảnh mới (ví dụ: `"images/new-hero-bg.jpg"`). Đảm bảo ảnh mới đã có trong thư mục `images/`.

**Lưu ý khi sửa file JSON:**

*   **Cú pháp JSON:** Luôn tuân thủ đúng cú pháp: dùng dấu ngoặc kép `"` cho tên trường (key) và giá trị chuỗi (string value), dấu phẩy `,` để ngăn cách các cặp key-value hoặc các phần tử trong mảng (trừ phần tử cuối cùng), dấu ngoặc nhọn `{}` cho đối tượng, dấu ngoặc vuông `[]` cho mảng.
*   **Đường dẫn ảnh:** Sử dụng đường dẫn tương đối từ thư mục gốc của website (ví dụ: `images/logo-hanhphuc.png`).
*   **Ký tự đặc biệt:** Nếu trong nội dung có dấu ngoặc kép `"`, bạn cần dùng `\"`. Nếu muốn xuống dòng trong các đoạn mô tả dài, dùng `\n`.
*   **Kiểm tra:** Sau khi sửa, hãy dùng một công cụ kiểm tra JSON online (JSON validator) để đảm bảo file không bị lỗi cú pháp trước khi deploy.

## Xem trước và Deploy

### Xem trước Local (Có thể gặp lỗi)

Việc mở file `index.html` trực tiếp bằng trình duyệt (`file:///...`) thường **không hoạt động** do trình duyệt chặn việc đọc file JSON cục bộ (CORS).

Bạn có thể chạy một server HTTP đơn giản:

1.  Mở Terminal/Command Prompt tại thư mục gốc `hanhphuc_wedding_site`.
2.  Chạy lệnh: `python3 -m http.server 8000` (hoặc cổng khác).
3.  Truy cập `http://localhost:8000` trên trình duyệt.

**Cảnh báo:** Các server đơn giản như `python -m http.server` có thể không gửi đúng kiểu MIME (`application/json`) cho file `.json`, dẫn đến JavaScript không đọc được dữ liệu và trang web bị lỗi hoặc trắng trang. **Nếu gặp lỗi khi chạy local, hãy ưu tiên deploy lên các nền tảng bên dưới.**

### Deploy lên Vercel/Netlify/GitHub Pages (Khuyến nghị)

Đây là cách tốt nhất để chạy và chia sẻ website này.

1.  **Đưa code lên Git:** Upload toàn bộ thư mục `hanhphuc_wedding_site` lên một repository trên GitHub, GitLab, hoặc Bitbucket.
2.  **Kết nối với Vercel/Netlify:**
    *   Đăng nhập Vercel/Netlify.
    *   Chọn "Import/Add New Project" -> "Import Git Repository".
    *   Kết nối tài khoản Git và chọn repository của bạn.
    *   Nền tảng sẽ tự nhận diện đây là dự án tĩnh. Giữ nguyên cài đặt mặc định và nhấn "Deploy".
3.  **GitHub Pages (Nếu dùng GitHub):**
    *   Trong repository GitHub, vào tab "Settings" -> "Pages".
    *   Trong mục "Build and deployment", chọn Source là "Deploy from a branch".
    *   Chọn nhánh chứa code (thường là `main` hoặc `master`) và thư mục `/` (root).
    *   Nhấn "Save". Sau vài phút, trang web sẽ có sẵn tại địa chỉ được cung cấp.

Sau khi deploy, bạn sẽ có một URL công khai. Mỗi khi bạn cập nhật file JSON và đẩy thay đổi lên Git, các nền tảng này sẽ tự động build và deploy lại phiên bản mới.

Chúc bạn thành công!

