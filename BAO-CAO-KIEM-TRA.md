# Báo cáo kiểm tra dự án Con Cưng

Ngày kiểm tra: 05/09/2026.

## Kết luận

Dự án là bản mẫu giao diện thương mại điện tử, chưa sẵn sàng nhận đơn hàng thật. Mã có thể biên dịch thành công nhưng các chức năng tài khoản, đặt hàng, thanh toán và quản trị chưa có dịch vụ xử lý phía máy chủ. Một số luồng giao diện đang tạo kết quả sai ngay cả khi chỉ dùng dữ liệu mẫu.

## Phạm vi và bằng chứng kiểm tra

- Rà soát cấu trúc 54 tệp trong `src`, cấu hình, dữ liệu mẫu, các trang, thành phần giao diện và giỏ hàng.
- Công nghệ: Next.js 14.2.15, React 18, TypeScript strict, Tailwind CSS, Zustand, React Hook Form và Zod.
- Dữ liệu danh mục chính gồm 8 sản phẩm, 6 danh mục, 5 cửa hàng. Các khối quảng cáo khai báo sản phẩm riêng, không đồng bộ với danh mục chính.
- TypeScript: `tsc --noEmit --incremental false` đạt, mã thoát 0.
- Build tại thư mục gốc bị lỗi quyền truy cập `.next/trace`. Build trên bản sao tạm với cùng mã và thư viện đã thành công, tạo 12 trang tĩnh tính cả trang hệ thống. Đây không phải lỗi biên dịch mã nguồn.
- Chạy bản production tại địa chỉ nội bộ và kiểm tra 72 địa chỉ nội bộ duy nhất xuất hiện trong HTML trang chủ: 27 trả 404; 16 đường dẫn sản phẩm không tồn tại trong dữ liệu.
- `npm run lint` chưa thực hiện được kiểm tra: mở trình thiết lập ESLint vì chưa có cấu hình và bộ phụ thuộc lint tương ứng.
- Không tìm thấy bộ kiểm thử tự động, script test, README, cấu hình CI hoặc kho Git trong thư mục được cung cấp.
- `npm audit --omit=dev` ghi nhận 2 gói bị ảnh hưởng: Next.js mức critical, PostCSS phụ thuộc bên trong Next.js mức high. Đây là phân loại theo phiên bản thư viện, không phải xác nhận mọi lỗ hổng đều khai thác được trên ứng dụng này.
- Không thay đổi mã chức năng. Máy chủ kiểm tra đã được dừng.

## Các vấn đề cần xử lý trước khi nhận đơn thật

### 1. Đặt hàng báo thành công nhưng không tạo đơn — P1

Vị trí: [checkout/page.tsx](C:/Users/TUAN/concung/src/app/(main)/checkout/page.tsx:62).

Hàm gửi đơn chỉ ghi dữ liệu ra console, bật thông báo thành công rồi xóa giỏ. Không lưu đơn, không trả mã đơn và không gọi cổng VNPAY dù giao diện cho chọn phương thức này. Người dùng mất giỏ hàng mà hệ thống không có đơn để xử lý. Trang cũng cho gửi biểu mẫu khi giỏ trống.

Khắc phục: tạo đơn và xác minh giá/tồn kho phía máy chủ; chỉ xóa giỏ khi đơn đã được lưu. Tách trạng thái tạo đơn và trạng thái thanh toán; chặn giỏ rỗng.

### 2. Đăng nhập, đăng ký và quản trị chỉ là mô phỏng — P1

Vị trí: [login/page.tsx](C:/Users/TUAN/concung/src/app/(main)/login/page.tsx:29), [register/page.tsx](C:/Users/TUAN/concung/src/app/(main)/register/page.tsx:37), [account/page.tsx](C:/Users/TUAN/concung/src/app/(main)/account/page.tsx:13), [admin/page.tsx](C:/Users/TUAN/concung/src/app/admin/page.tsx:18).

Biểu mẫu hợp lệ luôn báo thành công, không kiểm tra tài khoản hoặc tạo phiên đăng nhập. Cả mật khẩu và thông tin đăng ký được ghi ra console. `/account` hiển thị cùng một hồ sơ mẫu; nút đăng xuất không có xử lý. `/admin` truy cập trực tiếp trả HTTP 200, số liệu và đơn hàng là dữ liệu viết sẵn, nút thêm sản phẩm không có hành động.

Chưa có bằng chứng lộ dữ liệu khách hàng thật vì dữ liệu hiện là mock. Tuy nhiên cần xác thực, phân quyền phía máy chủ và bỏ ghi mật khẩu trước khi kết nối dữ liệu thật.

### 3. Thư viện có cảnh báo bảo mật — P1

Vị trí: [package.json](C:/Users/TUAN/concung/package.json:16), `package-lock.json`.

Next.js 14.2.15 nằm trong dải phiên bản bị ảnh hưởng của nhiều cảnh báo. Ví dụ, nhà phát triển xác nhận lỗi bỏ qua kiểm tra phân quyền trong middleware ảnh hưởng Next.js 14 trước 14.2.25: [thông báo chính thức GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw). Dự án hiện chưa có middleware xác thực, nên không kết luận đã tái hiện kiểu khai thác đó.

Khắc phục: nâng cấp theo kế hoạch tương thích, kiểm tra lại toàn bộ audit và luồng chính. Không chỉ vá riêng cảnh báo middleware vì audit còn báo các vấn đề khác; không tự động ép nâng phiên bản lớn mà bỏ qua kiểm thử.

### 4. “Mua Ngay Giao 2H” bỏ qua sản phẩm đang xem — P1

Vị trí: [product/page.tsx](C:/Users/TUAN/concung/src/app/(main)/product/[slug]/page.tsx:196).

Nút chỉ chuyển tới `/checkout`, không gọi thêm sản phẩm với phân loại và số lượng đang chọn. Giỏ đang rỗng thì đơn rỗng; giỏ có hàng cũ thì thanh toán hàng cũ.

Khắc phục: đưa đúng sản phẩm/phân loại/số lượng vào luồng mua ngay trước khi chuyển trang.

### 5. Giảm giá bị mất ở bước thanh toán — P1

Vị trí: [cart/page.tsx](C:/Users/TUAN/concung/src/app/(main)/cart/page.tsx:17), [checkout/page.tsx](C:/Users/TUAN/concung/src/app/(main)/checkout/page.tsx:267).

Mã `BABYMART50` chỉ cập nhật state tại trang giỏ. Checkout lấy tổng giá gốc từ store và không biết mã đã áp dụng. Ví dụ giỏ 385.000đ hiển thị 335.000đ sau voucher nhưng checkout lại hiển thị 385.000đ.

Khắc phục: dùng chung dữ liệu giảm giá và kết quả tính tổng, xác nhận điều kiện voucher phía máy chủ.

### 6. Đường dẫn sản phẩm không tồn tại hiển thị nhầm hàng — P1

Vị trí: [product/page.tsx](C:/Users/TUAN/concung/src/app/(main)/product/[slug]/page.tsx:28).

Khi không tìm thấy slug, trang tự lấy `MOCK_PRODUCTS[0]`. Có 16 đường dẫn sản phẩm duy nhất trên trang chủ không tồn tại trong danh mục, ví dụ `/product/siro-smartbibi-zinc`, nhưng trang trả HTTP 200 và hiển thị Moony. Người dùng có thể thêm nhầm sản phẩm vào giỏ.

Khắc phục: dùng một nguồn dữ liệu chung cho quảng cáo và chi tiết; trả trang không tìm thấy khi slug sai.

## Các lỗi chức năng và trải nghiệm khác

### 7. Danh mục và bộ lọc không hoạt động — P2

Vị trí: [category/page.tsx](C:/Users/TUAN/concung/src/app/(main)/category/[slug]/page.tsx:20).

Điều kiện `p.categorySlug === params.slug || true` luôn đúng. Danh mục tã hiển thị cả sữa và các nhóm khác. Đã xác nhận phản hồi `/category/ta-bim` chứa cả Moony và Friso. Các checkbox giá/thương hiệu/xuất xứ, danh mục con và chọn sắp xếp chưa có logic xử lý; các tham số `age`, `type`, `size` từ menu cũng bị bỏ qua.

Khắc phục: lọc đúng danh mục, đọc và áp dụng tham số URL, nối các điều khiển với dữ liệu.

### 8. 27 địa chỉ trang chủ trả 404 — P2

Vị trí: [UtilityServicesSection.tsx](C:/Users/TUAN/concung/src/features/home/UtilityServicesSection.tsx:21), [BrandDealsSection.tsx](C:/Users/TUAN/concung/src/features/home/BrandDealsSection.tsx:22).

15 liên kết tiện ích không có trang: `/sieu-thi`, `/cskh`, `/pink-gpt`, `/thai-ky`, `/bao-hiem`, `/nha-thuoc`, `/uu-dai-hoi-vien`, `/livestream`, `/xem-hoa-don`, `/mua-lai`, `/sieu-hoi-giam-gia`, `/tien-tich-luy`, `/the-uu-dai`, `/vieon`, `/uu-dai-vip`.

12 liên kết thương hiệu không có trang: `/brand/animo`, `/brand/metafresh`, `/brand/colosbaby`, `/brand/nutimilk`, `/brand/nfood`, `/brand/springem`, `/brand/metacare`, `/brand/optimum`, `/brand/enterogermina`, `/brand/gumizing`, `/brand/corbiere`, `/brand/babyplus`.

Khắc phục trước mắt: sửa “Tìm siêu thị” thành `/stores`; xây trang đích hoặc bỏ khả năng bấm cho dịch vụ chưa triển khai.

### 9. Phân loại sản phẩm không nhất quán — P2

Vị trí: [ProductCard.tsx](C:/Users/TUAN/concung/src/components/common/ProductCard.tsx:24), [product/page.tsx](C:/Users/TUAN/concung/src/app/(main)/product/[slug]/page.tsx:32), [mockProducts.ts](C:/Users/TUAN/concung/src/data/mockProducts.ts:34).

Nút thêm nhanh bỏ qua phân loại. Trang Moony có tên Size L nhưng mặc định chọn phần tử đầu tiên là Size M. Khi thanh toán, tên phân loại không được hiển thị và key chỉ dùng product ID, gây trùng key khi có nhiều size cùng sản phẩm. Thuộc tính `inStock` cũng chưa được kiểm tra khi chọn/mua; hiện dữ liệu mẫu đều đánh dấu còn hàng.

Khắc phục: yêu cầu chọn phân loại hoặc mặc định đúng biến thể của sản phẩm; hiển thị biến thể xuyên suốt giỏ và đơn, dùng key kết hợp product ID/variant ID.

### 10. Bộ đếm Flash Sale tăng ngược thời gian — P2

Vị trí: [FlashSaleSection.tsx](C:/Users/TUAN/concung/src/features/home/FlashSaleSection.tsx:15).

Khi giây về 0 và phút còn lớn hơn 0, mã gán phút bằng 59 thay vì giảm 1. Ví dụ `05:24:00` thành `05:59:59`, nên bộ đếm không kết thúc đúng. Tải lại trang cũng đặt lại toàn bộ thời gian.

Khắc phục: tính thời gian còn lại từ mốc kết thúc cố định và xử lý khi hết hạn.

### 11. Kiểm tra số điện thoại chấp nhận dữ liệu sai — P2

Vị trí: [checkout/page.tsx](C:/Users/TUAN/concung/src/app/(main)/checkout/page.tsx:25), [register/page.tsx](C:/Users/TUAN/concung/src/app/(main)/register/page.tsx:16).

Đã chạy trực tiếp biểu thức hiện tại: `abc0988123456` và `0|12345678` được chấp nhận, trong khi `0988 123 456` đúng theo ví dụ trên biểu mẫu bị từ chối. Nguyên nhân là thiếu neo toàn chuỗi, ký tự `|` trong nhóm ký tự và chưa chuẩn hóa khoảng trắng.

Khắc phục: chuẩn hóa đầu vào, kiểm tra toàn bộ chuỗi theo định dạng ứng dụng hỗ trợ.

### 12. Lưu voucher chưa có giá trị sử dụng — P2

Vị trí: [VoucherStrip.tsx](C:/Users/TUAN/concung/src/features/home/VoucherStrip.tsx:90).

Nút lưu chỉ đưa ID vào state của component. Rời trang/tải lại sẽ mất; không có mã hoặc dữ liệu được chuyển sang giỏ hàng. Khắc phục bằng cách lưu voucher theo tài khoản hoặc store phù hợp và kết nối với bước tính giảm giá.

### 13. Một số màu banner không có trong bản build — P2

Vị trí: [tailwind.config.ts](C:/Users/TUAN/concung/tailwind.config.ts:4), [mockBanners.ts](C:/Users/TUAN/concung/src/data/mockBanners.ts:30).

Tailwind không quét `src/data`, trong khi màu banner được khai báo ở đó và đưa vào class động. Kiểm tra CSS build xác nhận thiếu `from-amber-500`, `to-orange-500`, `from-pink-500`, `to-rose-400`. Hai banner tương ứng mất gradient dự kiến.

Khắc phục: mở rộng vùng quét tới toàn bộ `src` hoặc khai báo danh sách class cần giữ.

### 14. Nội dung thương hiệu và tiện ích chưa thống nhất — P3

Header dùng Con Cưng nhưng nhiều trang còn BabyMart/BabyClub. Số cửa hàng trên TopBar là 1158, nội dung trang chủ gần 150, dữ liệu mẫu chỉ có 5. Header/footer quảng bá giao 1h, checkout và chi tiết sản phẩm ghi 2h. Các số liệu và ảnh mẫu cần được thay/duyệt trước khi công khai.

Các nút chỉ có biểu tượng ở slider và nút đóng menu còn thiếu tên truy cập; menu chủ yếu mở bằng hover. Component Input gọi `useId()` có điều kiện qua `id || React.useId()`, nên cần sửa thành gọi hook vô điều kiện. Chưa thực hiện kiểm thử trình đọc màn hình hoặc bàn phím để đánh giá đầy đủ mức ảnh hưởng.

## Điểm tích cực

- Cấu trúc thư mục tách trang, thành phần, dữ liệu, kiểu và state tương đối rõ.
- TypeScript strict và production build đều đạt trên bản sao kiểm tra.
- Giỏ có cơ chế lưu localStorage và phân biệt dòng theo biến thể tại store.
- Tìm kiếm có logic lọc tên/thương hiệu/danh mục; cửa hàng có logic lọc thành phố và địa chỉ.
- Biểu mẫu có Zod kiểm tra và hiển thị lỗi; trang tìm kiếm có Suspense.

## Thứ tự đề xuất

1. Xử lý thư viện bảo mật và thông báo thành công giả; hoàn thiện xác thực, lưu đơn, kiểm tra tổng tiền phía máy chủ.
2. Sửa mua ngay, voucher, phân loại sản phẩm và dữ liệu quảng cáo/chi tiết.
3. Sửa danh mục, bộ lọc, liên kết 404, số điện thoại, bộ đếm và màu banner.
4. Bổ sung lint không tương tác, kiểm thử hồi quy cho các luồng trên, tài liệu chạy dự án và quản lý phiên bản.
5. Kiểm thử trực tiếp desktop/mobile, bàn phím, tốc độ tải ảnh và tích hợp thanh toán trước khi phát hành.

## Giới hạn

Đây là rà soát mã nguồn, cấu hình, kiểm tra kiểu, build, thư viện và phản hồi HTTP nội bộ. Chưa thao tác mọi biểu mẫu bằng trình duyệt, chưa đo Lighthouse, chưa đánh giá trực quan từng kích thước màn hình, chưa kiểm thử tải hay thử xâm nhập. Không có backend hoặc tài khoản dịch vụ thật để kiểm chứng thanh toán, giao vận và dữ liệu khách hàng. Các lỗi luồng biểu mẫu nêu trên được xác nhận từ logic mã nguồn, không được mô tả là kiểm thử đầu cuối đã chạy.
