# Định hướng frontend theo concung.com

Ngày đối chiếu: 05/09/2026. Mục tiêu: tái tạo giao diện trang chủ và hành vi giao diện, dùng dữ liệu mẫu, chưa tích hợp backend.

## Cơ sở đối chiếu

Đã mở https://concung.com/, xem ảnh đầu trang tại viewport 1440×900 và đọc cấu trúc nội dung toàn trang bằng trình duyệt. Đã mở bản production tạm của dự án, đọc cấu trúc giao diện và kiểm tra lại mã hiện tại. Khối BestSellersSection đã thay đổi so với bản production tạm; nhận xét về khối này dựa trên mã mới nhất và ảnh gốc trong public.

Kết nối điều khiển trình duyệt bị ngắt trong quá trình đối chiếu, nên chưa hoàn tất chụp cặp ảnh toàn trang, đo computed styles, kiểm tra mobile hoặc trạng thái sau khi chọn khu vực. Không đưa ra tỷ lệ phần trăm độ giống khi chưa có phép đo ảnh cùng trạng thái.

## Đánh giá tổng thể

Khung Next.js hiện tại có thể tiếp tục sử dụng. Các khối voucher, tiện ích, deal, săn quà, mua nhanh và thương hiệu đã đi đúng hướng về tổ chức. Tuy nhiên trang vẫn pha trộn phần mô phỏng Con Cưng với thiết kế BabyMart tự xây dựng. Muốn đạt độ giống sát từng pixel, cần sửa cấu trúc và bộ hình trước rồi mới tinh chỉnh CSS.

Các vấn đề backend trong báo cáo trước được chuyển sang giai đoạn sau. Trong giai đoạn này, cần giao diện và tương tác mẫu nhất quán: chuyển tab, slider, mở menu, chọn khu vực, gợi ý tìm kiếm, chọn phân loại và phản hồi khi bấm nút.

## Đối chiếu cụ thể

| Khu vực | Trang tham chiếu đã quan sát | Dự án hiện tại | Hướng xử lý |
|---|---|---|---|
| Đầu trang | Banner chiến dịch, thanh tiện ích, logo, tìm kiếm, giỏ hàng và ưu đãi | Có đủ thành phần chính; icon và một số nhãn được dựng lại | Giữ cấu trúc; đo lại kích thước, khoảng cách, font và dùng đúng asset |
| Lưới desktop | Sidebar trái và vùng nội dung phải rộng | Sidebar 220px, nội dung bù margin 236px, vị trí top cố định | Đo lưới từ ảnh chuẩn; dùng một cấu hình chung cho header/sidebar/content; xác minh hành vi khi cuộn trước khi chọn sticky/fixed |
| Hero | Banner quảng cáo đồ họa nguyên khối, nhiều slide | Banner gradient với tiêu đề HTML lớn, nút CTA và ảnh Unsplash; tối thiểu cao 400px trên desktop | Thay toàn bộ phần trình bày bằng slider banner đúng chiến dịch, đúng tỷ lệ |
| Chọn khu vực | Có hộp chọn miền ngay lần truy cập quan sát | Chưa có giao diện tương ứng | Thêm modal mẫu và lưu lựa chọn tại trình duyệt; không cần backend |
| Voucher | Thẻ ngang, nhiều voucher thay đổi theo ngày | Đã có cấu trúc tương tự nhưng thiếu voucher đầu hiện tại, dữ liệu khác | Chốt bộ dữ liệu theo mốc tham chiếu; khớp chiều rộng thẻ, răng vé, nút lưu, số thẻ thấy được |
| Tiện ích | Carousel 18 mục trong cấu trúc trang đã đọc | Có 15 mục | Đủ danh sách, đúng thứ tự, đúng icon, nhãn và badge; đo số mục trên một khung |
| Săn quà / mua nhanh | Ảnh, khung khuyến mãi, thông số và giá theo sản phẩm | Có các khối tương ứng nhưng danh sách và ảnh chưa đồng bộ | Dùng bộ sản phẩm cố định chung, khớp đúng từng ảnh và lớp phủ |
| Ưu đãi thương hiệu | Có ảnh và tiêu đề ưu đãi dạng nội dung trong cấu trúc trang | Component chỉ render ảnh, promoText chỉ làm alt | Tách ảnh sản phẩm và nhãn HTML nếu ảnh chưa bao gồm nhãn; tránh hiển thị hai lần |
| Bán chạy | Năm nhóm: Bán Chạy, Xu Hướng, Top Review Tốt, Top Mua Lại, Top Giỏ Hàng | Mã mới đã có năm tab và trạng thái chọn | Giữ phần mới; sửa mapping ảnh. Hai sản phẩm tã Animo dùng prod_1.png nhưng ảnh này thực tế là siro Smartbibi |
| Sau Bán chạy | Có Thông tin bổ ích, Chủ đề cho bạn và các nhóm gợi ý | Đang là Flash Sale tự tạo, danh mục mẫu, bán chạy lặp, cam kết và banner BabyMart | Thay bằng đúng các khối trong tham chiếu đã chốt |
| Footer | Có cam kết, thông tin công ty, hỗ trợ, thanh toán, vận chuyển, tải ứng dụng và mạng xã hội | Footer slate tối tự thiết kế, thiếu nhiều nhóm và có liên kết Admin | Xây lại theo tham chiếu; bỏ nội dung không thuộc trang mẫu |
| Mobile | Chưa quan sát trực tiếp trong lượt này | Có cách ẩn sidebar và MobileNav do dự án tự xây | Chưa coi là đã đúng; cần lấy tham chiếu mobile riêng trước khi triển khai tiếp |

## Những thay đổi nên làm đầu tiên

1. **Hero và lưới đầu trang.** Đây là vùng khác biệt lớn nhất ngay khi mở. Ảnh tham chiếu 1440×900 cho thấy hero khoảng 980×320px, chỉ là ước lượng trực quan cần đo DOM xác nhận. Mã hiện tại dành khoảng 940px cho cột phải và hero cao tối thiểu 400px. Sai lệch này kéo mọi khối dưới xuống và làm số nội dung nhìn thấy khác hẳn.
2. **Bộ ảnh đúng sản phẩm.** `public/images/ban-chay/prod_1.png` là ảnh siro 388×320px có sẵn nhãn tặng, chấm phân trang và một phần điều hướng. Không dùng nó cho tã Animo, cũng không đắp thêm lớp nhãn giống hệt. Phân loại mỗi asset thành ảnh sạch hoặc ảnh đã ghép đầy đủ để quyết định cách render.
3. **Cấu trúc phần cuối trang và footer.** Bỏ các khối BabyMart không có trong mẫu đang đối chiếu; thêm thông tin bổ ích, chủ đề và gợi ý. Không dành công chỉnh chi tiết cho các khối sẽ bị bỏ.
4. **Font và token giao diện.** Dự án đang dùng Be Vietnam Pro toàn trang, Nunito tại voucher và nhiều mã hồng rải rác. Cần lấy font/weight/line-height/color từ computed styles của trang mẫu, chưa kết luận font cụ thể chỉ từ ảnh. Gom thông số đã đo vào một bộ token chung.

## Quy trình triển khai đề xuất

### Bước 1 — Chốt bộ tham chiếu

- Xác định phạm vi đầu tiên là trang chủ `/`; trang danh mục, chi tiết, giỏ hàng và đăng nhập là các bộ đối chiếu tiếp theo.
- Chốt cùng khu vực thử nghiệm, trạng thái chưa đăng nhập, giỏ rỗng, slide đầu và tab đầu.
- Chụp desktop 1440×900, 1366×768; mobile 390×844, 375×812. Đây là kích thước kiểm thử đề xuất, chưa phải tất cả đã kiểm tra.
- Lưu ngày, URL, ảnh toàn trang và ảnh từng khối. Banner/giá/voucher thay đổi nên nghiệm thu theo bộ chụp cố định.
- Lập bảng tài nguyên: vị trí, ảnh, tỷ lệ, trạng thái đã có/sai/thiếu, ảnh sạch hay ảnh ghép.

### Bước 2 — Khớp cấu trúc

Sửa header, chiều rộng hai cột, hero và thứ tự các khối. Chỉ dùng nội dung có trong tham chiếu. Giữ nguyên framework và các component đang phù hợp.

### Bước 3 — Khớp hình và thẻ

Chuẩn hóa ảnh banner/icon/sản phẩm. Dùng một component thẻ có các biến thể về khung, quà, size, giảm giá; mỗi sản phẩm trỏ tới đúng ảnh. Tránh sao chép nguyên thẻ bằng ảnh vì không co giãn và tương tác đúng. Với banner quảng cáo đồ họa, dùng ảnh nguyên khối là phù hợp.

### Bước 4 — Khớp tương tác frontend

Làm modal khu vực, menu, tìm kiếm, carousel, tab và nút lưu voucher bằng state/localStorage. Dữ liệu mẫu đủ để kiểm tra tương tác; chưa cần xác thực thật, cổng thanh toán hoặc cơ sở dữ liệu. Liên kết chưa triển khai cần có trạng thái frontend rõ ràng, tránh đưa người thử nghiệm sang sản phẩm khác.

### Bước 5 — Kiểm tra ảnh và responsive

Chụp hai trang ở cùng kích thước, cùng điểm cuộn và cùng trạng thái. Chồng ảnh/so khác biệt từng vùng; sửa từ khung lớn đến font, padding, border, icon. Kiểm tra thêm lúc menu mở, đổi slide, chọn tab và trên mobile. Chỉ đo khi font/ảnh đã tải xong và nội dung chuyển động đã được đưa về cùng trạng thái.

## Tiêu chí nghiệm thu

- Đủ và đúng thứ tự các khối; không còn khối tự thêm khác mẫu.
- Banner, logo, icon, sản phẩm và văn bản đúng bộ tham chiếu.
- Mép cột, chiều cao khối, số thẻ nhìn thấy và xuống dòng khớp.
- Màu, font, độ đậm, bo góc, đường viền, bóng và trạng thái chọn khớp.
- Không có cuộn ngang ngoài ý muốn hoặc lớp nổi che nội dung ở kích thước kiểm thử.
- Tab, carousel, menu và modal có phản hồi frontend đúng trạng thái mẫu.
- Kiểm tra sai khác ảnh theo từng khối; các vùng thay đổi như banner tự chạy phải được đồng bộ trước khi so.

“100%” nên được hiểu là khớp bộ tham chiếu đã chốt trên môi trường kiểm thử đã thống nhất. Không thể dùng một trang bán hàng thay đổi liên tục làm chuẩn ảnh bất biến. Hiện chưa có đủ dữ liệu để chấm điểm phần trăm độ giống.

## Tệp ưu tiên

- [Khung trang chủ](C:/Users/TUAN/concung/src/app/(main)/page.tsx)
- [Header](C:/Users/TUAN/concung/src/components/layout/Header.tsx)
- [HeroSlider](C:/Users/TUAN/concung/src/features/home/HeroSlider.tsx)
- [Dữ liệu banner](C:/Users/TUAN/concung/src/data/mockBanners.ts)
- [BestSellersSection mới](C:/Users/TUAN/concung/src/features/home/BestSellersSection.tsx)
- [Footer](C:/Users/TUAN/concung/src/components/layout/Footer.tsx)
- [Font gốc](C:/Users/TUAN/concung/src/app/layout.tsx)
- [Cấu hình giao diện](C:/Users/TUAN/concung/tailwind.config.ts)

Nguồn tham chiếu: [Trang chủ Con Cưng](https://concung.com/), truy cập ngày 05/09/2026. Chưa sửa mã frontend trong lượt đối chiếu này.
